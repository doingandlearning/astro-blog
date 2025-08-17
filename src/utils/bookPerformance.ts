import type { BookWithEnhancedData } from '../types/books';

export interface PerformanceMetrics {
  searchTime: number;
  filterTime: number;
  sortTime: number;
  totalOperations: number;
  cacheHitRate: number;
}

export interface BookIndex {
  byTitle: Map<string, BookWithEnhancedData>;
  byAuthor: Map<string, BookWithEnhancedData[]>;
  byGenre: Map<string, BookWithEnhancedData[]>;
  byTags: Map<string, BookWithEnhancedData[]>;
  byThemes: Map<string, BookWithEnhancedData[]>;
  byReadingLevel: Map<string, BookWithEnhancedData[]>;
  byComplexity: Map<string, BookWithEnhancedData[]>;
  byYear: Map<number, BookWithEnhancedData[]>;
  byMonth: Map<number, BookWithEnhancedData[]>;
}

export interface SearchResult {
  books: BookWithEnhancedData[];
  searchTime: number;
  relevance: number;
  totalResults: number;
}

/**
 * Performance-optimized book data manager
 */
export class BookPerformanceManager {
  private books: BookWithEnhancedData[] = [];
  private index: BookIndex;
  private searchCache: Map<string, SearchResult> = new Map();
  private performanceMetrics: PerformanceMetrics = {
    searchTime: 0,
    filterTime: 0,
    sortTime: 0,
    totalOperations: 0,
    cacheHitRate: 0
  };

  constructor(books: BookWithEnhancedData[]) {
    this.books = books;
    this.index = this.buildIndex(books);
  }

  /**
   * Build search index for fast lookups
   */
  private buildIndex(books: BookWithEnhancedData[]): BookIndex {
    const startTime = performance.now();
    
    const index: BookIndex = {
      byTitle: new Map(),
      byAuthor: new Map(),
      byGenre: new Map(),
      byTags: new Map(),
      byThemes: new Map(),
      byReadingLevel: new Map(),
      byComplexity: new Map(),
      byYear: new Map(),
      byMonth: new Map()
    };

    books.forEach(book => {
      // Index by title
      index.byTitle.set(book.title.toLowerCase(), book);
      
      // Index by author
      if (!index.byAuthor.has(book.author)) {
        index.byAuthor.set(book.author, []);
      }
      index.byAuthor.get(book.author)!.push(book);
      
      // Index by genre
      if (!index.byGenre.has(book.genre)) {
        index.byGenre.set(book.genre, []);
      }
      index.byGenre.get(book.genre)!.push(book);
      
      // Index by tags
      if (book.tags && Array.isArray(book.tags)) {
        book.tags.forEach(tag => {
          if (!index.byTags.has(tag)) {
            index.byTags.set(tag, []);
          }
          index.byTags.get(tag)!.push(book);
        });
      }
      
      // Index by themes
      if (book.themes && Array.isArray(book.themes)) {
        book.themes.forEach(theme => {
          if (!index.byThemes.has(theme)) {
            index.byThemes.set(theme, []);
          }
          index.byThemes.get(theme)!.push(book);
        });
      }
      
      // Index by reading level
      if (book.readingLevel) {
        if (!index.byReadingLevel.has(book.readingLevel)) {
          index.byReadingLevel.set(book.readingLevel, []);
        }
        index.byReadingLevel.get(book.readingLevel)!.push(book);
      }
      
      // Index by complexity
      if (book.complexity) {
        if (!index.byComplexity.has(book.complexity)) {
          index.byComplexity.set(book.complexity, []);
        }
        index.byComplexity.get(book.complexity)!.push(book);
      }
      
      // Index by year
      if (!index.byYear.has(book.readingYear)) {
        index.byYear.set(book.readingYear, []);
      }
      index.byYear.get(book.readingYear)!.push(book);
      
      // Index by month
      if (!index.byMonth.has(book.readingMonth)) {
        index.byMonth.set(book.readingMonth, []);
      }
      index.byMonth.get(book.readingMonth)!.push(book);
    });

    const indexTime = performance.now() - startTime;
    console.log(`Index built in ${indexTime.toFixed(2)}ms`);
    
    return index;
  }

