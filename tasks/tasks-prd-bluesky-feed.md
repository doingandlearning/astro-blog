# Task List: Bluesky Feed Integration

## Relevant Files

- `src/content.config.ts` - Contains the content collection schemas, needs Bluesky posts collection added
- `src/components/BlueskyFeed.astro` - New component to display Bluesky posts in a styled format
- `src/utils/bluesky.ts` - New utility file for Bluesky API integration and data fetching
- `src/pages/microblog.astro` - New page to host the Bluesky feed component
- `src/types.ts` - May need updates for Bluesky post data types
- `src/styles/global.css` - May need Bluesky-specific styling variables or utilities

### Notes

- The existing codebase has a similar pattern with YouTube integration (`YouTubeFeed.astro`, `youtube.ts`)
- Astro content collections are used for structured data management
- Build-time data fetching is already implemented for YouTube videos
- Progressive enhancement approach aligns with existing patterns

## Tasks

- [x] 1.0 Set up Bluesky API integration and data fetching
  - [x] 1.1 Research Bluesky API documentation and authentication requirements
  - [x] 1.2 Install necessary dependencies for Bluesky API integration
- [x] 1.3 Create `src/utils/bluesky.ts` utility file
  - [x] 1.4 Implement Bluesky authentication function (using app password or API key)
- [x] 1.5 Create function to fetch recent posts from Bluesky API
  - [x] 1.6 Add error handling and fallback data for API failures
  - [x] 1.7 Test API integration with sample data

- [ ] 2.0 Create Bluesky posts content collection and data schema
  - [ ] 2.1 Update `src/content.config.ts` to add Bluesky posts collection
  - [ ] 2.2 Define schema for Bluesky post data (username, displayName, content, timestamp, etc.)
  - [ ] 2.3 Create data transformation function to convert API response to collection format
  - [ ] 2.4 Implement build-time data fetching during Astro build process
  - [ ] 2.5 Add caching mechanism to store fetched posts
  - [ ] 2.6 Test content collection integration

- [ ] 3.0 Develop BlueskyFeed component with authentic styling
  - [ ] 3.1 Create `src/components/BlueskyFeed.astro` component
  - [ ] 3.2 Design component props interface (posts, maxPosts, showHeader, etc.)
  - [ ] 3.3 Implement post rendering with Bluesky-like styling
  - [ ] 3.4 Add responsive design for mobile and desktop
  - [ ] 3.5 Style individual post elements (username, timestamp, content, etc.)
  - [ ] 3.6 Add Bluesky branding elements and icons
  - [ ] 3.7 Implement loading states and error handling
  - [ ] 3.8 Test component with various post types and content lengths

- [ ] 4.0 Create microblog page and integrate feed component
  - [ ] 4.1 Create `src/pages/microblog.astro` page
  - [ ] 4.2 Set up page layout using existing BaseLayout
  - [ ] 4.3 Integrate BlueskyFeed component with appropriate props
  - [ ] 4.4 Add page metadata (title, description, etc.)
  - [ ] 4.5 Style page layout and ensure responsive design
  - [ ] 4.6 Test page rendering and component integration
  - [ ] 4.7 Add page to sitemap and RSS feed if applicable

- [ ] 5.0 Implement progressive enhancement with real-time updates
  - [ ] 5.1 Create JavaScript function to fetch latest posts from Bluesky API
  - [ ] 5.2 Implement client-side refresh mechanism on page navigation
  - [ ] 5.3 Add loading indicators during refresh operations
  - [ ] 5.4 Implement error handling for client-side fetch failures
  - [ ] 5.5 Add fallback to cached content when real-time updates fail
  - [ ] 5.6 Test progressive enhancement functionality
  - [ ] 5.7 Optimize performance and add debouncing if needed
