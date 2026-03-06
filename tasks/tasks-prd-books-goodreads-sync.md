# Task List: Books — Goodreads Sync & Local Cache

Based on [prd-books-goodreads-sync.md](./prd-books-goodreads-sync.md).

## Relevant Files

- `src/content.config.ts` — Add `goodreadsId` and `localCoverPath` to the books collection schema.
- `src/types/books.ts` — Add `goodreadsId` and `localCoverPath` to `Book` / `BookWithEnhancedData` (or ensure they are present).
- `src/scripts/syncGoodreadsCsv.ts` — **New:** Load/dedupe/add, enhance (LLM), cover resolution (Open Library title+author + ISBN) and download. `enhanceBookFile`, `resolveCoverUrl`, `ensureBookCover`. CLI: `[csv] [--dry-run] [--no-enhance] [--no-covers]`, `--test-cover <path>`.
- `src/scripts/syncGoodreadsCsv.test.ts` — Unit tests for CSV parsing, mapping, and deduplication helpers (if extracted).
- `src/scripts/parseGoodreadsCsv.ts` — **New:** Goodreads CSV parsing; `parseGoodreadsCsv`, `readGoodreadsCsvFromFile`, `stripExcelQuoted`; Excel-style ISBN/ISBN13 cleaning.
- `src/services/openLibraryService.ts` — Reuse for cover lookup by ISBN and by title+author; get cover URL and optional page count.
- `src/services/llmService.ts` — Reuse for LLM enhancement of new books (themes, tags, enhanced genre, etc.).
- `src/scripts/enhanceCategorization.ts` — Reuse `processBookWithLLM`, `transformBookData`, and clean-book serialization shape; call from sync for new books only.
- `src/scripts/downloadCoverImages.ts` — Reuse `downloadImage`, `sanitizeFilename`, and write-back of `localCoverPath`; extend with “find cover” step (Open Library / Google Books) before download.
- `src/scripts/addBook.ts` — Reuse `generateSlug` and unique-filename pattern for new book JSON filenames in `src/content/books/`.
- `package.json` — Add `sync-books` script (e.g. `tsx src/scripts/syncGoodreadsCsv.ts`) and ensure CSV path can be passed as argument.
- `public/book-covers/` — Directory where resolved cover images are downloaded and stored.
- `src/content/books/*.json` — Read for deduplication (by `goodreadsId` or title+author); write new book files here.
- `goodreads_library_export.csv` — Reference file for CSV column names and parsing (see PRD schema table).

### Notes

- **Verification:** Run a quick test after each sub-task (e.g. `npx tsx src/scripts/parseGoodreadsCsv.ts goodreads_library_export.csv` for parser, or `npm run test:run` for unit tests) to confirm the change works.
- **Sync usage:** Export CSV from Goodreads (My Books → Import/Export), then run `npm run sync-books` (uses repo-root `goodreads_library_export.csv`) or `npm run sync-books -- path/to/export.csv`. Add `--dry-run` to only report added/skipped; `--no-enhance` or `--no-covers` to skip those steps.
- Existing scripts to leverage or refactor: `enhanceCategorization.ts`, `downloadCoverImages.ts`, `addBook.ts`. `processBooks.ts` uses Papa Parse for a different CSV shape; reuse parsing approach (e.g. Papa or Node `fs` + manual parse) for Goodreads columns.
- Tests: Use Vitest (`npm run test`). Prefer unit tests for parsing, mapping, and deduplication logic; optional integration test for sync script with a small fixture CSV.
- Genre: CSV has no genre; use `"Unknown"` or empty and rely on LLM enhancement to set `enhancedGenre` / `bookCategory`; optionally use Open Library `subjects` for a first-pass genre if desired.

---

## Tasks

