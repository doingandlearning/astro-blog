import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { calculateEnhancedBookStats } from '../../utils/bookStats';
import { BookPerformanceManager } from '../../utils/bookPerformance';
import { errorMonitor, withErrorHandling, withPerformanceMonitoring } from '../../utils/errorHandling';
import type { BookWithEnhancedData } from '../../types/books';

// Mock book data for testing
const mockBooks: BookWithEnhancedData[] = [
  {
    title: "The Pragmatic Programmer",
    author: "David Thomas",
    dateFinished: new Date("2024-01-15"),
    genre: "Technical",
    pages: 352,
    coverUrl: "https://example.com/pragmatic.jpg",
    readingYear: 2024,
    readingMonth: 1,
    isCurrentlyReading: false,
    bookCategory: "Technical",
    readingLevel: "Intermediate",
    themes: ["Programming", "Best Practices", "Software Development"],
    targetAudience: "Developers",
    complexity: "Moderate",
    readingTime: "8 hours",
    relatedBooks: ["Clean Code", "Refactoring"],
    keyInsights: ["Practical programming wisdom", "Career development advice"],
    tags: ["programming", "technical", "best-practices"],
    llmProcessed: true,
    llmProcessedAt: "2024-01-16T10:00:00Z"
  },
  {
    title: "1984",
    author: "George Orwell",
    dateFinished: new Date("2024-02-20"),
    genre: "Fiction",
    pages: 328,
    coverUrl: "https://example.com/1984.jpg",
    readingYear: 2024,
    readingMonth: 2,
    isCurrentlyReading: false,
    bookCategory: "Fiction",
    readingLevel: "Advanced",
    themes: ["Dystopia", "Political", "Social Commentary"],
    targetAudience: "General",
    complexity: "Complex",
    readingTime: "6 hours",
    relatedBooks: ["Brave New World", "Animal Farm"],
    keyInsights: ["Totalitarianism warning", "Language manipulation"],
    tags: ["fiction", "dystopia", "political"],
    llmProcessed: true,
    llmProcessedAt: "2024-02-21T10:00:00Z"
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    dateFinished: new Date("2024-03-10"),
    genre: "Self-Help",
    pages: 320,
    coverUrl: "https://example.com/atomic-habits.jpg",
    readingYear: 2024,
    readingMonth: 3,
    isCurrentlyReading: false,
    bookCategory: "Non-Fiction",
    readingLevel: "Beginner",
    themes: ["Habits", "Personal Development", "Psychology"],
    targetAudience: "General",
    complexity: "Simple",
    readingTime: "5 hours",
    relatedBooks: ["The Power of Habit", "Tiny Habits"],
    keyInsights: ["Small changes compound", "Identity-based habits"],
    tags: ["self-help", "habits", "psychology"],
    llmProcessed: true,
    llmProcessedAt: "2024-03-11T10:00:00Z"
  }
];

