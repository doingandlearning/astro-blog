import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LLMService } from './llmService';
import type { BookWithEnhancedData } from '../types/books';

vi.mock('../config/llm', () => ({
  getLLMConfig: vi.fn()
}));

describe('LLMService', () => {
  let llmService: LLMService;
  const mockBook: BookWithEnhancedData = {
    title: 'Test Book',
    author: 'Test Author',
    genre: 'Fiction',
    pages: 300,
    dateFinished: new Date('2024-01-01'),
    coverUrl: '/test-cover.jpg',
    readingYear: 2024,
    readingMonth: 1,
    isbn: '1234567890',
    description: 'A test book',
    slug: 'test-book',
    rating: 5,
    imageSrc: '/test-image.jpg',
    enhancedData: null
  };

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  describe('processBook', () => {
    it('should return error when no API key is configured', async () => {
      const { getLLMConfig } = await import('../config/llm');
      vi.mocked(getLLMConfig).mockReturnValue({
        provider: 'openai',
        model: 'gpt-4o-mini',
        maxTokens: 1000,
        cacheDuration: 86400,
        maxRetries: 3,
        timeout: 30000,
        batchSize: 10,
        temperature: 0.3,
        systemPrompt: 'Test prompt'
      });

      llmService = new LLMService();
      const result = await llmService.processBook(mockBook);

      expect(result.success).toBe(false);
      expect(result.error).toContain('No API key configured');
    });

    it('should return error for unsupported provider', async () => {
      const { getLLMConfig } = await import('../config/llm');
      vi.mocked(getLLMConfig).mockReturnValue({
        provider: 'unsupported' as any,
        apiKey: 'test-key',
        model: 'test-model',
        maxTokens: 1000,
        cacheDuration: 86400,
        maxRetries: 3,
        timeout: 30000,
        batchSize: 10,
        temperature: 0.3,
        systemPrompt: 'Test prompt'
      });

      llmService = new LLMService();
      const result = await llmService.processBook(mockBook);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Unsupported LLM provider');
    });

    it('should handle OpenAI API errors gracefully', async () => {
      const { getLLMConfig } = await import('../config/llm');
      vi.mocked(getLLMConfig).mockReturnValue({
        provider: 'openai',
        apiKey: 'test-key',
        model: 'gpt-4o-mini',
        maxTokens: 1000,
        cacheDuration: 86400,
        maxRetries: 3,
        timeout: 30000,
        batchSize: 10,
        temperature: 0.3,
        systemPrompt: 'Test prompt'
      });

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: () => Promise.resolve({ error: { message: 'Invalid API key' } })
      });

      llmService = new LLMService();
      const result = await llmService.processBook(mockBook);

      expect(result.success).toBe(false);
      expect(result.error).toContain('OpenAI API error: 401 Unauthorized');
    });

    it('should successfully process book with OpenAI', async () => {
      const { getLLMConfig } = await import('../config/llm');
      vi.mocked(getLLMConfig).mockReturnValue({
        provider: 'openai',
        apiKey: 'test-key',
        model: 'gpt-4o-mini',
        maxTokens: 1000,
        cacheDuration: 86400,
        maxRetries: 3,
        timeout: 30000,
        batchSize: 10,
        temperature: 0.3,
        systemPrompt: 'Test prompt'
      });

      const mockResponse = {
        enhancedGenre: 'Literary Fiction',
        bookCategory: 'Fiction',
        readingLevel: 'Intermediate',
        themes: ['love', 'loss'],
        targetAudience: 'General readers',
        complexity: 'Moderate',
        readingTime: '6 hours',
        relatedBooks: ['Similar Book'],
        keyInsights: ['Key insight'],
        tags: ['fiction', 'drama']
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: JSON.stringify(mockResponse) } }],
          usage: { prompt_tokens: 100, completion_tokens: 200, total_tokens: 300 }
        })
      });

      llmService = new LLMService();
      const result = await llmService.processBook(mockBook);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResponse);
      expect(result.usage?.totalTokens).toBe(300);
    });

    it('should handle Anthropic API successfully', async () => {
      const { getLLMConfig } = await import('../config/llm');
      vi.mocked(getLLMConfig).mockReturnValue({
        provider: 'anthropic',
        apiKey: 'test-key',
        model: 'claude-3-sonnet-20240229',
        maxTokens: 1000,
        cacheDuration: 86400,
        maxRetries: 3,
        timeout: 30000,
        batchSize: 10,
        temperature: 0.3,
        systemPrompt: 'Test prompt'
      });

      const mockResponse = {
        enhancedGenre: 'Literary Fiction',
        bookCategory: 'Fiction',
        readingLevel: 'Intermediate',
        themes: ['love', 'loss'],
        targetAudience: 'General readers',
        complexity: 'Moderate',
        readingTime: '6 hours',
        relatedBooks: ['Similar Book'],
        keyInsights: ['Key insight'],
        tags: ['fiction', 'drama']
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          content: [{ text: JSON.stringify(mockResponse) }],
          usage: { input_tokens: 100, output_tokens: 200 }
        })
      });

      llmService = new LLMService();
      const result = await llmService.processBook(mockBook);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResponse);
      expect(result.usage?.totalTokens).toBe(300);
    });

    it('should handle malformed JSON responses', async () => {
      const { getLLMConfig } = await import('../config/llm');
      vi.mocked(getLLMConfig).mockReturnValue({
        provider: 'openai',
        apiKey: 'test-key',
        model: 'gpt-4o-mini',
        maxTokens: 1000,
        cacheDuration: 86400,
        maxRetries: 3,
        timeout: 30000,
        batchSize: 10,
        temperature: 0.3,
        systemPrompt: 'Test prompt'
      });

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: 'This is not valid JSON' } }],
          usage: { prompt_tokens: 100, completion_tokens: 200, total_tokens: 300 }
        })
      });

      llmService = new LLMService();
      const result = await llmService.processBook(mockBook);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Failed to parse LLM response');
    });

    it('should return not implemented error for local model', async () => {
      const { getLLMConfig } = await import('../config/llm');
      vi.mocked(getLLMConfig).mockReturnValue({
        provider: 'local',
        apiKey: 'test-key',
        model: 'local-model',
        maxTokens: 1000,
        cacheDuration: 86400,
        maxRetries: 3,
        timeout: 30000,
        batchSize: 10,
        temperature: 0.3,
        systemPrompt: 'Test prompt'
      });

      llmService = new LLMService();
      const result = await llmService.processBook(mockBook);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Local model integration not yet implemented');
    });
  });

  describe('getStatus', () => {
    it('should return correct status information', async () => {
      const { getLLMConfig } = await import('../config/llm');
      vi.mocked(getLLMConfig).mockReturnValue({
        provider: 'openai',
        apiKey: 'test-key',
        model: 'gpt-4o-mini',
        maxTokens: 1000,
        cacheDuration: 86400,
        maxRetries: 3,
        timeout: 30000,
        batchSize: 10,
        temperature: 0.3,
        systemPrompt: 'Test prompt'
      });

      llmService = new LLMService();
      const status = llmService.getStatus();

      expect(status.enabled).toBe(true);
      expect(status.provider).toBe('openai');
      expect(status.model).toBe('gpt-4o-mini');
      expect(status.hasApiKey).toBe(true);
    });

    it('should show disabled when no API key', async () => {
      const { getLLMConfig } = await import('../config/llm');
      vi.mocked(getLLMConfig).mockReturnValue({
        provider: 'openai',
        model: 'gpt-4o-mini',
        maxTokens: 1000,
        cacheDuration: 86400,
        maxRetries: 3,
        timeout: 30000,
        batchSize: 10,
        temperature: 0.3,
        systemPrompt: 'Test prompt'
      });

      llmService = new LLMService();
      const status = llmService.getStatus();

      expect(status.enabled).toBe(false);
      expect(status.hasApiKey).toBe(false);
    });
  });
});