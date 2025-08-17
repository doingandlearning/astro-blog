import { describe, it, expect } from 'vitest';
import type { Book, BookWithEnhancedData, BookFilters, BookStats } from './books';

describe('Book Types', () => {
  it('should have correct Book interface structure', () => {
    const book: Book = {
      title: 'Test Book',
      author: 'Test Author',
      dateFinished: new Date('2024-01-01'),
      genre: 'Fiction',
      pages: 300,
      coverUrl: 'https://example.com/cover.jpg'
    };

    expect(book.title).toBe('Test Book');
    expect(book.author).toBe('Test Author');
    expect(book.genre).toBe('Fiction');
    expect(book.pages).toBe(300);
    expect(book.coverUrl).toBe('https://example.com/cover.jpg');
    expect(book.dateFinished).toBeInstanceOf(Date);
  });

  it('should have correct BookWithEnhancedData interface structure', () => {
    const enhancedBook: BookWithEnhancedData = {
      title: 'Test Book',
      author: 'Test Author',
      dateFinished: new Date('2024-01-01'),
      genre: 'Fiction',
      pages: 300,
      coverUrl: 'https://example.com/cover.jpg',
      enhancedGenre: 'Literary Fiction',
      readingYear: 2024,
      readingMonth: 1
    };

    expect(enhancedBook.enhancedGenre).toBe('Literary Fiction');
    expect(enhancedBook.readingYear).toBe(2024);
    expect(enhancedBook.readingMonth).toBe(1);
  });

  it('should have correct BookFilters interface structure', () => {
    const filters: BookFilters = {
      genres: ['Fiction', 'Non-Fiction'],
      authors: ['Test Author'],
      years: [2024, 2023],
      searchQuery: 'test'
    };

    expect(filters.genres).toEqual(['Fiction', 'Non-Fiction']);
    expect(filters.authors).toEqual(['Test Author']);
    expect(filters.years).toEqual([2024, 2023]);
    expect(filters.searchQuery).toBe('test');
  });

  it('should have correct BookStats interface structure', () => {
    const stats: BookStats = {
      totalBooks: 10,
      totalPages: 3000,
      averagePagesPerBook: 300,
      booksThisYear: 5,
      genreDistribution: { 'Fiction': 6, 'Non-Fiction': 4 },
      readingTimeline: { 2024: 5, 2023: 5 }
    };

    expect(stats.totalBooks).toBe(10);
    expect(stats.totalPages).toBe(3000);
    expect(stats.averagePagesPerBook).toBe(300);
    expect(stats.booksThisYear).toBe(5);
    expect(stats.genreDistribution).toEqual({ 'Fiction': 6, 'Non-Fiction': 4 });
    expect(stats.readingTimeline).toEqual({ 2024: 5, 2023: 5 });
  });
});