describe('Book Reading Feature Integration Tests', () => {
  let performanceManager: BookPerformanceManager;

  beforeEach(() => {
    performanceManager = new BookPerformanceManager(mockBooks);
    errorMonitor.clearLogs();
  });

  afterEach(() => {
    errorMonitor.clearLogs();
  });

  describe('Enhanced Book Statistics', () => {
    it('should calculate comprehensive statistics correctly', () => {
      const stats = calculateEnhancedBookStats(mockBooks);

      // Basic counts
      expect(stats.totalBooks).toBe(3);
      expect(stats.totalPages).toBe(1000);
      expect(stats.averagePagesPerBook).toBe(333);
      expect(stats.booksThisYear).toBe(3);

      // Enhanced categorization
      expect(stats.bookCategoryDistribution).toEqual({
        'Technical': 1,
        'Fiction': 1,
        'Non-Fiction': 1
      });

      expect(stats.readingLevelDistribution).toEqual({
        'Beginner': 1,
        'Intermediate': 1,
        'Advanced': 1
      });

      expect(stats.complexityDistribution).toEqual({
        'Simple': 1,
        'Moderate': 1,
        'Complex': 1
      });

      // Reading patterns
      expect(stats.readingTimeline).toEqual({
        2024: 3
      });

      expect(stats.monthlyReadingPattern).toEqual({
        1: 1,
        2: 1,
        3: 1
      });

      // Content analysis
      expect(stats.topThemes.length).toBeGreaterThan(0);
      expect(stats.topTags.length).toBeGreaterThan(0);
      expect(stats.mostReadAuthors.length).toBeGreaterThan(0);

      // Performance metrics
      expect(stats.readingEfficiency.pagesPerDay).toBeGreaterThan(0);
      expect(stats.readingEfficiency.booksPerMonth).toBeGreaterThan(0);
    });

    it('should handle empty book collections gracefully', () => {
      const stats = calculateEnhancedBookStats([]);

      expect(stats.totalBooks).toBe(0);
      expect(stats.totalPages).toBe(0);
      expect(stats.averagePagesPerBook).toBe(0);
      expect(stats.booksThisYear).toBe(0);
      expect(stats.topThemes).toEqual([]);
      expect(stats.topTags).toEqual([]);
      expect(stats.mostReadAuthors).toEqual([]);
    });

    it('should calculate reading efficiency correctly', () => {
      const stats = calculateEnhancedBookStats(mockBooks);
      const efficiency = stats.readingEfficiency;

      expect(efficiency.pagesPerDay).toBeGreaterThan(0);
      expect(efficiency.booksPerMonth).toBeGreaterThan(0);
      expect(typeof efficiency.averageCompletionTime).toBe('string');
    });
  });

  describe('Performance Manager', () => {
    it('should build search index correctly', () => {
      const metrics = performanceManager.getPerformanceMetrics();
      expect(metrics.totalOperations).toBe(0); // No operations yet
    });

    it('should perform fast searches with relevance scoring', () => {
      const searchResult = performanceManager.search('programming');

      expect(searchResult.books.length).toBeGreaterThan(0);
      expect(searchResult.searchTime).toBeGreaterThan(0);
      expect(searchResult.relevance).toBeGreaterThan(0);
      expect(searchResult.totalResults).toBeGreaterThan(0);

      // Check that technical books are found
      const technicalBook = searchResult.books.find(book => book.genre === 'Technical');
      expect(technicalBook).toBeDefined();
    });

    it('should filter books by multiple criteria', () => {
      const filteredBooks = performanceManager.filter({
        genres: ['Technical'],
        readingLevels: ['Intermediate'],
        complexities: ['Moderate']
      });

      expect(filteredBooks.length).toBe(1);
      expect(filteredBooks[0].title).toBe('The Pragmatic Programmer');
    });

    it('should sort books by multiple criteria', () => {
      const sortedBooks = performanceManager.sort(mockBooks, [
        { field: 'readingLevel', direction: 'asc' },
        { field: 'pages', direction: 'desc' }
      ]);

      expect(sortedBooks[0].readingLevel).toBe('Beginner');
      expect(sortedBooks[sortedBooks.length - 1].readingLevel).toBe('Advanced');
    });

    it('should cache search results for performance', () => {
      // First search
      const firstSearch = performanceManager.search('fiction');
      const firstSearchTime = firstSearch.searchTime;

      // Second search (should be cached)
      const secondSearch = performanceManager.search('fiction');
      const secondSearchTime = secondSearch.searchTime;

      // Cached search should be faster
      expect(secondSearchTime).toBeLessThan(firstSearchTime);
    });

    it('should track performance metrics', () => {
      performanceManager.search('test');
      performanceManager.filter({ genres: ['Fiction'] });
      performanceManager.sort(mockBooks, [{ field: 'title', direction: 'asc' }]);

      const metrics = performanceManager.getPerformanceMetrics();
      expect(metrics.totalOperations).toBe(3);
      expect(metrics.searchTime).toBeGreaterThan(0);
      expect(metrics.filterTime).toBeGreaterThan(0);
      expect(metrics.sortTime).toBeGreaterThan(0);
    });
  });

  describe('Error Handling and Monitoring', () => {
    it('should log errors with context', () => {
      errorMonitor.logError('Test error', 'test-context', new Error('Test error'));

      const summary = errorMonitor.getErrorSummary();
      expect(summary.total).toBe(1);
      expect(summary.errors).toBe(1);
      expect(summary.recent[0].message).toBe('Test error');
      expect(summary.recent[0].context).toBe('test-context');
    });

    it('should log warnings', () => {
      errorMonitor.logWarning('Test warning', 'test-context');

      const summary = errorMonitor.getErrorSummary();
      expect(summary.total).toBe(1);
      expect(summary.warnings).toBe(1);
      expect(summary.recent[0].message).toBe('Test warning');
    });

    it('should log performance metrics', () => {
      errorMonitor.logPerformance('test-operation', 150, 3, true);

      const summary = errorMonitor.getPerformanceSummary();
      expect(summary.total).toBe(1);
      expect(summary.averageDuration).toBe(150);
      expect(summary.operations['test-operation']).toBe(1);
    });

    it('should handle error wrapping utilities', async () => {
      const failingOperation = () => Promise.reject(new Error('Test failure'));
      
      try {
        await withErrorHandling(failingOperation, 'test-context', 'fallback');
      } catch (error) {
        // Should still throw the error
        expect(error).toBeInstanceOf(Error);
      }

      const summary = errorMonitor.getErrorSummary();
      expect(summary.errors).toBe(1);
    });

    it('should handle performance monitoring utilities', () => {
      const result = withPerformanceMonitoring(
        () => 'test-result',
        'test-operation',
        3
      );

      expect(result).toBe('test-result');

      const summary = errorMonitor.getPerformanceSummary();
      expect(summary.total).toBe(1);
      expect(summary.operations['test-operation']).toBe(1);
    });
  });

  describe('Data Integrity', () => {
    it('should handle books with missing optional fields', () => {
      const incompleteBook: BookWithEnhancedData = {
        title: "Test Book",
        author: "Test Author",
        dateFinished: new Date("2024-01-01"),
        genre: "Test",
        pages: 100,
        coverUrl: "",
        readingYear: 2024,
        readingMonth: 1,
        isCurrentlyReading: false
        // Missing optional LLM fields
      };

      const stats = calculateEnhancedBookStats([incompleteBook]);
      expect(stats.totalBooks).toBe(1);
      expect(stats.bookCategoryDistribution).toEqual({});
      expect(stats.readingLevelDistribution).toEqual({});
    });

    it('should validate book data structure', () => {
      mockBooks.forEach(book => {
        expect(book.title).toBeDefined();
        expect(book.author).toBeDefined();
        expect(book.dateFinished).toBeInstanceOf(Date);
        expect(book.genre).toBeDefined();
        expect(book.pages).toBeGreaterThan(0);
        expect(book.readingYear).toBeGreaterThan(0);
        expect(book.readingMonth).toBeGreaterThan(0);
        expect(book.readingMonth).toBeLessThanOrEqual(12);
      });
    });
  });

  describe('Performance Benchmarks', () => {
    it('should handle large book collections efficiently', () => {
      // Create a larger test dataset
      const largeBookCollection: BookWithEnhancedData[] = Array.from({ length: 1000 }, (_, i) => ({
        title: `Book ${i}`,
        author: `Author ${i % 50}`,
        dateFinished: new Date(2024, i % 12, (i % 28) + 1),
        genre: `Genre ${i % 10}`,
        pages: 100 + (i % 500),
        coverUrl: "",
        readingYear: 2024,
        readingMonth: (i % 12) + 1,
        isCurrentlyReading: false,
        bookCategory: i % 2 === 0 ? 'Fiction' : 'Non-Fiction',
        readingLevel: ['Beginner', 'Intermediate', 'Advanced'][i % 3],
        complexity: ['Simple', 'Moderate', 'Complex'][i % 3],
        llmProcessed: true,
        llmProcessedAt: new Date().toISOString()
      }));

      const startTime = performance.now();
      const stats = calculateEnhancedBookStats(largeBookCollection);
      const calculationTime = performance.now() - startTime;

      // Statistics calculation should complete in reasonable time
      expect(calculationTime).toBeLessThan(100); // Less than 100ms
      expect(stats.totalBooks).toBe(1000);
      expect(stats.totalPages).toBeGreaterThan(0);
    });

    it('should maintain search performance with large collections', () => {
      const largeCollection = Array.from({ length: 1000 }, (_, i) => ({
        title: `Book ${i}`,
        author: `Author ${i}`,
        dateFinished: new Date(2024, i % 12, 1),
        genre: `Genre ${i % 10}`,
        pages: 100 + (i % 500),
        coverUrl: "",
        readingYear: 2024,
        readingMonth: (i % 12) + 1,
        isCurrentlyReading: false,
        llmProcessed: true,
        llmProcessedAt: new Date().toISOString()
      }));

      const performanceManager = new BookPerformanceManager(largeCollection);
      
      const startTime = performance.now();
      const searchResult = performanceManager.search('Book 500');
      const searchTime = performance.now() - startTime;

      // Search should complete quickly even with large collections
      expect(searchTime).toBeLessThan(50); // Less than 50ms
      expect(searchResult.books.length).toBeGreaterThan(0);
    });
  });
});
