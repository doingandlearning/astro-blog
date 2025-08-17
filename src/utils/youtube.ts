export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnailUrl: string;
}


/**
 * Fetch YouTube videos from RSS feed
 * @param channelId - The YouTube channel ID (e.g., "UCtzNXx0YjJFvAuAPL9ZjQOw")  
 * @param maxVideos - Maximum number of videos to return
 */
export async function getYouTubeVideos(channelId: string, maxVideos: number = 15): Promise<YouTubeVideo[]> {
  try {
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    console.log(`Fetching YouTube RSS feed: ${rssUrl}`);
    
    const response = await fetch(rssUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch YouTube RSS feed: ${response.status}`);
    }

    const xmlText = await response.text();
    
    // Parse XML manually since we're in a simple environment
    const allVideos = parseYouTubeRSS(xmlText);
    console.log(`Found ${allVideos.length} regular videos after filtering`);
    
    // Since we filtered during parsing, we might need more from RSS to reach maxVideos
    // RSS typically returns 15 most recent items, so we take what we can get
    return allVideos.slice(0, maxVideos);
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    // Return fallback videos in case of error
    return getFallbackVideos();
  }
}

/**
 * Simple XML parser for YouTube RSS feed
 */
function parseYouTubeRSS(xmlText: string): YouTubeVideo[] {
  const videos: YouTubeVideo[] = [];
  
  // Extract video entries using regex (simple approach for RSS)
  const entryRegex = /<entry>(.*?)<\/entry>/gs;
  const entries = xmlText.match(entryRegex) || [];
  
  for (const entry of entries) {
    try {
      // Extract video ID
      const videoIdMatch = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
      const videoId = videoIdMatch?.[1];
      
      // Extract title
      const titleMatch = entry.match(/<title>(.*?)<\/title>/);
      const title = titleMatch?.[1] || '';
      
      // Extract description
      const descMatch = entry.match(/<media:description>(.*?)<\/media:description>/s);
      const description = descMatch?.[1] || '';
      
      // Extract published date
      const publishedMatch = entry.match(/<published>(.*?)<\/published>/);
      const publishedAt = publishedMatch?.[1] || '';
      
      // Extract thumbnail
      const thumbnailMatch = entry.match(/<media:thumbnail url="(.*?)"/);
      const thumbnailUrl = thumbnailMatch?.[1] || '';
      
      // Extract additional metadata that might help identify live streams
      // const authorMatch = entry.match(/<name>(.*?)<\/name>/);
      // const _author = authorMatch?.[1] || '';
      
      if (videoId && title && isRegularVideo(title, description, entry)) {
        videos.push({
          id: videoId,
          title: cleanXMLText(title),
          description: cleanXMLText(description),
          publishedAt,
          thumbnailUrl
        });
      }
    } catch (error) {
      console.warn('Error parsing video entry:', error);
      continue;
    }
  }
  
  return videos;
}

/**
 * Filter function to identify regular videos (exclude shorts and live streams)
 */
function isRegularVideo(title: string, description: string, fullEntry?: string): boolean {
  const cleanTitle = title.toLowerCase();
  const cleanDescription = description.toLowerCase();
  
  // Filter out shorts - YouTube Shorts often have these indicators
  const shortsIndicators = [
    '#shorts',
    '#short',
    'youtube shorts',
    'shorts video',
    'short video',
    'yt shorts'
  ];
  
  // Enhanced live stream detection - more comprehensive patterns
  const liveIndicators = [
    // Direct live indicators
    'live stream',
    'livestream', 
    'live now',
    'streaming live',
    'going live',
    'live broadcast',
    'live session',
    'live coding',
    'live tutorial',
    'live workshop',
    'live demo',
    'live walkthrough',
    'live q&a',
    'live qa',
    'live discussion',
    'live chat',
    'live event',
    'live training',
    'live webinar',
    
    // Symbols and formatting
    '🔴 live',
    '🔴live',
    'live:',
    'live -',
    'live |',
    '- live',
    '| live',
    '[live]',
    '(live)',
    
    // Time-based live indicators
    'streaming now',
    'broadcasting live',
    'live right now',
    'currently live',
    'join me live',
    'tune in live',
    'watch live',
    
    // Past live streams (often kept as recordings)
    'live replay',
    'recorded live',
    'was live',
    'previously live',
    'live recording',
    'live stream replay'
  ];
  
  // Check for shorts indicators
  for (const indicator of shortsIndicators) {
    if (cleanTitle.includes(indicator) || cleanDescription.includes(indicator)) {
      console.log(`Filtering out shorts: ${title}`);
      return false;
    }
  }
  
  // Check for live stream indicators in title and description
  for (const indicator of liveIndicators) {
    if (cleanTitle.includes(indicator) || cleanDescription.includes(indicator)) {
      console.log(`Filtering out live stream: ${title}`);
      return false;
    }
  }
  
  // Additional live stream heuristics
  // Check if title starts with common live patterns
  const liveStartPatterns = [
    'live:',
    'live -',
    'live |',
    '🔴',
    'streaming:',
    'broadcasting:'
  ];
  
  for (const pattern of liveStartPatterns) {
    if (cleanTitle.startsWith(pattern) || cleanTitle.includes(` ${pattern}`)) {
      console.log(`Filtering out live stream (start pattern): ${title}`);
      return false;
    }
  }
  
  // Check for date/time patterns that suggest live streams
  const dateTimePatterns = [
    /\d{1,2}\/\d{1,2}\/\d{2,4}/, // Date patterns like 12/25/2024
    /\d{1,2}-\d{1,2}-\d{2,4}/,   // Date patterns like 12-25-2024
    /\d{1,2}:\d{2}\s?(am|pm)/i,  // Time patterns like 3:30 PM
    /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,
    /\b(today|tomorrow|tonight|this morning|this afternoon|this evening)\b/i
  ];
  
  for (const pattern of dateTimePatterns) {
    if (pattern.test(cleanTitle) && cleanTitle.includes('live')) {
      console.log(`Filtering out live stream (date/time pattern): ${title}`);
      return false;
    }
  }
  
  // Additional patterns that often appear in live streams
  const additionalLivePatterns = [
    'working with',  // Often used in live coding sessions
    'building with', // Live building sessions
    'exploring',     // Live exploration
    'walkthrough',   // Often live walkthroughs
    'office hours',  // Live office hours
    'ama',          // Ask me anything sessions
    'ask me anything'
  ];
  
  // Specific content patterns to filter out
  const specificContentPatterns = [
    'mojo programming', // Mojo programming content
    'mojo language',
    'local first academy', // Local First Academy content
    'Mojo Programmign',
    'academy',  // General academy content that might be live
    'cohort',   // Cohort-based courses
    'bootcamp', // Bootcamp content
    'masterclass' // Masterclass content
  ];
  
  // Check for specific content patterns
  for (const pattern of specificContentPatterns) {
    if (cleanTitle.includes(pattern) || cleanDescription.includes(pattern)) {
      console.log(`Filtering out specific content: ${title}`);
      return false;
    }
  }
  
  // Only flag these as live if they also contain time-sensitive or community words
  const contextWords = ['live', 'today', 'now', 'currently', 'join', 'together', 'questions'];
  
  for (const pattern of additionalLivePatterns) {
    if (cleanTitle.includes(pattern)) {
      for (const context of contextWords) {
        if (cleanTitle.includes(context) || cleanDescription.includes(context)) {
          console.log(`Filtering out potential live stream (pattern + context): ${title}`);
          return false;
        }
      }
    }
  }
  
  // Check the full XML entry for additional metadata if provided
  if (fullEntry) {
    const cleanEntry = fullEntry.toLowerCase();
    
    // Look for media:community statistics that might indicate live content
    if (cleanEntry.includes('media:community') && cleanEntry.includes('live')) {
      console.log(`Filtering out live stream (XML metadata): ${title}`);
      return false;
    }
    
    // Check for yt:statistics that might indicate live streams
    if (cleanEntry.includes('yt:statistics') && cleanEntry.includes('live')) {
      console.log(`Filtering out live stream (YouTube statistics): ${title}`);
      return false;
    }
  }
  
  // Additional heuristic: Shorts are typically very short titles with certain patterns
  if (cleanTitle.length < 25 && (
    cleanTitle.includes('quick') ||
    cleanTitle.includes('tip') ||
    cleanTitle.includes('in 60') ||
    cleanTitle.includes('seconds') ||
    cleanTitle.includes('minute') ||
    cleanTitle.includes('fast')
  )) {
    console.log(`Filtering out potential short (heuristic): ${title}`);
    return false;
  }
  
  return true;
}

/**
 * Clean XML text by removing HTML entities and CDATA
 */
function cleanXMLText(text: string): string {
  return text
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

/**
 * Fallback videos in case RSS feed fails
 */
function getFallbackVideos(): YouTubeVideo[] {
  return [
    {
      id: "dQw4w9WgXcQ", // Replace with actual video IDs
      title: "Building Modern Web Applications with JavaScript",
      description: "Learn how to build scalable web applications using modern JavaScript frameworks and best practices.",
      publishedAt: "2024-01-01T00:00:00Z",
      thumbnailUrl: ""
    },
    {
      id: "dQw4w9WgXcQ",
      title: "React Hooks: A Complete Guide", 
      description: "Master React hooks with practical examples and real-world use cases.",
      publishedAt: "2024-01-01T00:00:00Z",
      thumbnailUrl: ""
    },
    {
      id: "dQw4w9WgXcQ",
      title: "Node.js API Development Masterclass",
      description: "Build robust APIs with Node.js, Express, and best security practices.",
      publishedAt: "2024-01-01T00:00:00Z", 
      thumbnailUrl: ""
    }
  ];
}

/**
 * Get channel ID from channel handle (if needed for future use)
 * This would require YouTube Data API, but we'll use the known channel ID for now
 */
export async function getChannelIdFromHandle(handle: string): Promise<string | null> {
  // For Kevin's channel, we know the ID is UCtzNXx0YjJFvAuAPL9ZjQOw
  // In a real implementation, this would use YouTube Data API
  if (handle === 'doingandlearning') {
    return 'UCtzNXx0YjJFvAuAPL9ZjQOw';
  }
  return null;
}