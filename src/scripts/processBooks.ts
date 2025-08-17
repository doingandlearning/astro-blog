import Papa from 'papaparse';
import type { BookWithEnhancedData } from '../types/books';

export interface CSVBookRow {
  Title: string;
  Author: string;
  'Date Finished': string;
  Genre: string;
  Pages: string;
  'Cover URL': string;
}

export interface ProcessingResult {
  books: BookWithEnhancedData[];
  errors: string[];
  warnings: string[];
  stats: {
    totalRows: number;
    successfulRows: number;
    failedRows: number;
    skippedRows: number;
    warningRows: number;
  };
}

/**
 * Parse CSV data and convert to Book objects
 */
export function parseCSVData(csvContent: string): ProcessingResult {
  const result: ProcessingResult = {
    books: [],
    errors: [],
    warnings: [],
    stats: {
      totalRows: 0,
      successfulRows: 0,
      failedRows: 0,
      skippedRows: 0,
      warningRows: 0,
    },
  };

  try {
    const parsed = Papa.parse<CSVBookRow>(csvContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      transform: (value) => value.trim(),
    });

    result.stats.totalRows = parsed.data.length;

    for (let i = 0; i < parsed.data.length; i++) {
      const row = parsed.data[i];
      const rowNumber = i + 2; // +2 because of 0-based index and header row

      // Skip completely empty rows
      if (isRowEmpty(row)) {
        result.stats.skippedRows++;
        continue;
      }

      try {
        const book = validateAndTransformRow(row, rowNumber);
        if (book) {
          result.books.push(book);
          result.stats.successfulRows++;
        }
      } catch (error) {
        const errorMessage = `Row ${rowNumber}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        result.errors.push(errorMessage);
        result.stats.failedRows++;
      }
    }
  } catch (error) {
    result.errors.push(`CSV parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return result;
}

/**
 * Validate and transform a CSV row to a Book object
 */
function validateAndTransformRow(row: CSVBookRow, rowNumber: number): BookWithEnhancedData | null {
  // Validate required fields
  validateRequiredFields(row, rowNumber);

  // Validate and parse date
  const dateFinished = validateAndParseDate(row['Date Finished'], rowNumber);

  // Validate and parse pages
  const pages = validateAndParsePages(row.Pages, rowNumber);

  // Validate and process genre
  const genre = validateAndProcessGenre(row.Genre, rowNumber);

  // Validate and process cover URL
  const coverUrl = validateAndProcessCoverUrl(row['Cover URL'], rowNumber);

  // Extract year and month for enhanced data
  const readingYear = dateFinished.getFullYear();
  const readingMonth = dateFinished.getMonth() + 1; // getMonth() returns 0-11

  return {
    title: row.Title.trim(),
    author: row.Author.trim(),
    dateFinished,
    genre,
    pages,
    coverUrl,
    readingYear,
    readingMonth,
    isCurrentlyReading: false, // Default to false, can be enhanced later
  };
}

/**
 * Validate required fields (title and author)
 */
function validateRequiredFields(row: CSVBookRow, _rowNumber: number): void {
  if (!row.Title || row.Title.trim().length === 0) {
    throw new Error('Title is required and cannot be empty');
  }

  if (!row.Author || row.Author.trim().length === 0) {
    throw new Error('Author is required and cannot be empty');
  }

  // Validate title length (reasonable limits)
  if (row.Title.trim().length > 200) {
    throw new Error('Title is too long (maximum 200 characters)');
  }

  // Validate author length
  if (row.Author.trim().length > 100) {
    throw new Error('Author name is too long (maximum 100 characters)');
  }
}

/**
 * Validate and parse date field
 */
function validateAndParseDate(dateString: string, rowNumber: number): Date {
  if (!dateString || dateString.trim().length === 0) {
    throw new Error('Date Finished is required');
  }

  const date = parseDate(dateString, rowNumber);
  if (!date) {
    throw new Error('Invalid date format. Expected YYYY-MM-DD or other recognized format');
  }

  // Validate date is not in the future
  const now = new Date();
  if (date > now) {
    throw new Error('Date Finished cannot be in the future');
  }

  // Validate date is not too far in the past (reasonable limit)
  const minDate = new Date('1900-01-01');
  if (date < minDate) {
    throw new Error('Date Finished is too far in the past (before 1900)');
  }

  return date;
}

/**
 * Validate and parse pages field
 */
function validateAndParsePages(pagesString: string, rowNumber: number): number {
  if (!pagesString || pagesString.trim().length === 0) {
    throw new Error('Pages is required');
  }

  const pages = parsePages(pagesString, rowNumber);
  if (pages === null) {
    throw new Error('Invalid pages format. Expected a positive number');
  }

  // Validate reasonable page count limits
  if (pages < 1) {
    throw new Error('Pages must be at least 1');
  }

  if (pages > 10000) {
    throw new Error('Pages count is unreasonably high (maximum 10,000)');
  }

  return pages;
}

/**
 * Validate and process genre field
 */
function validateAndProcessGenre(genre: string, _rowNumber: number): string {
  if (!genre || genre.trim().length === 0) {
    return 'Unknown';
  }

  const trimmedGenre = genre.trim();
  
  // Validate genre length
  if (trimmedGenre.length > 50) {
    throw new Error('Genre is too long (maximum 50 characters)');
  }

  return trimmedGenre;
}

/**
 * Validate and process cover URL field
 */
function validateAndProcessCoverUrl(coverUrl: string, rowNumber: number): string {
  if (!coverUrl || coverUrl.trim().length === 0) {
    return '';
  }

  const trimmedUrl = coverUrl.trim();
  
  // Validate URL length
  if (trimmedUrl.length > 500) {
    throw new Error('Cover URL is too long (maximum 500 characters)');
  }

  // Basic URL format validation (optional, since some URLs might be complex)
  try {
    new URL(trimmedUrl);
  } catch {
    // Don't throw error for URL validation - just log a warning
    console.warn(`Row ${rowNumber}: Cover URL may not be a valid URL format: ${trimmedUrl}`);
  }

  return trimmedUrl;
}

/**
 * Generate fallback cover image data for books without covers
 */
export function generateFallbackCoverData(book: BookWithEnhancedData): {
  fallbackUrl: string;
  fallbackAlt: string;
  hasFallback: boolean;
} {
  if (book.coverUrl && book.coverUrl.trim().length > 0) {
    return {
      fallbackUrl: book.coverUrl,
      fallbackAlt: `Cover of ${book.title} by ${book.author}`,
      hasFallback: false,
    };
  }

  // Generate a fallback cover using a placeholder service
  const fallbackUrl = `https://via.placeholder.com/300x400/cccccc/666666?text=${encodeURIComponent(book.title.substring(0, 20))}`;
  
  return {
    fallbackUrl,
    fallbackAlt: `No cover available for ${book.title} by ${book.author}`,
    hasFallback: true,
  };
}

/**
 * Handle missing or invalid data with intelligent fallbacks
 */
export function applyDataFallbacks(book: BookWithEnhancedData): BookWithEnhancedData {
  const enhancedBook = { ...book };

  // Handle missing genre
  if (!enhancedBook.genre || enhancedBook.genre === 'Unknown') {
    enhancedBook.genre = inferGenreFromTitle(enhancedBook.title);
  }

  // Handle missing pages
  if (!enhancedBook.pages || enhancedBook.pages <= 0) {
    enhancedBook.pages = estimatePagesFromGenre(enhancedBook.genre);
  }

  // Handle missing date
  if (!enhancedBook.dateFinished || isNaN(enhancedBook.dateFinished.getTime())) {
    enhancedBook.dateFinished = new Date(); // Default to current date
    enhancedBook.readingYear = new Date().getFullYear();
    enhancedBook.readingMonth = new Date().getMonth() + 1;
  }

  // Handle missing author
  if (!enhancedBook.author || enhancedBook.author.trim().length === 0) {
    enhancedBook.author = 'Unknown Author';
  }

  return enhancedBook;
}

/**
 * Infer genre from book title using keyword analysis
 */
function inferGenreFromTitle(title: string): string {
  if (!title) return 'Unknown';
  
  const lowerTitle = title.toLowerCase();
  
  // Fiction indicators
  if (lowerTitle.includes('novel') || lowerTitle.includes('story') || lowerTitle.includes('tale')) {
    return 'Fiction';
  }
  
  // Science Fiction indicators
  if (lowerTitle.includes('space') || lowerTitle.includes('robot') || lowerTitle.includes('alien') || 
      lowerTitle.includes('future') || lowerTitle.includes('planet') || lowerTitle.includes('star')) {
    return 'Science Fiction';
  }
  
  // Fantasy indicators
  if (lowerTitle.includes('magic') || lowerTitle.includes('dragon') || lowerTitle.includes('wizard') ||
      lowerTitle.includes('kingdom') || lowerTitle.includes('quest') || lowerTitle.includes('spell')) {
    return 'Fantasy';
  }
  
  // Mystery/Thriller indicators
  if (lowerTitle.includes('murder') || lowerTitle.includes('detective') || lowerTitle.includes('crime') ||
      lowerTitle.includes('mystery') || lowerTitle.includes('suspense') || lowerTitle.includes('thriller')) {
    return 'Mystery';
  }
  
  // Non-fiction indicators
  if (lowerTitle.includes('guide') || lowerTitle.includes('manual') || lowerTitle.includes('how to') ||
      lowerTitle.includes('complete') || lowerTitle.includes('essential') || lowerTitle.includes('introduction')) {
    return 'Non-Fiction';
  }
  
  // Technology indicators
  if (lowerTitle.includes('programming') || lowerTitle.includes('code') || lowerTitle.includes('software') ||
      lowerTitle.includes('computer') || lowerTitle.includes('web') || lowerTitle.includes('app')) {
    return 'Technology';
  }
  
  // Business indicators
  if (lowerTitle.includes('business') || lowerTitle.includes('management') || lowerTitle.includes('strategy') ||
      lowerTitle.includes('leadership') || lowerTitle.includes('marketing') || lowerTitle.includes('finance')) {
    return 'Business';
  }
  
  // Self-help indicators
  if (lowerTitle.includes('self-help') || lowerTitle.includes('personal') || lowerTitle.includes('success') ||
      lowerTitle.includes('happiness') || lowerTitle.includes('mindfulness') || lowerTitle.includes('productivity')) {
    return 'Self-Help';
  }
  
  return 'Fiction'; // Default to fiction as most common
}

/**
 * Estimate page count based on genre (when actual count is missing)
 */
function estimatePagesFromGenre(genre: string): number {
  const standardizedGenre = standardizeGenre(genre);
  
  const genrePageEstimates: Record<string, number> = {
    'Fiction': 350,
    'Literary Fiction': 400,
    'Science Fiction': 380,
    'Fantasy': 450,
    'Mystery': 320,
    'Thriller': 350,
    'Romance': 300,
    'Non-Fiction': 280,
    'Biography': 400,
    'Memoir': 350,
    'History': 450,
    'Business': 300,
    'Self-Help': 250,
    'Technology': 350,
    'Philosophy': 400,
    'Psychology': 350,
    'Travel': 300,
    'Poetry': 150,
    'Children\'s': 200,
    'Young Adult': 300,
  };
  
  return genrePageEstimates[standardizedGenre] || 350; // Default to 350 pages
}

/**
 * Validate and clean book data with comprehensive fallbacks
 */
export function validateAndCleanBookData(book: BookWithEnhancedData): {
  book: BookWithEnhancedData;
  warnings: string[];
  hasFallbacks: boolean;
} {
  const warnings: string[] = [];
  let hasFallbacks = false;
  
  // Check for missing data and apply fallbacks
  if (!book.coverUrl || book.coverUrl.trim().length === 0) {
    warnings.push(`Missing cover URL for "${book.title}" - using fallback image`);
    hasFallbacks = true;
  }
  
  if (!book.genre || book.genre === 'Unknown') {
    warnings.push(`Missing genre for "${book.title}" - inferred from title`);
    hasFallbacks = true;
  }
  
  if (!book.pages || book.pages <= 0) {
    warnings.push(`Missing page count for "${book.title}" - estimated from genre`);
    hasFallbacks = true;
  }
  
  if (!book.dateFinished || isNaN(book.dateFinished.getTime())) {
    warnings.push(`Missing date for "${book.title}" - using current date`);
    hasFallbacks = true;
  } else {
    // Check for future dates
    const now = new Date();
    if (book.dateFinished > now) {
      warnings.push(`Future date detected for "${book.title}" - date may be incorrect`);
      hasFallbacks = true;
    }
  }
  
  // Apply fallbacks
  const cleanedBook = applyDataFallbacks(book);
  
  return {
    book: cleanedBook,
    warnings,
    hasFallbacks,
  };
}

/**
 * Add a warning to the processing result
 */
function addWarning(_result: ProcessingResult, _message: string): void {
  _result.warnings.push(_message);
  _result.stats.warningRows++;
}

/**
 * Enhanced error handling for CSV processing
 */
export function handleCSVProcessingError(error: unknown, context: string): string {
  if (error instanceof Error) {
    return `${context}: ${error.message}`;
  }
  
  if (typeof error === 'string') {
    return `${context}: ${error}`;
  }
  
  return `${context}: Unknown error occurred`;
}

/**
 * Check if a CSV row is completely empty
 */
function isRowEmpty(row: CSVBookRow): boolean {
  return Object.values(row).every(value => !value || value.trim().length === 0);
}

/**
 * Parse date string to Date object
 */
function parseDate(dateString: string, _rowNumber: number): Date | null {
  if (!dateString) return null;

  // Try parsing as ISO date (YYYY-MM-DD)
  const isoDate = new Date(dateString);
  if (!isNaN(isoDate.getTime()) && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return isoDate;
  }

  // Try parsing as other common formats
  const parsedDate = new Date(dateString);
  if (!isNaN(parsedDate.getTime())) {
    return parsedDate;
  }

  return null;
}

/**
 * Parse pages string to number
 */
function parsePages(pagesString: string, _rowNumber: number): number | null {
  if (!pagesString) return null;

  const pages = parseInt(pagesString, 10);
  if (isNaN(pages) || pages <= 0) {
    return null;
  }

  return pages;
}

/**
 * Data transformation utilities for date formatting and genre standardization
 */

/**
 * Format date for display (e.g., "January 2024", "Q1 2024")
 */
export function formatDateForDisplay(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  return `${monthNames[month]} ${year}`;
}

/**
 * Get quarter from date (Q1, Q2, Q3, Q4)
 */
export function getQuarterFromDate(date: Date): string {
  const month = date.getMonth();
  const quarter = Math.floor(month / 3) + 1;
  return `Q${quarter}`;
}

/**
 * Get year-quarter combination (e.g., "2024-Q1")
 */
export function getYearQuarter(date: Date): string {
  const year = date.getFullYear();
  const quarter = getQuarterFromDate(date);
  return `${year}-${quarter}`;
}

/**
 * Standardize genre names for consistent categorization
 */
export function standardizeGenre(genre: string): string {
  if (!genre) return 'Unknown';
  
  const trimmed = genre.trim().toLowerCase();
  
  // Common genre variations and standardizations
  const genreMap: Record<string, string> = {
    // Fiction variations
    'fiction': 'Fiction',
    'novel': 'Fiction',
    'literary fiction': 'Literary Fiction',
    'literary': 'Literary Fiction',
    
    // Science Fiction variations
    'sci-fi': 'Science Fiction',
    'scifi': 'Science Fiction',
    'science fiction': 'Science Fiction',
    'sf': 'Science Fiction',
    
    // Fantasy variations
    'fantasy': 'Fantasy',
    'high fantasy': 'Fantasy',
    'epic fantasy': 'Fantasy',
    
    // Mystery/Thriller variations
    'mystery': 'Mystery',
    'thriller': 'Thriller',
    'suspense': 'Thriller',
    'crime': 'Crime',
    'detective': 'Mystery',
    
    // Romance variations
    'romance': 'Romance',
    'romantic': 'Romance',
    'love story': 'Romance',
    
    // Non-fiction variations
    'non-fiction': 'Non-Fiction',
    'nonfiction': 'Non-Fiction',
    'non fiction': 'Non-Fiction',
    
    // Biography/Memoir variations
    'biography': 'Biography',
    'memoir': 'Memoir',
    'autobiography': 'Biography',
    'bio': 'Biography',
    
    // History variations
    'history': 'History',
    'historical': 'History',
    'hist': 'History',
    
    // Business/Self-help variations
    'business': 'Business',
    'self-help': 'Self-Help',
    'self help': 'Self-Help',
    'selfhelp': 'Self-Help',
    'personal development': 'Self-Help',
    
    // Technology variations
    'tech': 'Technology',
    'technology': 'Technology',
    'computer science': 'Technology',
    'programming': 'Technology',
    'software': 'Technology',
    
    // Philosophy variations
    'philosophy': 'Philosophy',
    'philosophical': 'Philosophy',
    'phil': 'Philosophy',
    
    // Psychology variations
    'psychology': 'Psychology',
    'psych': 'Psychology',
    'mental health': 'Psychology',
    
    // Travel variations
    'travel': 'Travel',
    'travelogue': 'Travel',
    'adventure': 'Adventure',
    
    // Poetry variations
    'poetry': 'Poetry',
    'poem': 'Poetry',
    'poems': 'Poetry',
    
    // Children's/YA variations
    'children': 'Children\'s',
    'children\'s': 'Children\'s',
    'young adult': 'Young Adult',
    'ya': 'Young Adult',
    'middle grade': 'Children\'s',
  };
  
  // Check for exact matches first
  if (genreMap[trimmed]) {
    return genreMap[trimmed];
  }
  
  // Check for partial matches (e.g., "science fiction" contains "fiction")
  for (const [key, value] of Object.entries(genreMap)) {
    if (trimmed.includes(key) || key.includes(trimmed)) {
      return value;
    }
  }
  
  // If no match found, capitalize first letter of each word
  return trimmed
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get genre category (high-level grouping)
 */
export function getGenreCategory(genre: string): string {
  const standardized = standardizeGenre(genre);
  
  const categoryMap: Record<string, string> = {
    // Fiction categories
    'Fiction': 'Fiction',
    'Literary Fiction': 'Fiction',
    'Science Fiction': 'Science Fiction & Fantasy',
    'Fantasy': 'Science Fiction & Fantasy',
    
    // Mystery & Thriller
    'Mystery': 'Mystery & Thriller',
    'Thriller': 'Mystery & Thriller',
    'Crime': 'Mystery & Thriller',
    
    // Romance
    'Romance': 'Romance',
    
    // Non-fiction categories
    'Non-Fiction': 'Non-Fiction',
    'Biography': 'Biography & Memoir',
    'History': 'History',
    'Business': 'Business & Self-Help',
    'Self-Help': 'Business & Self-Help',
    'Technology': 'Technology & Science',
    'Philosophy': 'Philosophy & Religion',
    'Psychology': 'Psychology & Health',
    'Travel': 'Travel & Adventure',
    'Poetry': 'Poetry & Literature',
    'Children\'s': 'Children & Young Adult',
    'Young Adult': 'Children & Young Adult',
  };
  
  return categoryMap[standardized] || 'Other';
}

/**
 * Transform book data with enhanced formatting and categorization
 */
export function transformBookData(book: BookWithEnhancedData): BookWithEnhancedData {
  return {
    ...book,
    genre: standardizeGenre(book.genre),
    // Add additional transformed fields if needed
  };
}

/**
 * Read and process CSV file from the public directory
 */
export async function processBooksCSV(): Promise<ProcessingResult> {
  try {
    // In Astro, we'll need to read this during build time
    // For now, this function will be called with the CSV content
    throw new Error('This function should be called with CSV content during build time');
  } catch (error) {
    return {
      books: [],
      errors: [`Failed to read CSV file: ${error instanceof Error ? error.message : 'Unknown error'}`],
      warnings: [],
      stats: {
        totalRows: 0,
        successfulRows: 0,
        failedRows: 0,
        skippedRows: 0,
        warningRows: 0,
      },
    };
  }
}

/**
 * Process books data during Astro build time
 * This function will be called from Astro pages to get processed book data
 */
export async function getProcessedBooksData(): Promise<{
  books: BookWithEnhancedData[];
  stats: {
    totalBooks: number;
    totalPages: number;
    averagePagesPerBook: number;
    booksThisYear: number;
    genreDistribution: Record<string, number>;
    readingTimeline: Record<number, number>;
  };
  processingInfo: {
    errors: string[];
    warnings: string[];
    hasFallbacks: boolean;
  };
}> {
  try {
    // Import the CSV content - this will be available at build time
    // We'll use a dynamic import to get the CSV content
    const csvModule = await import('../../public/data/books.csv?raw');
    const csvContent = csvModule.default;
    
    // Process the CSV content
    const processingResult = parseCSVData(csvContent);
    
    // Apply data fallbacks and cleaning to all books
    const cleanedBooks: BookWithEnhancedData[] = [];
    const allWarnings: string[] = [];
    let hasAnyFallbacks = false;
    
    for (const book of processingResult.books) {
      const cleanedResult = validateAndCleanBookData(book);
      cleanedBooks.push(cleanedResult.book);
      allWarnings.push(...cleanedResult.warnings);
      if (cleanedResult.hasFallbacks) {
        hasAnyFallbacks = true;
      }
    }
    
    // Calculate statistics
    const stats = calculateBookStats(cleanedBooks);
    
    return {
      books: cleanedBooks,
      stats,
      processingInfo: {
        errors: processingResult.errors,
        warnings: [...processingResult.warnings, ...allWarnings],
        hasFallbacks: hasAnyFallbacks,
      },
    };
  } catch (error) {
    console.error('Error processing books data:', error);
    
    // Return empty data with error information
    return {
      books: [],
      stats: {
        totalBooks: 0,
        totalPages: 0,
        averagePagesPerBook: 0,
        booksThisYear: 0,
        genreDistribution: {},
        readingTimeline: {},
      },
      processingInfo: {
        errors: [`Failed to process books data: ${error instanceof Error ? error.message : 'Unknown error'}`],
        warnings: [],
        hasFallbacks: false,
      },
    };
  }
}

/**
 * Calculate comprehensive book statistics
 */
function calculateBookStats(books: BookWithEnhancedData[]): {
  totalBooks: number;
  totalPages: number;
  averagePagesPerBook: number;
  booksThisYear: number;
  genreDistribution: Record<string, number>;
  readingTimeline: Record<number, number>;
} {
  if (books.length === 0) {
    return {
      totalBooks: 0,
      totalPages: 0,
      averagePagesPerBook: 0,
      booksThisYear: 0,
      genreDistribution: {},
      readingTimeline: {},
    };
  }
  
  const currentYear = new Date().getFullYear();
  let totalPages = 0;
  const genreCount: Record<string, number> = {};
  const yearCount: Record<number, number> = {};
  
  for (const book of books) {
    // Count pages
    totalPages += book.pages;
    
    // Count genres
    const genre = standardizeGenre(book.genre);
    genreCount[genre] = (genreCount[genre] || 0) + 1;
    
    // Count by year
    const year = book.readingYear;
    yearCount[year] = (yearCount[year] || 0) + 1;
  }
  
  return {
    totalBooks: books.length,
    totalPages,
    averagePagesPerBook: Math.round(totalPages / books.length),
    booksThisYear: yearCount[currentYear] || 0,
    genreDistribution: genreCount,
    readingTimeline: yearCount,
  };
}
