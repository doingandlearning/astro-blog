import type { BookWithEnhancedData } from '../types/books';

export interface EnhancedBookStats {
  // Basic counts
  totalBooks: number;
  totalPages: number;
  averagePagesPerBook: number;
  booksThisYear: number;
  
  // Enhanced categorization stats
  genreDistribution: Record<string, number>;
  bookCategoryDistribution: Record<string, number>;
  readingLevelDistribution: Record<string, number>;
  complexityDistribution: Record<string, number>;
  targetAudienceDistribution: Record<string, number>;
  
  // Reading patterns
  readingTimeline: Record<number, number>;
  monthlyReadingPattern: Record<number, number>;
  averageReadingTime: string;
  totalReadingTime: string;
  
  // Content analysis
  topThemes: Array<{ theme: string; count: number }>;
  topTags: Array<{ tag: string; count: number }>;
  mostReadAuthors: Array<{ author: string; count: number }>;
  
  // Performance metrics
  readingEfficiency: {
    pagesPerDay: number;
    booksPerMonth: number;
    averageCompletionTime: string;
  };
  
  // Recommendations
  suggestedNextReads: BookWithEnhancedData[];
  similarBooks: Record<string, BookWithEnhancedData[]>;
}

/**
 * Calculate comprehensive book statistics using enhanced LLM data
 */
export function calculateEnhancedBookStats(books: BookWithEnhancedData[]): EnhancedBookStats {
  if (books.length === 0) {
    return createEmptyStats();
  }

  const currentYear = new Date().getFullYear();
  
  // Basic calculations
  const totalBooks = books.length;
  const totalPages = books.reduce((sum, book) => sum + book.pages, 0);
  const averagePagesPerBook = Math.round(totalPages / totalBooks);
  const booksThisYear = books.filter(book => book.readingYear === currentYear).length;
  
  // Enhanced categorization distributions
  const genreDistribution = calculateDistribution(books, 'genre');
  const bookCategoryDistribution = calculateDistribution(books, 'bookCategory');
  const readingLevelDistribution = calculateDistribution(books, 'readingLevel');
  const complexityDistribution = calculateDistribution(books, 'complexity');
  const targetAudienceDistribution = calculateDistribution(books, 'targetAudience');
  
  // Reading patterns
  const readingTimeline = calculateReadingTimeline(books);
  const monthlyReadingPattern = calculateMonthlyPattern(books);
  const { averageReadingTime, totalReadingTime } = calculateReadingTimeStats(books);
  
  // Content analysis
  const topThemes = calculateTopThemes(books);
  const topTags = calculateTopTags(books);
  const mostReadAuthors = calculateTopAuthors(books);
  
  // Performance metrics
  const readingEfficiency = calculateReadingEfficiency(books);
  
  // Recommendations
  const suggestedNextReads = suggestNextReads(books);
  const similarBooks = groupSimilarBooks(books);
  
  return {
    totalBooks,
    totalPages,
    averagePagesPerBook,
    booksThisYear,
    genreDistribution,
    bookCategoryDistribution,
    readingLevelDistribution,
    complexityDistribution,
    targetAudienceDistribution,
    readingTimeline,
    monthlyReadingPattern,
    averageReadingTime,
    totalReadingTime,
    topThemes,
    topTags,
    mostReadAuthors,
    readingEfficiency,
    suggestedNextReads,
    similarBooks
  };
}

/**
 * Calculate distribution of a specific field across books
 */
function calculateDistribution(books: BookWithEnhancedData[], field: keyof BookWithEnhancedData): Record<string, number> {
  const distribution: Record<string, number> = {};
  
  books.forEach(book => {
    const value = book[field];
    if (value && typeof value === 'string') {
      distribution[value] = (distribution[value] || 0) + 1;
    }
  });
  
  return distribution;
}

/**
 * Calculate reading timeline (books per year)
 */
function calculateReadingTimeline(books: BookWithEnhancedData[]): Record<number, number> {
  const timeline: Record<number, number> = {};
  
  books.forEach(book => {
    const year = book.readingYear;
    timeline[year] = (timeline[year] || 0) + 1;
  });
  
  return timeline;
}

