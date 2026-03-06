# Product Requirements Document: Books — Goodreads Sync & Local Cache

## Introduction/Overview

The `/books` page currently reads from a local content collection (JSON files in `src/content/books/`). The goal is to make Goodreads the source of truth for “books I’ve read,” then have the site consume that data via a **pre-fetched, locally stored cache** so the site remains static and fast.

**Problem:** Manual duplication between Goodreads and the blog; the blog does not reflect a single, up-to-date reading list.

**Goal:** Use Goodreads as the canonical list (via CSV export), and have a **single workflow**: export CSV from Goodreads → run a sync script that dedupes (skips rows already in the collection), adds new books, enhances them (LLM), and reliably finds and stores cover images. The `/books` endpoint continues to read only from the local collection; no live API calls at request time.

**Important:** Goodreads retired their public developer API in December 2020. This PRD therefore assumes using a **Goodreads-compatible data source** (e.g. Goodreads CSV export, or another book service that can represent “my reading list”) plus optional use of a **book metadata API** (e.g. Open Library, Google Books) for covers and details. Exact choice of “sync source” and “metadata API” is left to Technical Design and Open Questions.

---

## Goals

1. **Single source of truth:** Goodreads (or its export) is the canonical list of books read; no long-term dependency on the current local JSON as the only source.
2. **Migrate existing data:** All books currently in `src/content/books/` are added to Goodreads (or the chosen service) so nothing is lost.
3. **Pre-fetch and store locally:** The sync script reads the Goodreads CSV (and uses book metadata APIs for covers), then writes new/updated book entries into the local collection (`src/content/books/`). The `/books` page reads only from this local data.
4. **Static, fast site:** No runtime calls to external APIs when serving `/books`. Sync is an on-demand script run after exporting from Goodreads, not part of every build.
5. **Preserve current UX:** The `/books` page continues to support current behaviour: grid/shelf views, filters (genre, author, year), search, stats, and existing design.

---

## User Stories

1. **As the blog owner**, I want my reading list on the site to match my Goodreads “read” shelf so I maintain one list instead of two.

2. **As the blog owner**, I want to add all my existing local books to Goodreads once, then keep the site in sync so I don’t lose history or manually re-enter data.

3. **As the blog owner**, I want the site to use pre-built/cached data so the books page stays fast and doesn’t depend on external APIs being up at request time.

4. **As a visitor**, I want to see the same books page (filters, stats, layout) as today, backed by the same kind of metadata (covers, genres, dates), so my experience doesn’t regress.

5. **As the blog owner**, I want a clear way to refresh the cache (e.g. “sync from Goodreads” or “re-export and rebuild”) so updates on Goodreads eventually appear on the site.

6. **As the blog owner**, I want one script that takes the CSV and handles deduplication, adding, enhancing, and cover images so I don’t have to run separate, brittle scripts.

---

## Goodreads CSV sync workflow (primary flow)

The intended workflow is:

1. **Goodreads UI** — Maintain “read” (and optionally “currently reading”) on Goodreads as usual.
2. **Export to CSV** — Use Goodreads “My Books” → “Import/Export” → export library; save the CSV (e.g. `goodreads_library_export.csv` in the repo or a known path).
3. **Run sync script** — Single command (e.g. `npm run sync-books` or `npm run sync-books -- path/to/export.csv`) that:
   - **Parses** the Goodreads CSV and filters to `Exclusive Shelf` = `read` (and optionally `currently-reading`).
   - **Dedupes:** Compares CSV rows to the existing local collection and **removes from processing** any row that is already represented (match by Goodreads **Book Id** if stored in JSON, or by normalized title + author). Only “new” rows proceed.
   - **Adds:** For each new row, creates a new book entry (JSON file in `src/content/books/`) with fields mapped from the CSV (title, author, date read/added, pages, ISBN, rating, etc.). Store **Book Id** in the JSON for future deduplication and optional cover lookup.
   - **Enhances:** Runs LLM categorization (themes, tags, enhanced genre, etc.) on each newly added book, writing results back to the same JSON. Existing books are not re-enhanced unless explicitly requested.
   - **Covers:** For each book (new and optionally existing), **reliably find** a cover image (Open Library by ISBN, then by title+author; or Google Books; or Goodreads cover URL by Book Id if available), then **download** it to `public/book-covers/`, set `localCoverPath` in the JSON, and keep `coverUrl` as fallback if desired. No “download only if coverUrl exists” — actively resolve and store covers so placeholders are minimised.

