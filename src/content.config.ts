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
    imageUrl: z.string().optional(),
    imageAlt: z.string().optional(),
    youtubeId: z.string().optional(),
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

// define books collection
const booksCollection = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    author: z.string(),
    dateFinished: z.string(), // ISO date string
    genre: z.string(),
    pages: z.number(),
    coverUrl: z.string().optional(),
    readingYear: z.number(),
    readingMonth: z.number(),
    enhancedGenre: z.string().optional(),
    isCurrentlyReading: z.boolean().optional(),
    // LLM-enhanced categorization fields
    llmProcessed: z.boolean().optional(), // Track if LLM has processed this book
    llmProcessedAt: z.string().optional(), // ISO timestamp of when LLM processed
    bookCategory: z.string().optional(), // Broader category (e.g., "Fiction", "Non-Fiction", "Technical")
    readingLevel: z.string().optional(), // "Beginner", "Intermediate", "Advanced"
    themes: z.array(z.string()).optional(), // Array of themes/topics
    targetAudience: z.string().optional(), // "General", "Developers", "Students", etc.
    complexity: z.string().optional(), // "Simple", "Moderate", "Complex"
    readingTime: z.string().optional(), // Estimated reading time
    relatedBooks: z.array(z.string()).optional(), // Array of related book titles
    keyInsights: z.array(z.string()).optional(), // Key takeaways or insights
    tags: z.array(z.string()).optional(), // Additional tags for grouping
  }),
});

// define testimonials collection
const testimonialsCollection = defineCollection({
  type: "data",
  schema: z.array(
    z.object({
      course_name: z.string(),
      date: z.string(),
      feedback: z.string(),
      source_file: z.string(),
      row_index: z.number(),
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
  books: booksCollection,
  testimonials: testimonialsCollection,
};