- [x] 1.0 Extend book schema and types for Goodreads sync
  - [x] 1.1 Add `goodreadsId` (string, optional) and `localCoverPath` (string, optional) to the books collection schema in `src/content.config.ts`.
  - [x] 1.2 Add `goodreadsId` and `localCoverPath` to `BookWithEnhancedData` (and to `Book` if used for new entries) in `src/types/books.ts`.

- [x] 2.0 Implement Goodreads CSV parsing and mapping to book model
  - [x] 2.1 Implement CSV parsing for Goodreads export format: read file, handle quoted fields and Excel-style ISBN columns (e.g. `=""""` or `="978…"`), strip `="` and trailing `"` for ISBN/ISBN13.
  - [x] 2.2 Filter rows to `Exclusive Shelf` = `read` (and optionally `currently-reading`); map `Exclusive Shelf` to `isCurrentlyReading` when applicable.
  - [x] 2.3 Map CSV columns to book fields: Title → title, Author → author, Number of Pages → pages (default 0 if empty), My Rating → rating, Book Id → goodreadsId. Parse Date Read; when empty use Date Added (format YYYY/MM/DD) for dateFinished, readingYear, readingMonth. Set genre to `"Unknown"` or empty (LLM/enrichment will fill). Store ISBN/ISBN13 (parsed) for cover lookup.
  - [x] 2.4 Export a typed structure (e.g. `GoodreadsRow` or `ParsedGoodreadsBook`) and a function that returns an array of parsed books from a CSV path or string.

- [x] 3.0 Implement deduplication and add-new-books to the collection
  - [x] 3.1 Load existing book JSONs from `src/content/books/`; build a set/map of existing books keyed by `goodreadsId` (when present) and by normalized (title + author) for books without goodreadsId.
  - [x] 3.2 For each parsed CSV row, check for match by goodreadsId first, then by normalized title+author; skip rows that match an existing book.
  - [x] 3.3 For each new row, generate a unique filename (slug from title, collision suffix) as in `addBook.ts`, then write a new JSON file to `src/content/books/` with the mapped fields (including goodreadsId). Use the same JSON shape as existing books (dateFinished as ISO string, readingYear, readingMonth, etc.).

- [x] 4.0 Integrate enhancement (LLM) and cover resolution in the sync pipeline
  - [x] 4.1 For each newly added book (or optionally any book missing `llmProcessed`), call the LLM enhancement flow (reuse `enhanceCategorization` logic or `llmService.processBook`); write back enhanced fields (themes, tags, enhancedGenre, bookCategory, llmProcessed, llmProcessedAt) to the book JSON. Skip enhancement if LLM is disabled or on error (log and continue).
  - [x] 4.2 Implement cover resolution: for each book (new and optionally existing without localCoverPath), try Open Library by ISBN then by title+author; optionally try Google Books or Goodreads cover URL by Book Id. Use the first successful cover URL.
  - [x] 4.3 Download the resolved cover URL to `public/book-covers/` using a stable filename (e.g. sanitized title-author); set `localCoverPath` (e.g. `/book-covers/…`) and optionally `coverUrl` in the book JSON. Reuse download and sanitize logic from `downloadCoverImages.ts`; add rate limiting or small delay between requests to avoid hammering APIs.

- [x] 5.0 Create unified sync script and npm command
  - [x] 5.1 Create `src/scripts/syncGoodreadsCsv.ts`: accept CSV path as CLI argument or default to `goodreads_library_export.csv` in repo root; run steps in order: parse CSV → filter by shelf → dedupe → add new books → enhance new books → resolve and download covers for new (and optionally existing) books. Log summary (added, skipped, enhanced, covers found/failed).
  - [x] 5.2 Add `"sync-books": "tsx src/scripts/syncGoodreadsCsv.ts"` to `package.json` scripts; document usage (e.g. `npm run sync-books` or `npm run sync-books -- path/to/export.csv`) in README or PRD/task notes.
  - [x] 5.3 Optionally: add a `--dry-run` or `--no-enhance` / `--no-covers` flag to run only parse + dedupe + add without LLM or cover steps for faster iteration.