  /**
   * Fast search with relevance scoring
   */
  search(query: string, limit: number = 50): SearchResult {
    const startTime = performance.now();
    const cacheKey = `${query}:${limit}`;
    
    // Check cache first
    if (this.searchCache.has(cacheKey)) {
      this.performanceMetrics.cacheHitRate++;
      return this.searchCache.get(cacheKey)!;
    }

    const queryLower = query.toLowerCase();
    const results = new Map<BookWithEnhancedData, number>();
    
    // Search in titles (highest relevance)
    this.books.forEach(book => {
      let relevance = 0;
      
      // Title match (highest weight)
      if (book.title.toLowerCase().includes(queryLower)) {
        relevance += 100;
        // Exact title match gets bonus
        if (book.title.toLowerCase() === queryLower) {
          relevance += 50;
        }
      }
      
      // Author match
      if (book.author.toLowerCase().includes(queryLower)) {
        relevance += 80;
      }
      
      // Genre match
      if (book.genre.toLowerCase().includes(queryLower)) {
        relevance += 60;
      }
      
      // Tags match
      if (book.tags && Array.isArray(book.tags)) {
        book.tags.forEach(tag => {
          if (tag.toLowerCase().includes(queryLower)) {
            relevance += 40;
          }
        });
      }
      
      // Themes match
      if (book.themes && Array.isArray(book.themes)) {
        book.themes.forEach(theme => {
          if (theme.toLowerCase().includes(queryLower)) {
            relevance += 30;
          }
        });
      }
      
      // Key insights match
      if (book.keyInsights && Array.isArray(book.keyInsights)) {
        book.keyInsights.forEach(insight => {
          if (insight.toLowerCase().includes(queryLower)) {
            relevance += 20;
          }
        });
      }
      
      if (relevance > 0) {
        results.set(book, relevance);
      }
    });
    
    // Sort by relevance and limit results
    const sortedResults = Array.from(results.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([book]) => book);
    
    const searchTime = performance.now() - startTime;
    this.performanceMetrics.searchTime += searchTime;
    this.performanceMetrics.totalOperations++;
    
    const result: SearchResult = {
      books: sortedResults,
      searchTime,
      relevance: sortedResults.length > 0 ? results.get(sortedResults[0])! : 0,
      totalResults: sortedResults.length
    };
    
    // Cache the result
    this.searchCache.set(cacheKey, result);
    
    // Limit cache size
    if (this.searchCache.size > 100) {
      const firstKey = this.searchCache.keys().next().value;
      if (firstKey) {
        this.searchCache.delete(firstKey);
      }
    }
    
    return result;
  }

