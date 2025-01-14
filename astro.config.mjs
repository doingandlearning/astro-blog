import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import netlify from '@astrojs/netlify';
import expressiveCode from "astro-expressive-code";

import customToc from "astro-custom-toc";

// https://astro.build/config
export default defineConfig({
  site: "https://kevincunningham.co.uk",
  integrations: [
    preact(),
    expressiveCode({
      themes: ["catppuccin-frappe"],
    }),
    customToc({ template: (toc) => `<nav class="toc">${toc}</nav>` }),
    mdx(),
    sitemap(),
  ],
  output: "static",
  adapter: netlify(),
  redirects: {
    "/feed.xml": {
      status: 302,
      destination: "/rss.xml",
    },
  },
});
