// Import utilities from `astro:content`
import { z, defineCollection } from "astro:content";
// Define a `type` and `schema` for each collection
const postsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.string(),
    updateDate: z.string().optional(),
    description: z.string().optional(),
    image: z
      .object({
        url: z.string(),
        alt: z.string(),
      })
      .optional(),
    tags: z.array(z.string()),
    draft: z.boolean().optional(),
  }),
});

const prerecordedCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    link: z.string(),
    cta: z.string(),
    image: z.object({
      sourceUrl: z.string(),
      altText: z.string(),
    }),
    order: z.number(),
  }),
});

const liveCourses = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    order: z.number(),
    duration: z.string(),
    description: z.string(),
    draft: z.boolean().optional(),
  }),
});

const webmentions = defineCollection({
  type: "data",
  schema: z.array(
    z.object({
      author: z.object({
        name: z.string(),
        photo: z.string(),
        url: z.string(),
      }),
      ["wm-property"]: z.string(),
      url: z.string(),
      content: z
        .object({
          html: z.string().optional(),
          text: z.string(),
        })
        .optional(),
      "wm-received": z.string(),
    })
  ),
});

// define bookmarks collection
const bookmarksCollection = defineCollection({
  type: "data",
  schema: z.array(
    z.object({
      title: z.string(),
      url: z.string(),
      description: z.string(),
      tags: z.array(z.string()),
      date: z.string(),
    })
  ),
});

// Export a single `collections` object to register your collection(s)
export const collections = {
  posts: postsCollection,
  prerecorded: prerecordedCollection,
  livecourses: liveCourses,
  bookmarks: bookmarksCollection,
  webmentions: webmentions,
};
