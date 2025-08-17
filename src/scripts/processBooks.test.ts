import { describe, it, expect, beforeEach } from 'vitest';
import {
  parseCSVData,
  generateFallbackCoverData,
  applyDataFallbacks,
  validateAndCleanBookData,
  formatDateForDisplay,
  getQuarterFromDate,
  getYearQuarter,
  standardizeGenre,
  getGenreCategory,
  transformBookData,
  handleCSVProcessingError,
} from './processBooks';
import type { BookWithEnhancedData } from '../types/books';

describe('CSV Processing and Validation', () => {
  let sampleCSV: string;
  let sampleBook: BookWithEnhancedData;

  beforeEach(() => {
    sampleCSV = `Title,Author,Date Finished,Genre,Pages,Cover URL
"Test Book 1","Test Author 1","2024-01-15","Fiction","300","https://example.com/cover1.jpg"
"Test Book 2","Test Author 2","2024-02-20","Science Fiction","400","https://example.com/cover2.jpg"
"Test Book 3","Test Author 3","","Mystery","250",""
"Test Book 4","","2024-03-10","","",""
"","Test Author 5","2024-04-05","Romance","350","https://example.com/cover5.jpg"`;

    sampleBook = {
      title: 'Test Book',
      author: 'Test Author',
      dateFinished: new Date('2024-01-01'),
      genre: 'Fiction',
      pages: 300,
      coverUrl: 'https://example.com/cover.jpg',
      readingYear: 2024,
      readingMonth: 1,
      isCurrentlyReading: false,
    };
  });

  describe('parseCSVData', () => {
    it('should parse valid CSV data correctly', () => {
      const result = parseCSVData(sampleCSV);
      
      expect(result.books).toHaveLength(2); // Only 2 valid books
      expect(result.errors).toHaveLength(3); // 3 invalid rows
      expect(result.stats.totalRows).toBe(5);
      expect(result.stats.successfulRows).toBe(2);
      expect(result.stats.failedRows).toBe(3);
      expect(result.stats.skippedRows).toBe(0);
    });

    it('should handle empty CSV content', () => {
      const result = parseCSVData('');
      expect(result.books).toHaveLength(0);
      expect(result.errors).toHaveLength(0); // Empty CSV doesn't generate parsing errors
      expect(result.stats.totalRows).toBe(0);
    });

    it('should handle CSV with only headers', () => {
      const csvWithOnlyHeaders = 'Title,Author,Date Finished,Genre,Pages,Cover URL';
      const result = parseCSVData(csvWithOnlyHeaders);
      
      expect(result.books).toHaveLength(0);
      expect(result.stats.totalRows).toBe(0);
    });

    it('should validate required fields correctly', () => {
      const invalidCSV = `Title,Author,Date Finished,Genre,Pages,Cover URL
"","Test Author","2024-01-01","Fiction","300","https://example.com/cover.jpg"
"Test Book","","2024-01-01","Fiction","300","https://example.com/cover.jpg"`;
      
      const result = parseCSVData(invalidCSV);
      expect(result.errors).toHaveLength(2);
      expect(result.stats.failedRows).toBe(2);
    });

    it('should handle malformed dates', () => {
      const invalidDateCSV = `Title,Author,Date Finished,Genre,Pages,Cover URL
"Test Book","Test Author","invalid-date","Fiction","300","https://example.com/cover.jpg"`;
      
      const result = parseCSVData(invalidDateCSV);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('Invalid date format');
    });

    it('should handle invalid page counts', () => {
      const invalidPagesCSV = `Title,Author,Date Finished,Genre,Pages,Cover URL
"Test Book","Test Author","2024-01-01","Fiction","invalid","https://example.com/cover.jpg"`;
      
      const result = parseCSVData(invalidPagesCSV);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('Invalid pages format');
    });
  });

  describe('generateFallbackCoverData', () => {
    it('should return original cover when available', () => {
      const result = generateFallbackCoverData(sampleBook);
      
      expect(result.fallbackUrl).toBe('https://example.com/cover.jpg');
      expect(result.fallbackAlt).toBe('Cover of Test Book by Test Author');
      expect(result.hasFallback).toBe(false);
    });

    it('should generate fallback cover when missing', () => {
      const bookWithoutCover = { ...sampleBook, coverUrl: '' };
      const result = generateFallbackCoverData(bookWithoutCover);
      
      expect(result.fallbackUrl).toContain('via.placeholder.com');
      expect(result.fallbackUrl).toContain('Test%20Book');
      expect(result.fallbackAlt).toBe('No cover available for Test Book by Test Author');
      expect(result.hasFallback).toBe(true);
    });

    it('should handle very long titles in fallback', () => {
      const bookWithLongTitle = { ...sampleBook, title: 'A Very Long Book Title That Exceeds Normal Length Limits', coverUrl: '' };
      const result = generateFallbackCoverData(bookWithLongTitle);
      
      expect(result.fallbackUrl).toContain('A%20Very%20Long%20Book%20T');
      expect(result.fallbackUrl.length).toBeLessThan(500);
    });
  });

  describe('applyDataFallbacks', () => {
    it('should apply genre inference when missing', () => {
      const bookWithoutGenre = { ...sampleBook, genre: '' };
      const result = applyDataFallbacks(bookWithoutGenre);
      
      expect(result.genre).toBe('Fiction'); // Default fallback
    });

    it('should estimate pages when missing', () => {
      const bookWithoutPages = { ...sampleBook, pages: 0 };
      const result = applyDataFallbacks(bookWithoutPages);
      
      expect(result.pages).toBe(350); // Default for Fiction
    });

    it('should handle missing date', () => {
      const bookWithoutDate = { ...sampleBook, dateFinished: new Date('invalid') };
      const result = applyDataFallbacks(bookWithoutDate);
      
      expect(result.dateFinished).toBeInstanceOf(Date);
      expect(result.readingYear).toBe(new Date().getFullYear());
    });

    it('should handle missing author', () => {
      const bookWithoutAuthor = { ...sampleBook, author: '' };
      const result = applyDataFallbacks(bookWithoutAuthor);
      
      expect(result.author).toBe('Unknown Author');
    });
  });

  describe('validateAndCleanBookData', () => {
    it('should return clean book with no warnings when data is complete', () => {
      const result = validateAndCleanBookData(sampleBook);
      
      expect(result.warnings).toHaveLength(0);
      expect(result.hasFallbacks).toBe(false);
      expect(result.book).toEqual(sampleBook);
    });

    it('should generate warnings for missing data', () => {
      const incompleteBook = { ...sampleBook, coverUrl: '', genre: '', pages: 0 };
      const result = validateAndCleanBookData(incompleteBook);
      
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.hasFallbacks).toBe(true);
      expect(result.warnings.some(w => w.includes('cover URL'))).toBe(true);
      expect(result.warnings.some(w => w.includes('genre'))).toBe(true);
      expect(result.warnings.some(w => w.includes('page count'))).toBe(true);
    });
  });

  describe('Date Formatting Utilities', () => {
    it('should format date for display correctly', () => {
      const date = new Date('2024-03-15');
      const result = formatDateForDisplay(date);
      
      expect(result).toBe('March 2024');
    });

    it('should get quarter from date correctly', () => {
      const q1Date = new Date('2024-02-15');
      const q2Date = new Date('2024-05-15');
      const q3Date = new Date('2024-08-15');
      const q4Date = new Date('2024-11-15');
      
      expect(getQuarterFromDate(q1Date)).toBe('Q1');
      expect(getQuarterFromDate(q2Date)).toBe('Q2');
      expect(getQuarterFromDate(q3Date)).toBe('Q3');
      expect(getQuarterFromDate(q4Date)).toBe('Q4');
    });

    it('should get year-quarter combination correctly', () => {
      const date = new Date('2024-06-15');
      const result = getYearQuarter(date);
      
      expect(result).toBe('2024-Q2');
    });
  });

  describe('Genre Standardization', () => {
    it('should standardize common genre variations', () => {
      expect(standardizeGenre('sci-fi')).toBe('Science Fiction');
      expect(standardizeGenre('non-fiction')).toBe('Non-Fiction');
      expect(standardizeGenre('self help')).toBe('Self-Help');
      expect(standardizeGenre('tech')).toBe('Technology');
      expect(standardizeGenre('phil')).toBe('Philosophy');
    });

    it('should handle unknown genres gracefully', () => {
      expect(standardizeGenre('')).toBe('Unknown');
      expect(standardizeGenre('very specific niche genre')).toBe('Very Specific Niche Genre');
    });

    it('should categorize genres correctly', () => {
      expect(getGenreCategory('Science Fiction')).toBe('Science Fiction & Fantasy');
      expect(getGenreCategory('Mystery')).toBe('Mystery & Thriller');
      expect(getGenreCategory('Business')).toBe('Business & Self-Help');
      expect(getGenreCategory('Unknown Genre')).toBe('Other');
    });
  });

  describe('transformBookData', () => {
    it('should transform book data with standardized genre', () => {
      const bookWithVariation = { ...sampleBook, genre: 'sci-fi' };
      const result = transformBookData(bookWithVariation);
      
      expect(result.genre).toBe('Science Fiction');
      expect(result.title).toBe(bookWithVariation.title);
      expect(result.author).toBe(bookWithVariation.author);
    });
  });

  describe('Error Handling', () => {
    it('should handle different error types correctly', () => {
      const error = new Error('Test error');
      const stringError = 'String error';
      const unknownError = { custom: 'error' };
      
      expect(handleCSVProcessingError(error, 'Context')).toBe('Context: Test error');
      expect(handleCSVProcessingError(stringError, 'Context')).toBe('Context: String error');
      expect(handleCSVProcessingError(unknownError, 'Context')).toBe('Context: Unknown error occurred');
    });
  });

  describe('Edge Cases', () => {
    it('should handle extremely long titles gracefully', () => {
      const longTitle = 'A'.repeat(300);
      const bookWithLongTitle = { ...sampleBook, title: longTitle };
      
      expect(() => validateAndCleanBookData(bookWithLongTitle)).not.toThrow();
    });

    it('should handle special characters in titles', () => {
      const specialTitle = 'Book with "quotes", & symbols, and émojis 🚀';
      const bookWithSpecialTitle = { ...sampleBook, title: specialTitle };
      
      expect(() => validateAndCleanBookData(bookWithSpecialTitle)).not.toThrow();
    });

    it('should handle future dates gracefully', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      
      const bookWithFutureDate = { ...sampleBook, dateFinished: futureDate };
      const result = validateAndCleanBookData(bookWithFutureDate);
      
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });
});
