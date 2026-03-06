/**
 * Parse Goodreads library export CSV.
 * Handles quoted fields and Excel-style ISBN columns (e.g. ="""" or ="978…").
 */

import { readFile } from "node:fs/promises";
import Papa from "papaparse";

/** Raw row from Goodreads CSV (column names match export headers). */
export interface GoodreadsRow {
  "Book Id": string;
  Title: string;
  Author: string;
  "Author l-f": string;
  "Additional Authors": string;
  ISBN: string;
  ISBN13: string;
  "My Rating": string;
  "Average Rating": string;
  Publisher: string;
  Binding: string;
  "Number of Pages": string;
  "Year Published": string;
  "Original Publication Year": string;
  "Date Read": string;
  "Date Added": string;
  Bookshelves: string;
  "Bookshelves with positions": string;
  "Exclusive Shelf": string;
  "My Review": string;
  Spoiler: string;
  "Private Notes": string;
  "Read Count": string;
  "Owned Copies": string;
}

/** Row filtered for sync: only "read" (and optionally "currently-reading") with isCurrentlyReading set. */
export type GoodreadsRowForSync = GoodreadsRow & { isCurrentlyReading: boolean };

/**
 * Book-shaped object mapped from a Goodreads row (ready for collection JSON or further processing).
 * Genre defaults to "Unknown"; cover/LLM fields are added later.
 */
export interface ParsedGoodreadsBook {
  title: string;
  author: string;
  dateFinished: string; // ISO date YYYY-MM-DD
  genre: string;
  pages: number;
  readingYear: number;
  readingMonth: number;
  isCurrentlyReading: boolean;
  goodreadsId: string;
  rating: number;
  isbn?: string;
  isbn13?: string;
}

/**
 * Parse Goodreads date: "Date Read" if set, else "Date Added" (format YYYY/MM/DD).
 * Returns dateFinished (YYYY-MM-DD), readingYear, readingMonth.
 */
function parseGoodreadsDate(
  dateRead: string,
  dateAdded: string
): { dateFinished: string; readingYear: number; readingMonth: number } {
  const raw = (dateRead ?? "").trim() || (dateAdded ?? "").trim();
  if (!raw) {
    const fallback = new Date();
    return {
      dateFinished: fallback.toISOString().slice(0, 10),
      readingYear: fallback.getFullYear(),
      readingMonth: fallback.getMonth() + 1,
    };
  }
  // Goodreads uses YYYY/MM/DD
  const normalized = raw.replace(/\//g, "-");
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) {
    const fallback = new Date();
    return {
      dateFinished: fallback.toISOString().slice(0, 10),
      readingYear: fallback.getFullYear(),
      readingMonth: fallback.getMonth() + 1,
    };
  }
  return {
    dateFinished: date.toISOString().slice(0, 10),
    readingYear: date.getFullYear(),
    readingMonth: date.getMonth() + 1,
  };
}

/**
 * Map a filtered Goodreads row to the book shape used by the collection.
 */
export function mapGoodreadsRowToBook(
  row: GoodreadsRowForSync
): ParsedGoodreadsBook {
  const { dateFinished, readingYear, readingMonth } = parseGoodreadsDate(
    row["Date Read"] ?? "",
    row["Date Added"] ?? ""
  );
  const pagesRaw = (row["Number of Pages"] ?? "").trim();
  const pages = pagesRaw ? parseInt(pagesRaw, 10) : 0;
  const ratingRaw = (row["My Rating"] ?? "").trim();
  const rating = ratingRaw ? parseInt(ratingRaw, 10) : 0;
  const isbn = (row.ISBN ?? "").trim() || undefined;
  const isbn13 = (row.ISBN13 ?? "").trim() || undefined;
  return {
    title: (row.Title ?? "").trim(),
    author: (row.Author ?? "").trim(),
    dateFinished,
    genre: "Unknown",
    pages: Number.isNaN(pages) ? 0 : pages,
    readingYear,
    readingMonth,
    isCurrentlyReading: row.isCurrentlyReading,
    goodreadsId: (row["Book Id"] ?? "").trim(),
    rating: Number.isNaN(rating) ? 0 : Math.min(5, Math.max(0, rating)),
    ...(isbn && { isbn }),
    ...(isbn13 && { isbn13 }),
  };
}

