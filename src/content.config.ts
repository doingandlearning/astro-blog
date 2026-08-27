import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import type { Loader } from "astro/loaders";
import { z } from "astro/zod";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

function jsonArrayLoader(directory: string): Loader {
  return {
    name: `local-json-array:${directory}`,
    async load({ store }) {
      store.clear();
      const files = (await readdir(directory)).filter((file) => file.endsWith(".json"));

      for (const file of files) {
        const filePath = join(directory, file);
        const data = JSON.parse(await readFile(filePath, "utf-8"));
        store.set({
          id: file.replace(/\.json$/, ""),
          data: data as Record<string, unknown>,
          filePath,
        });
      }
    },
  };
}

const postsCollection = defineCollection({
  loader: glob({ base: "./src/content/posts", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(), date: z.string(), updateDate: z.string().optional(),
    description: z.string().optional(), image: z.object({ url: z.string(), alt: z.string() }).optional(),
    imageUrl: z.string().optional(), imageAlt: z.string().optional(), youtubeId: z.string().optional(),
    tags: z.array(z.string()), draft: z.boolean().optional(),
  }),
});

const prerecordedCollection = defineCollection({
  loader: glob({ base: "./src/content/prerecorded", pattern: "**/*.{md,mdx}" }),
  schema: z.object({ title: z.string(), link: z.string(), cta: z.string(), image: z.object({ sourceUrl: z.string(), altText: z.string() }), order: z.number() }),
});

const liveCourses = defineCollection({
  loader: glob({ base: "./src/content/livecourses", pattern: "**/*.{md,mdx}" }),
  schema: z.object({ title: z.string(), order: z.number(), duration: z.string(), description: z.string(), draft: z.boolean().optional() }),
});

const webmentions = defineCollection({
  loader: jsonArrayLoader("./src/content/webmentions"),
  schema: z.array(z.object({
    author: z.object({ name: z.string(), photo: z.string(), url: z.string() }),
    ["wm-property"]: z.string(), url: z.string(),
    content: z.object({ html: z.string().optional(), text: z.string() }).optional(),
    "wm-received": z.string(),
  })),
});

const bookmarksCollection = defineCollection({
  loader: jsonArrayLoader("./src/content/bookmarks"),
  schema: z.array(z.object({ title: z.string(), url: z.string(), description: z.string(), tags: z.array(z.string()), date: z.string() })),
});

const booksCollection = defineCollection({
  loader: glob({ base: "./src/content/books", pattern: "**/*.json" }),
  schema: z.object({
    title: z.string(), author: z.string(), dateFinished: z.string(), genre: z.string(), pages: z.number(),
    coverUrl: z.string().optional(), localCoverPath: z.string().optional(), goodreadsId: z.string().optional(),
    readingYear: z.number(), readingMonth: z.number(), enhancedGenre: z.string().optional(), isCurrentlyReading: z.boolean().optional(),
    llmProcessed: z.boolean().optional(), llmProcessedAt: z.string().optional(), bookCategory: z.string().optional(),
    readingLevel: z.string().optional(), themes: z.array(z.string()).optional(), targetAudience: z.string().optional(),
    complexity: z.string().optional(), readingTime: z.string().optional(), relatedBooks: z.array(z.string()).optional(),
    keyInsights: z.array(z.string()).optional(), tags: z.array(z.string()).optional(),
  }),
});

const testimonialsCollection = defineCollection({
  loader: jsonArrayLoader("./src/content/testimonials"),
  schema: z.array(z.object({ course_name: z.string(), date: z.string(), feedback: z.string(), source_file: z.string(), row_index: z.number() })),
});

export const collections = { posts: postsCollection, prerecorded: prerecordedCollection, livecourses: liveCourses, bookmarks: bookmarksCollection, webmentions, books: booksCollection, testimonials: testimonialsCollection };