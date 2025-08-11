import { AtpAgent } from '@atproto/api';

export interface BlueskyPost {
  uri: string;
  cid: string;
  author: {
    did: string;
    handle: string;
    displayName?: string;
    avatar?: string;
  };
  record: {
    text: string;
    createdAt: string;
    langs?: string[];
  };
  indexedAt: string;
  likeCount?: number;
  repostCount?: number;
  replyCount?: number;
}

export interface BlueskyConfig {
  serviceUrl: string;
  identifier: string; // Your Bluesky handle (e.g., "username.bsky.social")
  password: string; // App-specific password
}

/**
 * Default Bluesky service URL
 */
export const DEFAULT_BLUESKY_SERVICE = 'https://bsky.social';

/**
 * Create and authenticate Bluesky agent
 * @param config - Bluesky authentication configuration
 * @returns Authenticated AtpAgent instance
 */
export async function createBlueskyAgent(config: BlueskyConfig): Promise<AtpAgent> {
  try {
    const agent = new AtpAgent({ service: config.serviceUrl });
    
    // Login with app password
    await agent.login({
      identifier: config.identifier,
      password: config.password,
    });

    return agent;
  } catch (error) {
    console.error('Bluesky authentication error:', error);
    throw handleBlueskyError(error);
  }
}

/**
 * Fetch recent posts from a Bluesky user's timeline
 * @param handle - Bluesky handle to fetch posts from
 * @param maxPosts - Maximum number of posts to return
 * @param config - Bluesky authentication configuration
 * @returns Array of Bluesky posts
 */
export async function getBlueskyPosts(
  handle: string,
  maxPosts: number = 20,
  config: BlueskyConfig
): Promise<BlueskyPost[]> {
  try {
    const agent = await createBlueskyAgent(config);
    
    // Get author feed using the official API
    const response = await agent.getAuthorFeed({
      actor: handle,
      limit: maxPosts,
    });

    if (!response.success) {
      throw new Error('Failed to fetch posts from Bluesky API');
    }

    // Transform the response to our interface
    return response.data.feed.map(item => ({
      uri: item.post.uri,
      cid: item.post.cid,
      author: {
        did: item.post.author.did,
        handle: item.post.author.handle,
        displayName: item.post.author.displayName,
        avatar: item.post.author.avatar,
      },
      record: {
        text: String(item.post.record.text || ''),
        createdAt: String(item.post.record.createdAt || ''),
        langs: Array.isArray(item.post.record.langs) ? item.post.record.langs.map(String) : [],
      },
      indexedAt: item.post.indexedAt,
      likeCount: item.post.likeCount,
      repostCount: item.post.repostCount,
      replyCount: item.post.replyCount,
    }));
  } catch (error) {
    console.error('Error fetching Bluesky posts:', error);
    // Return fallback posts in case of error
    return getFallbackPosts();
  }
}

/**
 * Fallback posts when API fails
 */
function getFallbackPosts(): BlueskyPost[] {
  return [
    {
      uri: 'at://did:plc:fallback/post/1',
      cid: 'fallback-cid-1',
      author: {
        did: 'did:plc:fallback',
        handle: 'username.bsky.social',
        displayName: 'Username',
        avatar: '',
      },
      record: {
        text: 'Sample Bluesky post - API temporarily unavailable',
        createdAt: new Date().toISOString(),
        langs: ['en'],
      },
      indexedAt: new Date().toISOString(),
      likeCount: 0,
      repostCount: 0,
      replyCount: 0,
    },
    {
      uri: 'at://did:plc:fallback/post/2',
      cid: 'fallback-cid-2',
      author: {
        did: 'did:plc:fallback',
        handle: 'username.bsky.social',
        displayName: 'Username',
        avatar: '',
      },
      record: {
        text: 'Check back later for fresh content from Bluesky',
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        langs: ['en'],
      },
      indexedAt: new Date(Date.now() - 86400000).toISOString(),
      likeCount: 0,
      repostCount: 0,
      replyCount: 0,
    },
  ];
}

/**
 * Enhanced error handling with specific error types
 */
export class BlueskyError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public originalError?: any
  ) {
    super(message);
    this.name = 'BlueskyError';
  }
}

/**
 * Handle specific Bluesky API errors
 */
function handleBlueskyError(error: any): BlueskyError {
  if (error.status === 401) {
    return new BlueskyError(
      'Authentication failed. Please check your Bluesky credentials.',
      'AUTH_ERROR',
      401,
      error
    );
  } else if (error.status === 403) {
    return new BlueskyError(
      'Access denied. You may not have permission to view this content.',
      'FORBIDDEN',
      403,
      error
    );
  } else if (error.status === 429) {
    return new BlueskyError(
      'Rate limit exceeded. Please try again later.',
      'RATE_LIMIT',
      429,
      error
    );
  } else if (error.status >= 500) {
    return new BlueskyError(
      'Bluesky service is temporarily unavailable. Please try again later.',
      'SERVICE_ERROR',
      error.status,
      error
    );
  } else {
    return new BlueskyError(
      'An unexpected error occurred while fetching Bluesky posts.',
      'UNKNOWN_ERROR',
      error.status,
      error
    );
  }
}

/**
 * Transform Bluesky API response to simplified format for display
 */
export function transformBlueskyPost(post: BlueskyPost) {
  return {
    id: post.uri,
    username: post.author.handle,
    displayName: post.author.displayName || post.author.handle,
    avatar: post.author.avatar,
    content: post.record.text,
    timestamp: new Date(post.record.createdAt),
    likeCount: post.likeCount || 0,
    repostCount: post.repostCount || 0,
    replyCount: post.replyCount || 0,
  };
}