export interface FilterByShelfOptions {
  /** Include rows with Exclusive Shelf "currently-reading" (default true). */
  includeCurrentlyReading?: boolean;
}

/**
 * Filter parsed rows to "read" and optionally "currently-reading"; set isCurrentlyReading.
 */
export function filterGoodreadsRowsByShelf(
  rows: GoodreadsRow[],
  options: FilterByShelfOptions = {}
): GoodreadsRowForSync[] {
  const { includeCurrentlyReading = true } = options;
  return rows
    .filter((row) => {
      const shelf = (row["Exclusive Shelf"] ?? "").trim().toLowerCase();
      return (
        shelf === "read" ||
        (includeCurrentlyReading && shelf === "currently-reading")
      );
    })
    .map((row) => ({
      ...row,
      isCurrentlyReading:
        (row["Exclusive Shelf"] ?? "").trim().toLowerCase() ===
        "currently-reading",
    }));
}

/**
 * Strip Excel-style quoted values (e.g. ="""" or ="9781234567890").
 * Returns the inner value or empty string.
 */
export function stripExcelQuoted(value: string): string {
  if (value == null || value === "") return "";
  const trimmed = String(value).trim();
  if (trimmed.startsWith('="') && trimmed.endsWith('"')) {
    const inner = trimmed.slice(2, -1);
    return inner.replace(/^"|"$/g, "").trim();
  }
  return trimmed;
}

/**
 * Parse Goodreads CSV content into typed rows.
 * Cleans ISBN/ISBN13 (Excel-style quoting) on each row.
 */
export function parseGoodreadsCsv(csvContent: string): GoodreadsRow[] {
  const parsed = Papa.parse<GoodreadsRow>(csvContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
    transform: (value) => (value != null ? String(value).trim() : ""),
  });

  if (parsed.errors.length > 0) {
    const first = parsed.errors[0];
    throw new Error(
      `CSV parse error: ${first.message} (row ${first.row ?? "?"})`
    );
  }

  return parsed.data.map((row) => ({
    ...row,
    ISBN: stripExcelQuoted(row.ISBN ?? ""),
    ISBN13: stripExcelQuoted(row.ISBN13 ?? ""),
  }));
}

/**
 * Read a Goodreads export CSV file and return parsed rows.
 */
export async function readGoodreadsCsvFromFile(
  filePath: string
): Promise<GoodreadsRow[]> {
  const content = await readFile(filePath, "utf-8");
  return parseGoodreadsCsv(content);
}

/**
 * Return an array of parsed books from CSV content (parse → filter by shelf → map).
 */
export function getParsedGoodreadsBooksFromCsvContent(
  csvContent: string,
  options: FilterByShelfOptions = {}
): ParsedGoodreadsBook[] {
  const rows = parseGoodreadsCsv(csvContent);
  const forSync = filterGoodreadsRowsByShelf(rows, options);
  return forSync.map(mapGoodreadsRowToBook);
}

/**
 * Read a Goodreads CSV file and return an array of parsed books (parse → filter by shelf → map).
 */
export async function getParsedGoodreadsBooksFromFile(
  filePath: string,
  options: FilterByShelfOptions = {}
): Promise<ParsedGoodreadsBook[]> {
  const content = await readFile(filePath, "utf-8");
  return getParsedGoodreadsBooksFromCsvContent(content, options);
}

// CLI: npx tsx src/scripts/parseGoodreadsCsv.ts <path-to-csv>
if (import.meta.url === `file://${process.argv[1]}`) {
  const csvPath = process.argv[2] ?? "goodreads_library_export.csv";
  getParsedGoodreadsBooksFromFile(csvPath)
    .then((books) => {
      console.log(`Parsed ${books.length} books from ${csvPath}`);
      const sample = books[0];
      if (sample) {
        console.log("Sample book:", {
          title: sample.title,
          author: sample.author,
          dateFinished: sample.dateFinished,
          readingYear: sample.readingYear,
          readingMonth: sample.readingMonth,
          pages: sample.pages,
          rating: sample.rating,
          goodreadsId: sample.goodreadsId,
          genre: sample.genre,
          isbn: sample.isbn ?? "(none)",
          isbn13: sample.isbn13 ?? "(none)",
        });
      }
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