  /**
   * Fast filtering with multiple criteria
   */
  filter(criteria: {
    genres?: string[];
    authors?: string[];
    readingLevels?: string[];
    complexities?: string[];
    years?: number[];
    tags?: string[];
    themes?: string[];
    minPages?: number;
    maxPages?: number;
  }): BookWithEnhancedData[] {
    const startTime = performance.now();
    
    let filteredBooks = this.books;
    
    // Apply filters using index lookups for better performance
    if (criteria.genres && criteria.genres.length > 0) {
      const genreBooks = new Set<BookWithEnhancedData>();
      criteria.genres.forEach(genre => {
        const books = this.index.byGenre.get(genre) || [];
        books.forEach(book => genreBooks.add(book));
      });
      filteredBooks = filteredBooks.filter(book => genreBooks.has(book));
    }
    
    if (criteria.authors && criteria.authors.length > 0) {
      const authorBooks = new Set<BookWithEnhancedData>();
      criteria.authors.forEach(author => {
        const books = this.index.byAuthor.get(author) || [];
        books.forEach(book => authorBooks.add(book));
      });
      filteredBooks = filteredBooks.filter(book => authorBooks.has(book));
    }
    
    if (criteria.readingLevels && criteria.readingLevels.length > 0) {
      const levelBooks = new Set<BookWithEnhancedData>();
      criteria.readingLevels.forEach(level => {
        const books = this.index.byReadingLevel.get(level) || [];
        books.forEach(book => levelBooks.add(book));
      });
      filteredBooks = filteredBooks.filter(book => levelBooks.has(book));
    }
    
    if (criteria.complexities && criteria.complexities.length > 0) {
      const complexityBooks = new Set<BookWithEnhancedData>();
      criteria.complexities.forEach(complexity => {
        const books = this.index.byComplexity.get(complexity) || [];
        books.forEach(book => complexityBooks.add(book));
      });
      filteredBooks = filteredBooks.filter(book => complexityBooks.has(book));
    }
    
    if (criteria.years && criteria.years.length > 0) {
      const yearBooks = new Set<BookWithEnhancedData>();
      criteria.years.forEach(year => {
        const books = this.index.byYear.get(year) || [];
        books.forEach(book => yearBooks.add(book));
      });
      filteredBooks = filteredBooks.filter(book => yearBooks.has(book));
    }
    
    if (criteria.tags && criteria.tags.length > 0) {
      const tagBooks = new Set<BookWithEnhancedData>();
      criteria.tags.forEach(tag => {
        const books = this.index.byTags.get(tag) || [];
        books.forEach(book => tagBooks.add(book));
      });
      filteredBooks = filteredBooks.filter(book => tagBooks.has(book));
    }
    
    if (criteria.themes && criteria.themes.length > 0) {
      const themeBooks = new Set<BookWithEnhancedData>();
      criteria.themes.forEach(theme => {
        const books = this.index.byThemes.get(theme) || [];
        books.forEach(book => themeBooks.add(book));
      });
      filteredBooks = filteredBooks.filter(book => themeBooks.has(book));
    }
    
    if (criteria.minPages !== undefined) {
      filteredBooks = filteredBooks.filter(book => book.pages >= criteria.minPages!);
    }
    
    if (criteria.maxPages !== undefined) {
      filteredBooks = filteredBooks.filter(book => book.pages <= criteria.maxPages!);
    }
    
    const filterTime = performance.now() - startTime;
    this.performanceMetrics.filterTime += filterTime;
    this.performanceMetrics.totalOperations++;
    
    return filteredBooks;
  }

  /**
   * Fast sorting with multiple criteria
   */
  sort(books: BookWithEnhancedData[], criteria: {
    field: keyof BookWithEnhancedData;
    direction: 'asc' | 'desc';
  }[]): BookWithEnhancedData[] {
    const startTime = performance.now();
    
    const sortedBooks = [...books].sort((a, b) => {
      for (const { field, direction } of criteria) {
        const aValue = a[field];
        const bValue = b[field];
        
        if (aValue === undefined && bValue === undefined) continue;
        if (aValue === undefined) return direction === 'asc' ? -1 : 1;
        if (bValue === undefined) return direction === 'asc' ? 1 : -1;
        
        let comparison = 0;
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          comparison = aValue.localeCompare(bValue);
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          comparison = aValue - bValue;
        } else if (aValue instanceof Date && bValue instanceof Date) {
          comparison = aValue.getTime() - bValue.getTime();
        }
        
        if (comparison !== 0) {
          return direction === 'asc' ? comparison : -comparison;
        }
      }
      
      return 0;
    });
    
    const sortTime = performance.now() - startTime;
    this.performanceMetrics.sortTime += sortTime;
    this.performanceMetrics.totalOperations++;
    
    return sortedBooks;
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): PerformanceMetrics {
    const totalOps = this.performanceMetrics.totalOperations;
    return {
      ...this.performanceMetrics,
      cacheHitRate: totalOps > 0 ? this.performanceMetrics.cacheHitRate / totalOps : 0
    };
  }

  /**
   * Clear cache to free memory
   */
  clearCache(): void {
    this.searchCache.clear();
    console.log('Search cache cleared');
  }

  /**
   * Update books and rebuild index
   */
  updateBooks(newBooks: BookWithEnhancedData[]): void {
    this.books = newBooks;
    this.index = this.buildIndex(newBooks);
    this.clearCache();
    console.log('Book index updated');
  }
}
