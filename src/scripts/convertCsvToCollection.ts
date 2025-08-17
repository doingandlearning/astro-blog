import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { parseCSVData, validateAndCleanBookData } from './processBooks';
import type { BookWithEnhancedData } from '../types/books';

/**
 * Convert CSV data to individual JSON files for Astro content collection
 */
export async function convertCsvToCollection(csvContent: string): Promise<{
  success: boolean;
  message: string;
  processedBooks: number;
  errors: string[];
}> {
  try {
    // Process the CSV data
    const processingResult = parseCSVData(csvContent);
    
    if (processingResult.errors.length > 0) {
      return {
        success: false,
        message: 'CSV processing failed',
        processedBooks: 0,
        errors: processingResult.errors,
      };
    }

    // Create the books directory if it doesn't exist
    const booksDir = join(process.cwd(), 'src', 'content', 'books');
    await mkdir(booksDir, { recursive: true });

    // Process each book and create individual JSON files
    const processedBooks: BookWithEnhancedData[] = [];
    const errors: string[] = [];

    for (const book of processingResult.books) {
      try {
        // Clean and validate the book data
        const cleanedResult = validateAndCleanBookData(book);
        const cleanedBook = cleanedResult.book;
        
        // Convert to content collection format
        const collectionBook = {
          title: cleanedBook.title,
          author: cleanedBook.author,
          dateFinished: cleanedBook.dateFinished.toISOString().split('T')[0], // YYYY-MM-DD format
          genre: cleanedBook.genre,
          pages: cleanedBook.pages,
          coverUrl: cleanedBook.coverUrl || undefined,
          readingYear: cleanedBook.readingYear,
          readingMonth: cleanedBook.readingMonth,
          enhancedGenre: cleanedBook.enhancedGenre || undefined,
          isCurrentlyReading: cleanedBook.isCurrentlyReading || false,
        };

        // Create filename from title (sanitized)
        const filename = sanitizeFilename(cleanedBook.title);
        const filePath = join(booksDir, `${filename}.json`);

        // Write the JSON file
        await writeFile(filePath, JSON.stringify(collectionBook, null, 2));
        
        processedBooks.push(cleanedBook);
      } catch (error) {
        const errorMessage = `Failed to process book "${book.title}": ${error instanceof Error ? error.message : 'Unknown error'}`;
        errors.push(errorMessage);
      }
    }

    return {
      success: true,
      message: `Successfully converted ${processedBooks.length} books to content collection`,
      processedBooks: processedBooks.length,
      errors,
    };
  } catch (error) {
    return {
      success: false,
      message: `Conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      processedBooks: 0,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
    };
  }
}

/**
 * Sanitize filename from book title
 */
function sanitizeFilename(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
    .substring(0, 100); // Limit length
}

/**
 * Generate a sample book for testing
 */
export function generateSampleBook(): any {
  return {
    title: "Sample Book",
    author: "Sample Author",
    dateFinished: "2024-01-15",
    genre: "Fiction",
    pages: 300,
    coverUrl: "https://example.com/cover.jpg",
    readingYear: 2024,
    readingMonth: 1,
    enhancedGenre: "Literary Fiction",
    isCurrentlyReading: false,
  };
}
