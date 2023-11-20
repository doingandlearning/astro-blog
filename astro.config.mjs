import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import mdx from "@astrojs/mdx";
import netlify from "@astrojs/netlify/functions";
import sitemap from "@astrojs/sitemap";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  site: "https://kevincunningham.co.uk",
  integrations: [preact(), mdx(), sitemap()],
  output: "hybrid",
  adapter: vercel(),
  redirects: {
    '/feed.xml': { status: 302, destination: '/rss.xml' }
  }
});
