import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
const parser = new MarkdownIt();

export async function GET(context) {
  const posts = await getCollection("posts", ({ data }) => {
    return data.draft !== true;
  });
  return rss({
    title: "Kevin Cunningham - @dolearning ",
    description: "Wrtiting about learning, technology and the web",
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      link: `/posts/${post.slug}/`,
      description: post.data.description,
      content: sanitizeHtml(parser.render(post.body)),
    })),
    customData: `<language>en-gb</language>`,
    stylesheet: '/rss/styles.xsl'
  });
}

// title: post.data.title,
// pubDate: post.data.pubDate,
// description: post.data.description,
// customData: post.data.customData,
// // Compute RSS link from post `slug`
// // This example assumes all posts are rendered as `/blog/[slug]` routes
// link: `/blog/${post.slug}/`,
