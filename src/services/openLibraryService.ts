/**
 * OpenLibrary API Service
 * 
 * This service integrates with the OpenLibrary API to fetch book metadata
 * including page counts, cover URLs, and other book information.
 */

export interface OpenLibraryBook {
  key: string;
  title: string;
  authors?: Array<{ key: string; name: string }>;
  number_of_pages_median?: number;
  covers?: number[];
  first_sentence?: { type: string; value: string };
  publish_date?: string;
  publishers?: Array<{ key: string; name: string }>;
  subjects?: string[];
}

export interface OpenLibrarySearchResult {
  numFound: number;
  start: number;
  docs: OpenLibraryBook[];
}

export interface OpenLibraryServiceResponse {
  success: boolean;
  data?: OpenLibraryBook;
  error?: string;
  searchResults?: OpenLibraryBook[];
  retryCount?: number;
  rateLimited?: boolean;
}

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

export class OpenLibraryService {
  private readonly baseUrl = 'https://openlibrary.org';
  private readonly searchUrl = `${this.baseUrl}/search.json`;
  private readonly worksUrl = `${this.baseUrl}/works`;
  private readonly coversUrl = 'https://covers.openlibrary.org/b';
  
  private readonly retryConfig: RetryConfig = {
    maxRetries: 3,
    baseDelay: 1000, // 1 second
    maxDelay: 10000,  // 10 seconds
    backoffMultiplier: 2
  };

  private requestCount = 0;
  private lastRequestTime = 0;
  private readonly minRequestInterval = 100; // Minimum 100ms between requests

  constructor() {
    // No API key required for OpenLibrary
  }

  /**
   * Search for books by title and author
   */
  async searchBooks(title: string, author: string): Promise<OpenLibraryServiceResponse> {
    try {
      const query = `${title} ${author}`.trim();
      const searchUrl = `${this.searchUrl}?q=${encodeURIComponent(query)}&limit=10&fields=key,title,authors,number_of_pages_median,covers,first_sentence,publish_date,publishers,subjects`;

      console.log(`🔍 Searching OpenLibrary for: "${query}"`);

      const response = await this.makeRequest(searchUrl, { method: 'GET' });

      const data: OpenLibrarySearchResult = await response.json();
      
      if (data.numFound === 0) {
        return {
          success: false,
          error: 'No books found matching the search criteria'
        };
      }

      console.log(`📚 Found ${data.numFound} books, showing top ${data.docs.length} results`);

      return {
        success: true,
        searchResults: data.docs
      };

    } catch (error) {
      return {
        success: false,
        error: `Search failed: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * Get detailed book information by work key
   */
  async getBookDetails(workKey: string): Promise<OpenLibraryServiceResponse> {
    try {
      const url = `${this.worksUrl}/${workKey}.json`;
      
      console.log(`📖 Fetching details for work: ${workKey}`);

      const response = await this.makeRequest(url, { method: 'GET' });

      const book: OpenLibraryBook = await response.json();

      return {
        success: true,
        data: book
      };

    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch book details: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * Get cover image URL for a book
   */
  getCoverUrl(coverId: number, size: 'S' | 'M' | 'L' = 'M'): string {
    return `${this.coversUrl}/${coverId}-${size}.jpg`;
  }

  /**
   * Extract page count from book data
   */
  getPageCount(book: OpenLibraryBook): number | undefined {
    return book.number_of_pages_median;
  }

  /**
   * Extract cover URL from book data
   */
  getCoverUrlFromBook(book: OpenLibraryBook): string | undefined {
    if (book.covers && book.covers.length > 0) {
      return this.getCoverUrl(book.covers[0]);
    }
    return undefined;
  }

  /**
   * Get all available cover URLs for a book
   */
  getAllCoverUrls(book: OpenLibraryBook): { small: string; medium: string; large: string } | undefined {
    if (!book.covers || book.covers.length === 0) {
      return undefined;
    }

    const coverId = book.covers[0];
    return {
      small: this.getCoverUrl(coverId, 'S'),
      medium: this.getCoverUrl(coverId, 'M'),
      large: this.getCoverUrl(coverId, 'L')
    };
  }

  /**
   * Extract and format book metadata summary
   */
  getBookSummary(book: OpenLibraryBook): {
    title: string;
    authors: string[];
    pageCount: number | undefined;
    coverUrl: string | undefined;
    publishDate: string | undefined;
    publishers: string[];
    subjects: string[];
    firstSentence: string | undefined;
  } {
    return {
      title: book.title,
      authors: this.getAuthorNames(book),
      pageCount: this.getPageCount(book),
      coverUrl: this.getCoverUrlFromBook(book),
      publishDate: book.publish_date,
      publishers: this.getPublisherNames(book),
      subjects: this.getSubjects(book),
      firstSentence: this.getFirstSentence(book)
    };
  }

  /**
   * Validate if book data contains essential information
   */
  hasEssentialData(book: OpenLibraryBook): boolean {
    return !!(book.title && book.authors && book.authors.length > 0);
  }

  /**
   * Get the best available page count (median, or fallback to other sources)
   */
  getBestPageCount(book: OpenLibraryBook): number | undefined {
    // Try median page count first
    if (book.number_of_pages_median) {
      return book.number_of_pages_median;
    }
    
    // Could add fallback logic here for other page count fields
    // For now, return undefined if no page count available
    return undefined;
  }

  /**
   * Extract author names from book data
   */
  getAuthorNames(book: OpenLibraryBook): string[] {
    if (!book.authors) return [];
    return book.authors.map(author => author.name);
  }

  /**
   * Extract publisher names from book data
   */
  getPublisherNames(book: OpenLibraryBook): string[] {
    if (!book.publishers) return [];
    return book.publishers.map(publisher => publisher.name);
  }

  /**
   * Extract subjects/genres from book data
   */
  getSubjects(book: OpenLibraryBook): string[] {
    if (!book.subjects) return [];
    return book.subjects.slice(0, 5); // Limit to top 5 subjects
  }

  /**
   * Get first sentence if available
   */
  getFirstSentence(book: OpenLibraryBook): string | undefined {
    if (book.first_sentence && book.first_sentence.value) {
      return book.first_sentence.value;
    }
    return undefined;
  }

  /**
   * Check if the service is available
   */
  async checkAvailability(): Promise<boolean> {
    try {
      const response = await this.makeRequest(this.baseUrl, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Get fallback data when OpenLibrary is unavailable
   */
  getFallbackData(title: string, author: string): {
    pageCount: number | undefined;
    coverUrl: string | undefined;
    message: string;
  } {
    return {
      pageCount: undefined,
      coverUrl: undefined,
      message: `OpenLibrary data unavailable for "${title}" by ${author}". You can manually enter page count and cover URL.`
    };
  }

  /**
   * Validate if book data is complete enough to use
   */
  isDataComplete(book: OpenLibraryBook): boolean {
    return !!(book.title && 
              book.authors && 
              book.authors.length > 0 && 
              (book.number_of_pages_median || book.covers));
  }

  /**
   * Get data quality score (0-100) for a book
   */
  getDataQualityScore(book: OpenLibraryBook): number {
    let score = 0;
    
    if (book.title) score += 20;
    if (book.authors && book.authors.length > 0) score += 20;
    if (book.number_of_pages_median) score += 20;
    if (book.covers && book.covers.length > 0) score += 20;
    if (book.subjects && book.subjects.length > 0) score += 10;
    if (book.publishers && book.publishers.length > 0) score += 10;
    
    return score;
  }

  /**
   * Rate limiting helper (OpenLibrary has generous limits but good practice)
   */
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Enforce rate limiting between requests
   */
  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.minRequestInterval) {
      const delayNeeded = this.minRequestInterval - timeSinceLastRequest;
      await this.delay(delayNeeded);
    }
    
