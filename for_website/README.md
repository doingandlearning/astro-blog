# For website — Harwell Prompt Engineering

This folder contains everything you need to publish the **course materials** page on your site.

## Before publishing

1. **Repo link**  
   Open `index.html` and replace **every** occurrence of `REPO_LINK_PLACEHOLDER` with your actual GitHub repo URL (e.g. `https://github.com/yourname/harwell-prompt-engineering`). The placeholder appears in the “Course materials” link.

2. **Slide PDFs** (optional)  
   To offer PDF downloads, open each module under `slides_source/` in a browser (e.g. `slides_source/module-01-intro-genai/index.html`), then **Print → Save as PDF**. Save the PDFs into `slides_pdfs/` and link to them from your page if you want.

## Contents

- **index.html** — Main course materials page (upload to your site or copy into your CMS).
- **handouts/** — Prompt template and context header (Markdown; you can convert to PDF if needed).
- **slides_pdfs/** — Put exported slide PDFs here; see README inside for instructions.
- **slides_source/** — reveal.js slide sources (index.html + slides.md per module) for exporting to PDF.
- **resources.md** — Links to Spring AI, MCP, Ollama, etc.

## After you create the repo

Upload or push the contents of **for_repo** to GitHub, then set that repo URL in `index.html` as above. Delegates can then use your website as the single link and jump to the repo for code and demos.
