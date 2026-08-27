---
title: "Migrating from Astro 5 to Astro 7"
date: "2026-08-27"
tags: []
updateDate: ""
description: ""
draft: false 
---

This website has been built with a number of different technologies in the past 10 years or so. I've used Wordpress, Gatsby, Next.js and, most recently, Astro. 

From Gatsby on, what I've appreciated is having my blog posts in Markdown (or MDX if there are interactive components) and having a reliable site builder that will translate that into a useful site quickly.

As a personal website, there hasn't been much need to care about vulnerabilities reported to me by Dependabot or npm - I don't store user data or my own data that isn't public. Every once in a while though, I get a few hours free and updating my site seems like a fun thing to do.

Here's all of the things I had to do to migrate from Astro 5 to Astro 7. Everything is building, my tests are passing and I'm hoping when I deploy (with this post) that everything is still alive. 


First up, dependency upgrades.

**Dependency upgrades**

- Astro `5.11.1` → `7.2.8`
- `@astrojs/mdx` `4.x` → `7.x`
- `@astrojs/netlify` `6.x` → `8.x`
- `@astrojs/sitemap` `3.4.1` → `3.7.3`
- `astro-embed` and `astro-expressive-code` were also upgraded
- `markdown-it`, Puppeteer, and related packages were updated
- Vitest and `@vitest/ui` were upgraded to patched versions

The Netlify adapter had to be upgraded alongside Astro because the previous adapter only supported Astro 5. 
`npm audit fix --force` led me on a merry dance of upgrading and downgrading packages for a while. I've got it to a point where it's stable at 10 warnings. The remaining problems are around Netlify. The audit tool suggests downgrading from Netlify 8 to Netlify 6 but that version doesn't work with Astro 7. I've decided to make do with the current Netlify reported problems as none of the CVEs seem to be of concern to me.

The benefit of this being a personal website is that I can make that call quite freely.


**Content Collections API**

The biggest chunk of the migration was Astro 7 moving fully onto the Content Layer API. My old collection definitions looked like this:

```ts
defineCollection({
  type: "content",
  schema: ...
})
```

and every one of them needed rewriting as loader-based definitions instead:

```ts
defineCollection({
  loader: glob({
    base: "./src/content/posts",
    pattern: "**/*.{md,mdx}",
  }),
  schema: ...
})
```

Nothing here is conceptually hard, it's just a lot of repetitive editing once you multiply it across every collection on the site. Here's what actually changed:

- Added `glob()` loaders for Markdown, MDX, and book JSON files
- Added a custom loader for JSON files containing arrays, such as bookmarks and webmentions
- Swapped the Zod import over, from:

```ts
import { z } from "astro:content";
```

to:

```ts
import { z } from "astro/zod";
```

- Updated my custom loaders to use Astro 7's object-based data store API:

```ts
store.set({
  id,
  data,
  filePath,
});
```

- Made sure the config file stayed at `content.config.ts` - Astro 7 flatly refuses to recognise the old `src/content/config.ts` location, and it took me longer than I'd like to admit to figure out why my collections had silently gone empty.

**Collection Entry API**

The other big one: collection entries no longer expose `slug`. Every `post.slug` in the codebase had to become `post.id`.

That sounds like a small find-and-replace, but it touched more of the site than I expected:

- Blog post links
- Course links
- Tag pages
- Search results
- YouTube-to-blog matching
- RSS links
- Sitemap URLs
- Dynamic route generation

I'm hoping that doesn't invalidate my RSS and I don't spam anyone who subscribes to RSS with everything I've ever written (sorry if that happens!).

**Rendering Markdown and MDX**

The old entry rendering API:

```ts
const { Content } = await entry.render();
```

was replaced with:

```ts
import { render } from "astro:content";

const { Content } = await render(entry);
```

Small change, but it's the kind of thing that's easy to miss if you're grepping for `.render(` and not thinking about imports.

**Sitemap behavior**

The sitemap integration now splits its output across:

- `sitemap-index.xml`
- `sitemap-0.xml`

instead of a single `sitemap.xml`. I had to go and update `robots.txt` and anywhere else on the deployed site that referenced the old filename, so it now points at:

```text
https://kevincunningham.co.uk/sitemap-index.xml
```

Another on that is easy to overlook if you're not specifically checking for it after the upgrade.

**Markdown processor change**

Astro 7 switches to Sütterlin as its default Markdown processor. My `astro-custom-toc` integration is still injecting the older `remarkPlugins` and `rehypePlugins` configuration, which now throws a warning at build time.

The table of contents still works fine in practice, but the integration clearly needs an update (or a replacement) to speak Astro 7's explicit unified processor configuration properly. That one's going on the list for another day.

**Script and hydration changes**

Astro 7 tightened up how it handles scripts, which meant a few fixes:

- Added `is:inline` to scripts using `define:vars`
- Removed `client:load` from Astro components - hydration directives only make sense on framework components like Preact or React, and Astro 7 is less forgiving about that than 5 was
- Replaced the deprecated inline global event handlers in the book modal with proper `addEventListener` calls

**CSS processing**

This one caught me out a bit. Some of my components were using Tailwind's `@apply` directive, but I never actually had Tailwind configured on the site - it had presumably been working by accident on the old version. Astro 7's Lightning CSS started warning about it loudly.

So I added:

- `tailwindcss`
- `postcss`
- `autoprefixer`
- `tailwind.config.cjs`
- `postcss.config.cjs`

which cleared the warnings and, as a bonus, meant the existing `@apply` styles were actually being processed properly for the first time.

**Routing cleanup**

Astro flagged a genuine conflict I'd never noticed before, between:

- `/bookmarks/teaching.astro`
- `/bookmarks/[tag].astro`

I updated the dynamic route to exclude the `teaching` tag, since the static page already owns that URL and there's no need for the two to compete.

**Test fixes exposed during the migration**

A handful of test failures weren't really about Astro at all, they'd just been quietly waiting for something to shake them loose:

- Updated the `fs/promises` Vitest mock to match the shape the newer Vitest version expects
- Fixed the "books this year" test to use the current year instead of a hard-coded 2024 (found that one the hard way)
- Added a proper domain-specific sort order for `Beginner`, `Intermediate`, and `Advanced`
- Corrected the cached search timing so cache performance is actually being measured, rather than just looking like it is

**Validation**

By the end of it, the migration landed at:

- `astro check`: 0 errors, 0 warnings, 0 hints
- Full test suite passing
- Production build passing
- Content collections populated in development
- Sitemap generated and deployed successfully

The one remaining build notice is the `astro-custom-toc` Markdown processor compatibility warning - on the list, but not urgent enough to hold up this post.

