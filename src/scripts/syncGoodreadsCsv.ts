/**
 * Sync Goodreads CSV export to the local books collection.
 * Deduplicates by goodreadsId or title+author, adds new books, then enhance + covers.
 */

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { getParsedGoodreadsBooksFromFile } from "./parseGoodreadsCsv";
import type { ParsedGoodreadsBook } from "./parseGoodreadsCsv";
import { isLLMEnabled } from "../config/llm";
import { llmService } from "../services/llmService";
import { openLibraryService } from "../services/openLibraryService";
import type { BookWithEnhancedData } from "../types/books";

const REPO_ROOT = join(process.cwd());
const BOOKS_DIR = join(REPO_ROOT, "src", "content", "books");
const COVERS_DIR = join(REPO_ROOT, "public", "book-covers");
const COVER_REQUEST_DELAY_MS = 400;

/** Minimal shape we need from existing book JSON for deduplication. */
interface ExistingBookRecord {
  filePath: string;
  goodreadsId?: string;
  title: string;
  author: string;
}

export interface ExistingLookup {
  byGoodreadsId: Map<string, string>;
  byTitleAuthor: Map<string, string>;
}

/**
 * Normalize title and author to a deterministic key for matching.
 * Used for both existing books and CSV rows so they compare equal.
 */
export function normalizeTitleAuthor(title: string, author: string): string {
  const t = (title ?? "")
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const a = (author ?? "")
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return `${t}|${a}`;
}

/**
 * Load all book JSONs from the collection and return records with goodreadsId, title, author.
 */
export async function loadExistingBooks(
  booksDir: string = BOOKS_DIR
): Promise<ExistingBookRecord[]> {
  const files = await readdir(booksDir);
  const jsonFiles = files.filter((f) => f.endsWith(".json"));
  const records: ExistingBookRecord[] = [];

  for (const file of jsonFiles) {
    const filePath = join(booksDir, file);
    try {
      const content = await readFile(filePath, "utf-8");
      const data = JSON.parse(content) as {
        goodreadsId?: string;
        title?: string;
        author?: string;
      };
      const title = (data.title ?? "").trim();
      const author = (data.author ?? "").trim();
      if (title || author) {
        records.push({
          filePath,
          goodreadsId: data.goodreadsId?.trim() || undefined,
          title,
          author,
        });
      }
    } catch {
      // Skip unreadable or invalid JSON
    }
  }

  return records;
}

/**
 * Build lookup maps for deduplication: by goodreadsId (when present) and by normalized title+author.
 */
export function buildExistingLookup(
  existing: ExistingBookRecord[]
): ExistingLookup {
  const byGoodreadsId = new Map<string, string>();
  const byTitleAuthor = new Map<string, string>();

  for (const rec of existing) {
    if (rec.goodreadsId) {
      byGoodreadsId.set(rec.goodreadsId, rec.filePath);
    }
    const key = normalizeTitleAuthor(rec.title, rec.author);
    if (key) {
      byTitleAuthor.set(key, rec.filePath);
    }
  }

  return { byGoodreadsId, byTitleAuthor };
}

/**
 * Return only books that are not already in the collection (match by goodreadsId or title+author).
 */
export function filterToNewBooks(
  books: ParsedGoodreadsBook[],
  lookup: ExistingLookup
): ParsedGoodreadsBook[] {
  return books.filter((book) => {
    if (book.goodreadsId && lookup.byGoodreadsId.has(book.goodreadsId)) {
      return false;
    }
    const key = normalizeTitleAuthor(book.title, book.author);
    if (key && lookup.byTitleAuthor.has(key)) {
      return false;
    }
    return true;
  });
}

/** Generate slug from title (same logic as addBook.ts). */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 100);
}

/**
 * Generate a unique filename in booksDir (slug or slug-N) that does not yet exist.
 */