/**
 * Calculate monthly reading pattern
 */
function calculateMonthlyPattern(books: BookWithEnhancedData[]): Record<number, number> {
  const pattern: Record<number, number> = {};
  
  books.forEach(book => {
    const month = book.readingMonth;
    pattern[month] = (pattern[month] || 0) + 1;
  });
  
  return pattern;
}

/**
 * Calculate reading time statistics
 */
function calculateReadingTimeStats(books: BookWithEnhancedData[]): { averageReadingTime: string; totalReadingTime: string } {
  const readingTimes: number[] = [];
  
  books.forEach(book => {
    if (book.readingTime) {
      const hours = parseReadingTime(book.readingTime);
      if (hours > 0) {
        readingTimes.push(hours);
      }
    }
  });
  
  if (readingTimes.length === 0) {
    return { averageReadingTime: 'Unknown', totalReadingTime: 'Unknown' };
  }
  
  const totalHours = readingTimes.reduce((sum, hours) => sum + hours, 0);
  const averageHours = totalHours / readingTimes.length;
  
  return {
    averageReadingTime: formatReadingTime(averageHours),
    totalReadingTime: formatReadingTime(totalHours)
  };
}

/**
 * Parse reading time string to hours
 */
function parseReadingTime(timeString: string): number {
  const match = timeString.match(/(\d+)\s*hours?/i);
  if (match) {
    return parseInt(match[1]);
  }
  
  // Handle other formats like "2-3 hours", "1 hour"
  const hourMatch = timeString.match(/(\d+)/);
  if (hourMatch) {
    return parseInt(hourMatch[1]);
  }
  
  return 0;
}

/**
 * Format hours to readable string
 */
function formatReadingTime(hours: number): string {
  if (hours < 1) {
    return `${Math.round(hours * 60)} minutes`;
  } else if (hours < 24) {
    return `${Math.round(hours)} hours`;
  } else {
    const days = Math.round(hours / 24);
    return `${days} days`;
  }
}

/**
 * Calculate top themes across all books
 */