This workflow **replaces or refactors** the current separate scripts:

- **`enhanceCategorization.ts`** — Logic is folded into the sync script: only enhance books that were just added from the CSV (or that lack `llmProcessed`). The standalone “enhance all” / “enhance one” commands can remain for one-off use or be deprecated in favour of “sync then enhance missing.”
- **`downloadCoverImages.ts`** — Replaced by the sync script’s **cover resolution** step: instead of only downloading an existing `coverUrl`, the script must **find** a cover (Open Library, Google Books, or Goodreads image by Book Id), then download and set `localCoverPath`. The existing script only downloads when `coverUrl` is already set and does not reliably find covers for books that have none.

**Outcome:** One entry point (CSV) and one script run that adds only new books, enhances them, and ensures covers are found and stored locally.

---

## Functional Requirements

1. **Sync source:** The system MUST ingest “books I’ve read” from the **Goodreads CSV export** (My Books → Import/Export). The sync script MUST accept a path to this CSV (e.g. as a CLI argument or a default path such as `goodreads_library_export.csv`).

2. **Migration of existing books:** There MUST be a documented process (and preferably a script or tool) to add all books currently in `src/content/books/` to Goodreads (or the chosen sync source), e.g. via Goodreads “Add book” / CSV import or equivalent, so that no existing books are dropped.

3. **Local cache:** The sync script MUST write book data into the existing content collection (`src/content/books/`) as JSON files. The `/books` page MUST read only from this collection; no live external API calls at request time.

4. **On-demand sync:** Sync MUST be triggered by the blog owner (e.g. `npm run sync-books [path/to/export.csv]`) after exporting a new CSV from Goodreads. Sync does not need to run during `astro build` or on a fixed schedule; the site builds from the current state of `src/content/books/` after the owner runs the script when they have a new export.

5. **Mapping to current book model:** Cached records MUST be mappable to the existing `BookWithEnhancedData`-style fields used by the site (e.g. title, author, date finished, genre, pages, cover URL, and any retained enhanced/LLM fields where applicable). Gaps (e.g. “date read” from Goodreads vs “date finished” locally) MUST be documented and handled in the mapping.

6. **Metadata enrichment:** The Goodreads CSV does not include genre or cover URLs. The system MAY use a book metadata API (e.g. Open Library, Google Books) to enrich entries with genre, description, or page count where missing. Cover resolution is required per requirement 12.

7. **Filtering and search:** The `/books` page MUST continue to support filtering by genre, author, and year, and search by title/author, using only the locally cached data.

8. **Stats:** The `/books` page MUST continue to show aggregate stats (e.g. total books, total pages, books this year, genre distribution, reading timeline) derived from the cached data.

9. **Refresh/sync workflow:** The blog owner MUST be able to refresh the books list by: (1) exporting a new CSV from Goodreads, (2) running the sync script (e.g. `npm run sync-books` with the CSV path), (3) building the site. Optionally the script may be run on a schedule (e.g. CI cron) if the CSV is updated automatically; for typical use it is manual after each export.

10. **Idempotent sync:** Re-running the sync with the same source data MUST not duplicate books in the cache; updates (e.g. new books, changed dates/ratings) MUST overwrite or merge correctly.

11. **Deduplication:** The sync script MUST treat CSV rows as “already added” when a matching book exists in the local collection. Matching MUST be by Goodreads Book Id (stored in the book JSON) when present, or by a deterministic title+author match when Book Id is not yet stored. Only rows that do not match any existing book MUST be added as new entries.

