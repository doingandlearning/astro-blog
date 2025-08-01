/**
 * Script to generate draft blog posts for YouTube videos
 * Run with: node src/scripts/generate-video-blog-posts.js
 */

import { getYouTubeVideos } from '../utils/youtube.ts';
import { createVideoToBlogMappings, generateBlogPostContent } from '../utils/youtube-blog-mapping.ts';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHANNEL_ID = 'UCtzNXx0YjJFvAuAPL9ZjQOw';
const POSTS_DIR = path.join(__dirname, '..', 'content', 'posts');

async function generateBlogPosts() {
  try {
    console.log('Fetching latest YouTube videos...');
    const videos = await getYouTubeVideos(CHANNEL_ID, 6);
    
    console.log(`Found ${videos.length} videos`);
    
    const mappings = await createVideoToBlogMappings(videos);
    
    // Ensure posts directory exists
    if (!fs.existsSync(POSTS_DIR)) {
      fs.mkdirSync(POSTS_DIR, { recursive: true });
    }
    
    let createdCount = 0;
    let skippedCount = 0;
    
    for (let i = 0; i < mappings.length; i++) {
      const mapping = mappings[i];
      const video = videos[i];
      const filename = `${mapping.blogSlug}.md`;
      const filepath = path.join(POSTS_DIR, filename);
      
      // Check if file already exists
      if (fs.existsSync(filepath)) {
        console.log(`⏭️  Skipping ${filename} - already exists`);
        skippedCount++;
        continue;
      }
      
      const content = generateBlogPostContent(mapping, {
        description: video.description,
        publishedAt: video.publishedAt
      });
      
      fs.writeFileSync(filepath, content, 'utf8');
      console.log(`✅ Created ${filename}`);
      createdCount++;
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`   Created: ${createdCount} new blog posts`);
    console.log(`   Skipped: ${skippedCount} existing files`);
    console.log(`   Total videos processed: ${mappings.length}`);
    
    if (createdCount > 0) {
      console.log(`\n📝 Next steps:`);
      console.log(`   1. Review and edit the generated blog posts in src/content/posts/`);
      console.log(`   2. Set draft: false when ready to publish`);
      console.log(`   3. Add relevant tags and improve descriptions`);
    }
    
  } catch (error) {
    console.error('Error generating blog posts:', error);
    process.exit(1);
  }
}

// Run the script
generateBlogPosts();