export async function generateUniqueBookFilename(
  title: string,
  booksDir: string = BOOKS_DIR
): Promise<string> {
  const { access } = await import("node:fs/promises");
  let slug = generateSlug(title);
  let filename = join(booksDir, `${slug}.json`);
  let counter = 1;
  while (true) {
    try {
      await access(filename);
      slug = `${generateSlug(title)}-${counter}`;
      filename = join(booksDir, `${slug}.json`);
      counter++;
    } catch {
      return filename;
    }
  }
}

/**
 * Serialize a parsed Goodreads book to the JSON shape expected by the content collection.
 */
function bookToCollectionJson(book: ParsedGoodreadsBook): Record<string, unknown> {
  return {
    title: book.title,
    author: book.author,
    dateFinished: book.dateFinished,
    genre: book.genre,
    pages: book.pages,
    readingYear: book.readingYear,
    readingMonth: book.readingMonth,
    isCurrentlyReading: book.isCurrentlyReading,
    goodreadsId: book.goodreadsId,
    rating: book.rating,
    ...(book.isbn && { isbn: book.isbn }),
    ...(book.isbn13 && { isbn13: book.isbn13 }),
  };
}

/**
 * Write a new book to the collection. Uses generateUniqueBookFilename and bookToCollectionJson.
 */
export async function addNewBookToCollection(
  book: ParsedGoodreadsBook,
  booksDir: string = BOOKS_DIR
): Promise<string> {
  const filePath = await generateUniqueBookFilename(book.title, booksDir);
  const data = bookToCollectionJson(book);
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  return filePath;
}

/** Book JSON shape on disk (has string dateFinished). */
type BookJson = Record<string, unknown> & {
  title?: string;
  author?: string;
  dateFinished?: string;
  genre?: string;
  pages?: number;
  coverUrl?: string;
  readingYear?: number;
  readingMonth?: number;
  isCurrentlyReading?: boolean;
  goodreadsId?: string;
  rating?: number;
  llmProcessed?: boolean;
  localCoverPath?: string;
};

function bookJsonToEnhancedData(data: BookJson): BookWithEnhancedData {
  return {
    title: (data.title as string) ?? "",
    author: (data.author as string) ?? "",
    dateFinished: data.dateFinished ? new Date(data.dateFinished as string) : new Date(),
    genre: (data.genre as string) ?? "Unknown",
    pages: typeof data.pages === "number" ? data.pages : 0,
    coverUrl: (data.coverUrl as string) ?? "",
    readingYear: typeof data.readingYear === "number" ? data.readingYear : new Date().getFullYear(),
    readingMonth: typeof data.readingMonth === "number" ? data.readingMonth : 1,
    isCurrentlyReading: Boolean(data.isCurrentlyReading),
    goodreadsId: data.goodreadsId != null ? String(data.goodreadsId) : undefined,
    rating: typeof data.rating === "number" ? data.rating : 0,
    enhancedGenre: data.enhancedGenre as string | undefined,
    bookCategory: data.bookCategory as string | undefined,
    readingLevel: data.readingLevel as string | undefined,
    themes: data.themes as string[] | undefined,
    targetAudience: data.targetAudience as string | undefined,
    complexity: data.complexity as string | undefined,
    readingTime: data.readingTime as string | undefined,
    relatedBooks: data.relatedBooks as string[] | undefined,
    keyInsights: data.keyInsights as string[] | undefined,
    tags: data.tags as string[] | undefined,
    llmProcessed: Boolean(data.llmProcessed),
    llmProcessedAt: data.llmProcessedAt as string | undefined,
  };
}

/**
 * Enhance a single book file with LLM categorization if not already processed.
 * Skips if llmProcessed or LLM disabled. On error logs and returns false.
 */
