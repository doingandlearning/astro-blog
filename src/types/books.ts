export interface Book {
  title: string;
  author: string;
  dateFinished: Date;
  genre: string;
  pages: number;
  coverUrl: string;
}

export interface LLMResponse {
  enhancedGenre: string;
  bookCategory: string;
  readingLevel: string;
  themes: string[];
  targetAudience: string;
  complexity: string;
  readingTime: string;
  relatedBooks: string[];
  keyInsights: string[];
  tags: string[];
}

export interface BookWithEnhancedData extends Book {
  enhancedGenre?: string;
  readingYear: number;
  readingMonth: number;
  isCurrentlyReading?: boolean;
  isbn?: string;
  description?: string;
  slug?: string;
  rating?: number;
  imageSrc?: string;
  enhancedData?: any;
  // LLM-enhanced categorization fields
  llmProcessed?: boolean;
  llmProcessedAt?: string;
  bookCategory?: string;
  readingLevel?: string;
  themes?: string[];
  targetAudience?: string;
  complexity?: string;
  readingTime?: string;
  relatedBooks?: string[];
  keyInsights?: string[];
  tags?: string[];
}

export interface BookFilters {
  genres: string[];
  authors: string[];
  years: number[];
  searchQuery: string;
}

export interface BookStats {
  totalBooks: number;
  totalPages: number;
  averagePagesPerBook: number;
  booksThisYear: number;
  genreDistribution: Record<string, number>;
  readingTimeline: Record<number, number>;
}

export interface BookGroup {
  name: string;
  books: BookWithEnhancedData[];
  count: number;
}

export interface BookSearchResult {
  books: BookWithEnhancedData[];
  totalCount: number;
  filteredCount: number;
  appliedFilters: BookFilters;
}