function calculateTopThemes(books: BookWithEnhancedData[]): Array<{ theme: string; count: number }> {
  const themeCounts: Record<string, number> = {};
  
  books.forEach(book => {
    if (book.themes && Array.isArray(book.themes)) {
      book.themes.forEach(theme => {
        themeCounts[theme] = (themeCounts[theme] || 0) + 1;
      });
    }
  });
  
  return Object.entries(themeCounts)
    .map(([theme, count]) => ({ theme, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

/**
 * Calculate top tags across all books
 */
function calculateTopTags(books: BookWithEnhancedData[]): Array<{ tag: string; count: number }> {
  const tagCounts: Record<string, number> = {};
  
  books.forEach(book => {
    if (book.tags && Array.isArray(book.tags)) {
      book.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });
  
  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);
}

/**
 * Calculate most read authors
 */
function calculateTopAuthors(books: BookWithEnhancedData[]): Array<{ author: string; count: number }> {
  const authorCounts: Record<string, number> = {};
  
  books.forEach(book => {
    authorCounts[book.author] = (authorCounts[book.author] || 0) + 1;
  });
  
  return Object.entries(authorCounts)
    .map(([author, count]) => ({ author, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

/**
 * Calculate reading efficiency metrics
 */
function calculateReadingEfficiency(books: BookWithEnhancedData[]): {
  pagesPerDay: number;
  booksPerMonth: number;
  averageCompletionTime: string;
} {
  if (books.length === 0) {
    return { pagesPerDay: 0, booksPerMonth: 0, averageCompletionTime: 'Unknown' };
  }
  
  // Calculate total reading period
  const dates = books.map(book => new Date(book.dateFinished)).sort((a, b) => a.getTime() - b.getTime());
  const firstDate = dates[0];
  const lastDate = dates[dates.length - 1];
  
  if (!firstDate || !lastDate) {
    return { pagesPerDay: 0, booksPerMonth: 0, averageCompletionTime: 'Unknown' };
  }
  
  const totalDays = Math.ceil((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalPages = books.reduce((sum, book) => sum + book.pages, 0);
  
  const pagesPerDay = totalDays > 0 ? Math.round((totalPages / totalDays) * 100) / 100 : 0;
  const booksPerMonth = totalDays > 0 ? Math.round((books.length / (totalDays / 30)) * 100) / 100 : 0;
  
  // Calculate average time between books
  const timeBetweenBooks = books.length > 1 ? totalDays / (books.length - 1) : 0;
  const averageCompletionTime = formatReadingTime(timeBetweenBooks * 24); // Convert days to hours
  
  return {
    pagesPerDay,
    booksPerMonth,
    averageCompletionTime
  };
}

/**
 * Suggest next books to read based on reading patterns
 */
function suggestNextReads(books: BookWithEnhancedData[]): BookWithEnhancedData[] {
  // Find books with high ratings or that are currently being read
  const currentReads = books.filter(book => book.isCurrentlyReading);
  
  if (currentReads.length > 0) {
    return currentReads;
  }
  
  // Suggest based on reading level progression
  const readingLevels = ['Beginner', 'Intermediate', 'Advanced'];
  const userLevel = determineUserReadingLevel(books);
  const nextLevel = readingLevels[Math.min(readingLevels.indexOf(userLevel) + 1, readingLevels.length - 1)];
  
  return books
    .filter(book => book.readingLevel === nextLevel)
    .sort((a, b) => new Date(b.dateFinished).getTime() - new Date(a.dateFinished).getTime())
    .slice(0, 3);
}

/**
 * Determine user's current reading level based on recent books
 */
function determineUserReadingLevel(books: BookWithEnhancedData[]): string {
  const recentBooks = books
    .sort((a, b) => new Date(b.dateFinished).getTime() - new Date(a.dateFinished).getTime())
    .slice(0, 5);
  
  const levelCounts: Record<string, number> = {};
  recentBooks.forEach(book => {
    if (book.readingLevel) {
      levelCounts[book.readingLevel] = (levelCounts[book.readingLevel] || 0) + 1;
    }
  });
  
  if (Object.keys(levelCounts).length === 0) return 'Intermediate';
  
  return Object.entries(levelCounts)
    .sort(([, a], [, b]) => b - a)[0][0];
}

/**
 * Group books by similarity for recommendations
 */
function groupSimilarBooks(books: BookWithEnhancedData[]): Record<string, BookWithEnhancedData[]> {
  const groups: Record<string, BookWithEnhancedData[]> = {};
  
  books.forEach(book => {
    // Group by genre
    if (book.genre) {
      if (!groups[book.genre]) groups[book.genre] = [];
      groups[book.genre].push(book);
    }
    
    // Group by book category
    if (book.bookCategory) {
      if (!groups[book.bookCategory]) groups[book.bookCategory] = [];
      groups[book.bookCategory].push(book);
    }
    
    // Group by themes
    if (book.themes && Array.isArray(book.themes)) {
      book.themes.forEach(theme => {
        if (!groups[theme]) groups[theme] = [];
        groups[theme].push(book);
      });
    }
  });
  
  return groups;
}

/**
 * Create empty stats object for when no books exist
 */
function createEmptyStats(): EnhancedBookStats {
  return {
    totalBooks: 0,
    totalPages: 0,
    averagePagesPerBook: 0,
    booksThisYear: 0,
    genreDistribution: {},
    bookCategoryDistribution: {},
    readingLevelDistribution: {},
    complexityDistribution: {},
    targetAudienceDistribution: {},
    readingTimeline: {},
    monthlyReadingPattern: {},
    averageReadingTime: 'Unknown',
    totalReadingTime: 'Unknown',
    topThemes: [],
    topTags: [],
    mostReadAuthors: [],
    readingEfficiency: {
      pagesPerDay: 0,
      booksPerMonth: 0,
      averageCompletionTime: 'Unknown'
    },
    suggestedNextReads: [],
    similarBooks: {}
  };
}