export async function enhanceBookFile(filePath: string): Promise<boolean> {
  if (!isLLMEnabled()) return false;
  try {
    const content = await readFile(filePath, "utf-8");
    const data: BookJson = JSON.parse(content);
    if (data.llmProcessed) return false;
    const book = bookJsonToEnhancedData(data);
    const result = await llmService.processBook(book);
    if (!result.success || !result.data) {
      console.warn(`Enhance skipped for ${data.title}: ${result.error ?? "no data"}`);
      return false;
    }
    const r = result.data;
    Object.assign(data, {
      enhancedGenre: r.enhancedGenre,
      bookCategory: r.bookCategory,
      readingLevel: r.readingLevel,
      themes: r.themes,
      targetAudience: r.targetAudience,
      complexity: r.complexity,
      readingTime: r.readingTime,
      relatedBooks: r.relatedBooks,
      keyInsights: r.keyInsights,
      tags: r.tags,
      llmProcessed: true,
      llmProcessedAt: new Date().toISOString(),
    });
    await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.warn(`Enhance failed for ${filePath}:`, err);
    return false;
  }
}

/** Strip parenthetical series info e.g. "Title (Series, #1)" -> "Title" for better search match. */
function shortTitle(title: string): string {
  return title.replace(/\s*\([^)]*\)\s*$/, "").trim() || title;
}

/**
 * Resolve a cover URL for a book: Open Library by title+author, then short title, then work details fallback, then ISBN.
 */
export async function resolveCoverUrl(book: {
  title: string;
  author: string;
  isbn13?: string;
}): Promise<string | undefined> {
  const trySearch = async (t: string, a: string) => {
    const search = await openLibraryService.searchBooks(t, a);
    if (!search.success || !search.searchResults?.length) return undefined;
    for (const doc of search.searchResults) {
      const url = openLibraryService.getCoverUrlFromBook(doc);
      if (url) return url;
    }
    // Search hit but no cover_i: fetch work details (works have covers[]).
    const first = search.searchResults[0];
    const key = first?.key;
    if (key && (key.startsWith("/works/") || (key.startsWith("OL") && key.endsWith("W")))) {
      const workId = key.startsWith("/") ? key.split("/").pop()! : key;
      await new Promise((r) => setTimeout(r, COVER_REQUEST_DELAY_MS));
      const details = await openLibraryService.getBookDetails(workId);
      if (details.success && details.data) {
        const u = openLibraryService.getCoverUrlFromBook(details.data);
        if (u) return u;
      }
    }
    return undefined;
  };

  let url = await trySearch(book.title, book.author);
  if (!url && shortTitle(book.title) !== book.title) {
    await new Promise((r) => setTimeout(r, COVER_REQUEST_DELAY_MS));
    url = await trySearch(shortTitle(book.title), book.author);
  }
  if (!url) {
    await new Promise((r) => setTimeout(r, COVER_REQUEST_DELAY_MS));
    url = await trySearch(shortTitle(book.title), "");
  }
  if (url) return url;

  if (book.isbn13) {
    const isbnUrl = `https://covers.openlibrary.org/b/isbn/${book.isbn13}-M.jpg`;
    try {
      const res = await fetch(isbnUrl, { method: "HEAD" });
      if (res.ok) return isbnUrl;
    } catch {
      // ignore
    }
  }
  return undefined;
}