12. **Cover resolution and storage:** The sync script MUST attempt to **find** a cover for each book (new or optionally existing) using at least one of: Open Library (by ISBN then title+author), Google Books, or a known Goodreads cover URL pattern keyed by Book Id. When a cover URL is obtained, the script MUST download the image to `public/book-covers/`, update the book JSON with `localCoverPath`, and optionally keep `coverUrl` for fallback. Books without a resolvable cover MAY keep a placeholder or empty cover; the script MUST NOT assume `coverUrl` is already present in the CSV (it is not).

---

## Design Considerations

- **No change to core UX:** The existing books page layout (grid/shelf), filters, and stats should be preserved. Only the **data source** (local cache populated from Goodreads/sync) changes.
- **Fallbacks:** If a book in the cache has no cover or missing metadata, existing fallback behaviour (e.g. placeholder image, optional fields) should be kept.
- **Performance:** Because the page reads only from local cache, no additional loading states or error handling for “external API down” are required for the main page; sync/refresh errors are handled in the sync step.

---

## Technical Considerations

- **Goodreads API deprecated:** Goodreads’ public API was retired in December 2020. The implementation MUST NOT assume a live Goodreads API. The **sync source** for this feature is the **Goodreads CSV export** (My Books → Import/Export). Covers and metadata are obtained via Open Library or Google Books, not Goodreads APIs.
- **Book metadata APIs:** For covers and extra metadata, consider **Open Library** or **Google Books** (existing code already uses Google Books cover URLs in some entries). Enrichment should run during sync and be written into the local cache.
- **Cache location:** The sync script MUST write to the existing **content collection** at `src/content/books/` using the same JSON shape and schema as today. No separate cache directory; the Astro build continues to read from this collection, so components, filters, and stats need no change.
- **Existing tooling:** The project already has `addBook.ts`, Open Library integration (`openLibraryService.ts`), `enhanceCategorization.ts`, and `downloadCoverImages.ts`. The new sync workflow should **refactor or replace** the latter two: enhancement becomes a step inside the sync (for new books only, or for any book missing `llmProcessed`); cover handling becomes “find cover via API then download” rather than “download existing coverUrl only.” Reuse Open Library and LLM services inside the sync script.
- **Build vs scheduled job:** Sync is an on-demand script (e.g. after exporting CSV). It does not need to run on every `astro build`; the site builds from the current state of `src/content/books/` after the blog owner has run the sync when they have a new export.

---

## Success Metrics

1. **Data consistency:** After migration and one sync, the number of books on `/books` matches the number of “read” books in the chosen Goodreads (or export) source, with no books dropped from the current local list.
2. **Performance:** The `/books` page load time and build time do not regress; no blocking external API calls at request time.
3. **Refresh path:** The blog owner can refresh the books list within a documented, repeatable process (e.g. export → run script → build) without editing JSON by hand.
4. **Stability:** The site does not depend on Goodreads (or any third party) being reachable at request time; only the sync step depends on external data.

---

## Open Questions

1. **Date fallback:** When “Date Read” is empty in the CSV, confirm use of “Date Added” (or another rule) for `dateFinished` / `readingYear` / `readingMonth`.
2. **Cover/metadata APIs:** Use Open Library only, Google Books only, or both with fallback order for cover resolution and optional metadata (page count, genre)? The codebase already has Open Library integration.
3. **LLM enhancement:** New books from the CSV are enhanced by the sync script (themes, tags, etc.). Confirm whether to run enhancement only for newly added books or also for existing books that lack `llmProcessed`.
4. **“Currently reading”:** Include rows with `Exclusive Shelf` = `currently-reading` in the collection and set `isCurrentlyReading: true`, or exclude them from the sync?
5. **Ratings and dates:** Confirm mapping of CSV “My Rating” and “Date Read”/“Date Added” to `rating`, `dateFinished`, `readingYear`, `readingMonth`, and whether to show star rating on book cards.

