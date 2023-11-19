import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const posts = await getCollection("posts");
  return rss({
    title: "Kevin Cunningham - @dolearning ",
    description: "Wrtiting about learning, technology and the web",
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      link: `/posts/${post.slug}/`,
      description: post.data.description,
      content: post.body,
    })),
    customData: `<language>en-gb</language>`,
  });
}

// title: post.data.title,
// pubDate: post.data.pubDate,
// description: post.data.description,
// customData: post.data.customData,
// // Compute RSS link from post `slug`
// // This example assumes all posts are rendered as `/blog/[slug]` routes
// link: `/blog/${post.slug}/`,
