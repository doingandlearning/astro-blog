/**
 * Find all books in the collection that don't have a local cover and fill them
 * using Open Library (same as sync script). Use --since-2025 to only process
 * books with dateFinished >= 2025-01-01 (books shown on current /books page).
 *
 * Usage: npx tsx src/scripts/fillMissingCovers.ts [--since-2025] [--dry-run]
 */

import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { ensureBookCover } from "./syncGoodreadsCsv";

const REPO_ROOT = join(process.cwd());
const BOOKS_DIR = join(REPO_ROOT, "src", "content", "books");
const SINCE_DATE = new Date("2025-01-01");

async function main() {
  const args = process.argv.slice(2);
  const since2025Only = args.includes("--since-2025");
  const dryRun = args.includes("--dry-run");

  const files = await readdir(BOOKS_DIR);
  const jsonFiles = files.filter((f) => f.endsWith(".json"));
  const withoutCover: string[] = [];

  for (const file of jsonFiles) {
    const filePath = join(BOOKS_DIR, file);
    const content = await readFile(filePath, "utf-8");
    const data = JSON.parse(content) as { localCoverPath?: string; dateFinished?: string };
    if (data.localCoverPath) continue;
    if (since2025Only) {
      const finished = data.dateFinished ? new Date(data.dateFinished) : new Date(0);
      if (finished < SINCE_DATE) continue;
    }
    withoutCover.push(filePath);
  }

  console.log(
    `Books without cover: ${withoutCover.length}${since2025Only ? " (since 2025 only)" : ""}`,
  );
  if (withoutCover.length === 0) {
    console.log("Nothing to do.");
    return;
  }
  if (dryRun) {
    console.log("(dry-run) Would process:", withoutCover.map((p) => p.split("/").pop()).join(", "));
    return;
  }

  let filled = 0;
  for (const filePath of withoutCover) {
    const name = filePath.split("/").pop() ?? filePath;
    const ok = await ensureBookCover(filePath);
    if (ok) {
      filled++;
      console.log(`✓ ${name}`);
    } else {
      console.log(`✗ ${name} (no cover found or error)`);
    }
  }
  console.log(`Done. Filled ${filled}/${withoutCover.length} covers.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