    this.lastRequestTime = Date.now();
    this.requestCount++;
  }

  /**
   * Calculate exponential backoff delay for retries
   */
  private calculateBackoffDelay(attempt: number): number {
    const delay = this.retryConfig.baseDelay * Math.pow(this.retryConfig.backoffMultiplier, attempt);
    return Math.min(delay, this.retryConfig.maxDelay);
  }

  /**
   * Check if an error is retryable
   */
  private isRetryableError(error: any): boolean {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      
      // Retry on network errors, timeouts, and rate limiting
      if (message.includes('network') || 
          message.includes('timeout') || 
          message.includes('rate limit') ||
          message.includes('too many requests') ||
          message.includes('429')) {
        return true;
      }
      
      // Retry on 5xx server errors
      if (message.includes('500') || 
          message.includes('502') || 
          message.includes('503') || 
          message.includes('504')) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Make HTTP request with retry logic and rate limiting
   */
  private async makeRequest(url: string, options: RequestInit = {}): Promise<Response> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= this.retryConfig.maxRetries; attempt++) {
      try {
        // Enforce rate limiting
        await this.enforceRateLimit();
        
        // Make the request
        const response = await fetch(url, {
          ...options,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'CLI-Book-Tool/1.0',
            ...options.headers
          }
        });

        // Check for rate limiting
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          const delayMs = retryAfter ? parseInt(retryAfter) * 1000 : this.calculateBackoffDelay(attempt);
          
          console.log(`⚠️  Rate limited. Waiting ${delayMs}ms before retry...`);
          await this.delay(delayMs);
          
          if (attempt < this.retryConfig.maxRetries) {
            continue;
          }
        }

        // Check for other retryable errors
        if (response.status >= 500 && response.status < 600) {
          if (attempt < this.retryConfig.maxRetries) {
            const delayMs = this.calculateBackoffDelay(attempt);
            console.log(`⚠️  Server error ${response.status}. Retrying in ${delayMs}ms... (attempt ${attempt + 1}/${this.retryConfig.maxRetries + 1})`);
            await this.delay(delayMs);
            continue;
          }
        }

        return response;
        
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (this.isRetryableError(lastError) && attempt < this.retryConfig.maxRetries) {
          const delayMs = this.calculateBackoffDelay(attempt);
          console.log(`⚠️  Request failed: ${lastError.message}. Retrying in ${delayMs}ms... (attempt ${attempt + 1}/${this.retryConfig.maxRetries + 1})`);
          await this.delay(delayMs);
        } else {
          break;
        }
      }
    }
    
    throw lastError || new Error('Request failed after all retry attempts');
  }

  /**
   * Get service statistics
   */
  getServiceStats(): { requestCount: number; lastRequestTime: number } {
    return {
      requestCount: this.requestCount,
      lastRequestTime: this.lastRequestTime
    };
  }
}

// Export singleton instance
export const openLibraryService = new OpenLibraryService();