---

## Goodreads export schema (reference)

The current Goodreads library export CSV (`goodreads_library_export.csv`) uses the following columns. Use this for the sync implementation.

| CSV column | Description | Mapping notes |
|------------|-------------|---------------|
| **Book Id** | Goodreads book ID | Use as stable id; useful for deduplication and cover lookup. |
| **Title** | Book title | → `title`. |
| **Author** | Primary author (e.g. "Craig Alanson") | → `author`. |
| **Author l-f** | "Last, First" format | Optional; prefer **Author** for display. |
| **Additional Authors** | Other narrators/authors (e.g. R.C. Bray for audiobooks) | Optional; can store or ignore. |
| **ISBN** | ISBN-10 | Often wrapped as `=""""` when empty; strip quotes and use for Open Library / Google Books lookup. → `isbn` if needed. |
| **ISBN13** | ISBN-13 | Same parsing as ISBN; useful for API lookups. |
| **My Rating** | User’s star rating (0–5) | 0 often means “not set”. → `rating`. |
| **Average Rating** | Goodreads community average | Optional for display. |
| **Publisher** | Publisher name | Optional. |
| **Binding** | Format (Kindle Edition, Audible Audio, Hardcover, etc.) | Can inform “format” or genre; optional. |
| **Number of Pages** | Page count | → `pages`. May be empty for audiobooks (e.g. 6, 23). |
| **Year Published** | Publication year | Optional. |
| **Original Publication Year** | First publication year | Optional. |
| **Date Read** | When the user finished the book | → `dateFinished` (primary). **Often empty** in export; need fallback (e.g. **Date Added**, or derive from **Year Published**). |
| **Date Added** | When the book was added to Goodreads | Use as fallback for `dateFinished` when **Date Read** is empty. Format: `YYYY/MM/DD`. |
| **Bookshelves** | Shelf names (comma-separated) | Optional. |
| **Bookshelves with positions** | Shelves with order | Optional. |
| **Exclusive Shelf** | `read` \| `to-read` \| `currently-reading` | **Filter:** only include rows where `Exclusive Shelf` = `read` for the main “books I’ve read” list. Use `currently-reading` for `isCurrentlyReading` if supported. |
| **My Review**, **Spoiler**, **Private Notes** | Review text and flags | Optional; usually not shown on public site. |
| **Read Count** | Times read | Optional. |
| **Owned Copies** | Copies owned | Optional. |

**Implementation notes:**

- **Parsing:** CSV may have quoted fields; ISBN/ISBN13 often appear as `=""""` or `="978…"` — strip the `="` and `"` and use the inner value (or empty).
- **Which rows to sync:** Only rows with `Exclusive Shelf` = `read` (and optionally `currently-reading`) should be written to the local cache for the `/books` page.
- **Genre:** Goodreads export does **not** include genre. Options: (a) leave genre empty or “Unknown” and rely on optional LLM enrichment, (b) derive from **Binding** (e.g. “Fiction”) if too coarse, or (c) use a metadata API (Open Library / Google Books) to fetch subjects/categories and map to a single genre.
- **Cover URL:** Not in the CSV. Must be obtained via **Book Id** (Goodreads image URL pattern), **ISBN/ISBN13** (Open Library or Google Books), or existing `openLibraryService` in the codebase.

- **Storing Book Id:** Add a field (e.g. `goodreadsId` or `bookId`) to the book JSON and content collection schema when writing from the CSV. This enables reliable deduplication on future syncs (match CSV row by Book Id to existing file) and optional cover lookup via Goodreads image URLs.

---

## Target Audience

This PRD is written for a **junior developer**. Requirements are explicit and implementation-agnostic where possible. The developer should use the “Open Questions” section and “Technical Considerations” to choose concrete APIs and file formats and to document the exact sync and build steps.
