import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel/serverless";

import expressiveCode from "astro-expressive-code";

// https://astro.build/config
export default defineConfig({
  site: "https://kevincunningham.co.uk",
  integrations: [preact(), expressiveCode(), mdx(), sitemap()],
  output: "hybrid",
  adapter: vercel(),
  redirects: {
    "/feed.xml": {
      status: 302,
      destination: "/rss.xml",
    },
  },
});
