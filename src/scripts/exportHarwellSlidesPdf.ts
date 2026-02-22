/**
 * Export Harwell AI course reveal.js slides to PDF.
 * Serves for_website/slides_source over HTTP, then uses Puppeteer to open
 * each module's index.html?print-pdf and save as PDF.
 *
 * Run: npx tsx src/scripts/exportHarwellSlidesPdf.ts
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");
const slidesSourceDir = path.join(repoRoot, "for_website/slides_source");
const outputDir = path.join(repoRoot, "public/courses/harwell-ai/slides_pdfs");

const MODULES = [
  "module-01-intro-genai",
  "module-02-core-prompt-engineering",
  "module-03-ai-assisted-java",
  "module-04-tooling-strategies",
  "module-05-rag",
  "module-06-mcp",
  "module-07-ai-apis",
  "module-08-future-of-ai",
];

function serveStatic(baseDir: string): http.Server {
  return http.createServer((req, res) => {
    const urlPath = req.url?.split("?")[0] ?? "/";
    const safePath = path.normalize(urlPath).replace(/^(\.\.(\/|\\))+/, "");
    const filePath = path.join(baseDir, safePath);

    if (!filePath.startsWith(path.resolve(baseDir))) {
      res.writeHead(403).end();
      return;
    }

    fs.stat(filePath, (err, stat) => {
      if (err || !stat.isFile()) {
        const indexCandidate = path.join(filePath, "index.html");
        fs.stat(indexCandidate, (err2, stat2) => {
          if (err2 || !stat2?.isFile()) {
            res.writeHead(404).end();
            return;
          }
          res.writeHead(200, { "Content-Type": "text/html" });
          fs.createReadStream(indexCandidate).pipe(res);
        });
        return;
      }
      const ext = path.extname(filePath);
      const types: Record<string, string> = {
        ".html": "text/html",
        ".md": "text/markdown",
        ".css": "text/css",
        ".js": "application/javascript",
      };
      res.writeHead(200, {
        "Content-Type": types[ext] ?? "application/octet-stream",
      });
      fs.createReadStream(filePath).pipe(res);
    });
  });
}

async function main() {
  if (!fs.existsSync(slidesSourceDir)) {
    console.error("Slides source not found:", slidesSourceDir);
    process.exit(1);
  }
  fs.mkdirSync(outputDir, { recursive: true });

  const port = 37542;
  const server = serveStatic(slidesSourceDir);
  await new Promise<void>((resolve) => server.listen(port, "127.0.0.1", resolve));
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log("Serving slides at", baseUrl);

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const puppeteer = await import("puppeteer");
  const browser = await puppeteer.default.launch({ headless: true });

  try {
    for (const mod of MODULES) {
      const url = `${baseUrl}/${mod}/index.html?print-pdf`;
      const pdfPath = path.join(outputDir, `${mod}.pdf`);
      console.log("Exporting", mod, "->", pdfPath);

      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 720 });
      await page.goto(url, {
        waitUntil: "networkidle0",
        timeout: 30000,
      });
      // Reveal.js needs extra time to render markdown and apply print-pdf layout
      await page.waitForSelector(".reveal .slides section", { timeout: 10000 }).catch(() => {});
      await new Promise((r) => setTimeout(r, 1500));

      await page.pdf({
        path: pdfPath,
        width: "1280px",
        height: "720px",
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      });
      await page.close();
    }
    console.log("Done. PDFs written to", outputDir);
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