function sanitizeFilename(s: string): string {
  return s
    .replace(/[<>:"/\\|?*]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w\-_.]/g, "")
    .toLowerCase();
}

async function downloadCover(url: string, outputPath: string): Promise<void> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const buffer = await response.arrayBuffer();
  await writeFile(outputPath, new Uint8Array(buffer));
}

/**
 * Ensure a book has a local cover: resolve URL, download to public/book-covers, update JSON.
 * Skips if localCoverPath already set. Adds small delay after request.
 */
export async function ensureBookCover(filePath: string): Promise<boolean> {
  try {
    const content = await readFile(filePath, "utf-8");
    const data: BookJson = JSON.parse(content);
    if (data.localCoverPath) return false;

    const coverUrl = (data.coverUrl ?? "") as string;
    if (coverUrl.startsWith("/book-covers/")) {
      const localPath = join(REPO_ROOT, "public", coverUrl);
      try {
        await readFile(localPath);
        data.localCoverPath = coverUrl;
        await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
        return true;
      } catch {
        // file missing, fall through to fetch
      }
    }

    const title = (data.title ?? "") as string;
    const author = (data.author ?? "") as string;
    const isbn13 = (data.isbn13 ?? data.isbn ?? "") as string;
    const url = await resolveCoverUrl({ title, author, isbn13: isbn13 || undefined });
    await new Promise((r) => setTimeout(r, COVER_REQUEST_DELAY_MS));
    if (!url) return false;
    await mkdir(COVERS_DIR, { recursive: true });
    const base = `${sanitizeFilename(title)}-${sanitizeFilename(author)}.jpg`;
    const localPath = join(COVERS_DIR, base);
    const relativePath = `/book-covers/${base}`;
    await downloadCover(url, localPath);
    data.localCoverPath = relativePath;
    data.coverUrl = data.coverUrl || url;
    await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.warn(`Cover failed for ${filePath}:`, err);
    return false;
  }
}

// CLI: npx tsx src/scripts/syncGoodreadsCsv.ts [path-to-csv] [--dry-run] [--no-enhance] [--no-covers]
//      npx tsx src/scripts/syncGoodreadsCsv.ts --test-cover <path-to-book-json>
const isMain =
  typeof process !== "undefined" &&
  process.argv[1] &&
  import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/"));
if (isMain) {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const noEnhance = args.includes("--no-enhance");
  const noCovers = args.includes("--no-covers");
  const testCoverIdx = args.indexOf("--test-cover");
  const testCoverPath = testCoverIdx >= 0 ? args[testCoverIdx + 1] : null;

  if (testCoverPath) {
    ensureBookCover(testCoverPath)
      .then((ok) => console.log(ok ? "Cover added." : "Skipped or failed."))
      .catch((err) => {
        console.error(err);
        process.exit(1);
      });
  } else {
  const csvArg = args.find((a) => !a.startsWith("--") && a !== "");
  const csvPath = csvArg ?? join(REPO_ROOT, "goodreads_library_export.csv");

  Promise.all([
    getParsedGoodreadsBooksFromFile(csvPath),
    loadExistingBooks(BOOKS_DIR),
  ])
    .then(([books, existing]) => {
      const lookup = buildExistingLookup(existing);
      const newBooks = filterToNewBooks(books, lookup);
      const skipped = books.length - newBooks.length;
      console.log(`Sync from ${csvPath}`);
      console.log(`  Existing: ${existing.length} | From CSV: ${books.length} | Skipped (already in collection): ${skipped} | New: ${newBooks.length}`);
      if (dryRun || newBooks.length === 0) {
        if (dryRun && newBooks.length > 0) {
          console.log("(dry-run: not writing files)");
        }
        return;
      }
      return Promise.all(
        newBooks.map((book) => addNewBookToCollection(book, BOOKS_DIR))
      ).then(async (paths) => {
        console.log(`Added ${paths.length} books to ${BOOKS_DIR}`);
        let enhanced = 0;
        if (!noEnhance && isLLMEnabled()) {
          for (const p of paths) {
            if (await enhanceBookFile(p)) enhanced++;
          }
          console.log(`Enhanced: ${enhanced}/${paths.length} books.`);
        } else if (!noEnhance && !isLLMEnabled()) {
          console.log("Enhancement skipped (LLM disabled).");
        }
        let covers = 0;
        if (!noCovers) {
          for (const p of paths) {
            if (await ensureBookCover(p)) covers++;
            await new Promise((r) => setTimeout(r, COVER_REQUEST_DELAY_MS));
          }
          console.log(`Covers: ${covers}/${paths.length} resolved and downloaded.`);
        }
        console.log("Done.");
      });
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
  }
}
