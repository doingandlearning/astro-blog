import { describe, it, expect, vi, beforeEach } from 'vitest';
import { enhanceBookCategorization, processSpecificBook, getProcessingStatus } from './enhanceCategorization';
import { readFile, writeFile, readdir } from 'fs/promises';
import { join } from 'path';

// Mock fs/promises
vi.mock('fs/promises', () => ({
  readFile: vi.fn(),
  writeFile: vi.fn(),
  readdir: vi.fn(),
}));

// Mock the LLM config
vi.mock('../config/llm', () => ({
  getLLMConfig: vi.fn(() => ({
    apiKey: 'test-api-key',
    provider: 'openai',
    model: 'gpt-4o-mini',
    maxTokens: 1000,
    cacheDuration: 86400,
    maxRetries: 3,
    timeout: 30000,
    batchSize: 10,
  })),
  isLLMEnabled: vi.fn(() => true),
}));

describe('enhanceCategorization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProcessingStatus', () => {
    it('should return correct processing status', async () => {
      const mockBookFiles = ['book1.json', 'book2.json', 'book3.json'];
      const mockBookData1 = JSON.stringify({
        title: 'Book 1',
        llmProcessed: true,
        enhancedGenre: 'Fiction'
      });
      const mockBookData2 = JSON.stringify({
        title: 'Book 2',
        llmProcessed: false
      });
      const mockBookData3 = JSON.stringify({
        title: 'Book 3',
        llmProcessed: true,
        enhancedGenre: 'Non-Fiction'
      });

      (readdir as any).mockResolvedValue(mockBookFiles);
      (readFile as any)
        .mockResolvedValueOnce(mockBookData1)
        .mockResolvedValueOnce(mockBookData2)
        .mockResolvedValueOnce(mockBookData3);

      const status = await getProcessingStatus();

      expect(status.total).toBe(3);
      expect(status.processed).toBe(2);
      expect(status.unprocessed).toBe(1);
      expect(status.unprocessedBooks).toEqual(['Book 2']);
    });

    it('should handle errors gracefully', async () => {
      (readdir as any).mockResolvedValue(['book1.json']);
      (readFile as any).mockRejectedValue(new Error('File read error'));

      const status = await getProcessingStatus();

      expect(status.total).toBe(0);
      expect(status.processed).toBe(0);
      expect(status.unprocessed).toBe(0);
      expect(status.unprocessedBooks).toEqual([]);
    });
  });

  describe('processSpecificBook', () => {
    it('should process an unprocessed book', async () => {
      const mockBookData = JSON.stringify({
        title: 'Test Book',
        author: 'Test Author',
        genre: 'Fiction',
        pages: 300,
        dateFinished: '2024-01-01',
        readingYear: 2024,
        readingMonth: 1,
        isCurrentlyReading: false
      });

      (readFile as any).mockResolvedValue(mockBookData);
      (writeFile as any).mockResolvedValue(undefined);

      const result = await processSpecificBook('test-book.json');

      expect(result.success).toBe(true);
      expect(result.processedBooks).toBe(1);
      expect(result.skippedBooks).toBe(0);
      expect(writeFile).toHaveBeenCalled();
    });

    it('should skip already processed books', async () => {
      const mockBookData = JSON.stringify({
        title: 'Test Book',
        llmProcessed: true,
        enhancedGenre: 'Fiction'
      });

      (readFile as any).mockResolvedValue(mockBookData);

      const result = await processSpecificBook('test-book.json');

      expect(result.success).toBe(true);
      expect(result.processedBooks).toBe(0);
      expect(result.skippedBooks).toBe(1);
      expect(writeFile).not.toHaveBeenCalled();
    });
  });

  describe('enhanceBookCategorization', () => {
    it('should process all unprocessed books', async () => {
      const mockBookFiles = ['book1.json', 'book2.json'];
      const mockBookData1 = JSON.stringify({
        title: 'Book 1',
        author: 'Author 1',
        genre: 'Fiction',
        pages: 300,
        dateFinished: '2024-01-01',
        readingYear: 2024,
        readingMonth: 1,
        isCurrentlyReading: false
      });
      const mockBookData2 = JSON.stringify({
        title: 'Book 2',
        author: 'Author 2',
        genre: 'Non-Fiction',
        pages: 250,
        dateFinished: '2024-01-02',
        readingYear: 2024,
        readingMonth: 1,
        isCurrentlyReading: false
      });

      (readdir as any).mockResolvedValue(mockBookFiles);
      (readFile as any)
        .mockResolvedValueOnce(mockBookData1)
        .mockResolvedValueOnce(mockBookData2);
      (writeFile as any).mockResolvedValue(undefined);

      const result = await enhanceBookCategorization();

      expect(result.success).toBe(true);
      expect(result.processedBooks).toBe(2);
      expect(result.skippedBooks).toBe(0);
      expect(result.errors).toHaveLength(0);
      expect(writeFile).toHaveBeenCalledTimes(2);
    });

    it('should skip already processed books', async () => {
      const mockBookFiles = ['book1.json'];
      const mockBookData = JSON.stringify({
        title: 'Book 1',
        llmProcessed: true,
        enhancedGenre: 'Fiction'
      });

      (readdir as any).mockResolvedValue(mockBookFiles);
      (readFile as any).mockResolvedValue(mockBookData);

      const result = await enhanceBookCategorization();

      expect(result.success).toBe(true);
      expect(result.processedBooks).toBe(0);
      expect(result.skippedBooks).toBe(1);
      expect(writeFile).not.toHaveBeenCalled();
    });
  });
});
