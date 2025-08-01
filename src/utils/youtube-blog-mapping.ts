/**
 * Utility to map YouTube videos to corresponding blog posts
 */

export interface VideoToBlogMapping {
  videoId: string;
  videoTitle: string;
  blogSlug: string;
  blogTitle: string;
  exists: boolean;
}

/**
 * Generate a blog post slug from a YouTube video title
 */
export function generateBlogSlug(videoTitle: string): string {
  return videoTitle
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens and spaces
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .substring(0, 100); // Limit length
}

/**
 * Generate a blog post title from a YouTube video title
 */
export function generateBlogTitle(videoTitle: string): string {
  // Clean up common YouTube title patterns
  let title = videoTitle
    .replace(/^\d+\.\s*/, '') // Remove numbered prefixes like "1. "
    .replace(/\s*\|\s*.*$/, '') // Remove pipe separators and everything after
    .replace(/\s*-\s*.*Tutorial.*$/i, '') // Remove " - Tutorial" suffixes
    .replace(/\s*\(.*\)$/g, '') // Remove parenthetical content at end
    .trim();
  
  // Ensure it's a proper title case for first letter
  return title.charAt(0).toUpperCase() + title.slice(1);
}

/**
 * Check if a blog post exists for a video
 */
export async function checkBlogPostExists(slug: string): Promise<boolean> {
  try {
    // Use Astro's content collection API to check if a post exists
    const { getCollection } = await import('astro:content');
    const posts = await getCollection('posts');
    return posts.some(post => post.slug === slug);
  } catch {
    return false;
  }
}

/**
 * Create video to blog mappings for a list of videos
 */
export async function createVideoToBlogMappings(videos: Array<{id: string, title: string}>): Promise<VideoToBlogMapping[]> {
  const mappings: VideoToBlogMapping[] = [];
  
  for (const video of videos) {
    const blogSlug = generateBlogSlug(video.title);
    const blogTitle = generateBlogTitle(video.title);
    const exists = await checkBlogPostExists(blogSlug);
    
    mappings.push({
      videoId: video.id,
      videoTitle: video.title,
      blogSlug,
      blogTitle,
      exists
    });
  }
  
  return mappings;
}

/**
 * Generate blog post frontmatter for a video
 */
export function generateBlogPostFrontmatter(mapping: VideoToBlogMapping, videoData?: {description?: string, publishedAt?: string}): string {
  const currentDate = new Date();
  const publishDate = videoData?.publishedAt ? new Date(videoData.publishedAt) : currentDate;
  
  return `---
title: "${mapping.blogTitle}"
description: "${videoData?.description || `Learn ${mapping.blogTitle.toLowerCase()} in this comprehensive tutorial.`}"
publishDate: ${publishDate.toISOString().split('T')[0]}
tags: ["tutorial", "javascript", "web-development"]
draft: true
youtubeId: "${mapping.videoId}"
---`;
}

/**
 * Generate blog post content template
 */
export function generateBlogPostContent(mapping: VideoToBlogMapping, videoData?: {description?: string}): string {
  const frontmatter = generateBlogPostFrontmatter(mapping, videoData);
  
  return `${frontmatter}

# ${mapping.blogTitle}

> This blog post accompanies the YouTube video: [Watch on YouTube](https://www.youtube.com/watch?v=${mapping.videoId})

${videoData?.description || 'In this tutorial, we\'ll explore the concepts covered in the video and provide additional context and examples.'}

## Overview

<!-- Add video overview here -->

## Key Concepts

<!-- List the main concepts covered in the video -->

## Code Examples

<!-- Provide code examples from the video with explanations -->

## Additional Resources

- [Watch the video on YouTube](https://www.youtube.com/watch?v=${mapping.videoId})
- <!-- Add related documentation links -->
- <!-- Add related tutorials -->

## Next Steps

<!-- Suggest what to learn next -->

---

*This post is part of my YouTube tutorial series. Subscribe to [my channel](https://www.youtube.com/channel/UCtzNXx0YjJFvAuAPL9ZjQOw) for more tutorials!*
`;
}