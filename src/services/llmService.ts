import { getLLMConfig, type LLMConfig } from '../config/llm';
import type { BookWithEnhancedData, LLMResponse } from '../types/books';

export interface LLMRequest {
  book: BookWithEnhancedData;
  prompt: string;
  systemPrompt?: string;
}

export interface LLMServiceResponse {
  success: boolean;
  data?: LLMResponse;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * Real LLM service for book categorization
 */
export class LLMService {
  private config: LLMConfig;

  constructor() {
    this.config = getLLMConfig();
  }

  /**
   * Process a book with real LLM API
   */
  async processBook(book: BookWithEnhancedData): Promise<LLMServiceResponse> {
    if (!this.config.apiKey) {
      return {
        success: false,
        error: 'No API key configured. Please set OPENAI_API_KEY or ANTHROPIC_API_KEY environment variable.'
      };
    }

    try {
      switch (this.config.provider) {
        case 'openai':
          return await this.processWithOpenAI(book);
        case 'anthropic':
          return await this.processWithAnthropic(book);
        case 'local':
          return await this.processWithLocalModel(book);
        default:
          return {
            success: false,
            error: `Unsupported LLM provider: ${this.config.provider}`
          };
      }
    } catch (error) {
      return {
        success: false,
        error: `LLM processing failed: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * Process book with OpenAI API
   */
  private async processWithOpenAI(book: BookWithEnhancedData): Promise<LLMServiceResponse> {
    const prompt = this.createBookCategorizationPrompt(book);
    
    const requestBody = {
      model: this.config.model,
      messages: [
        {
          role: 'system',
          content: this.config.systemPrompt || 'You are an expert book analyst.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: this.config.maxTokens,
      temperature: this.config.temperature || 0.3,
      response_format: { type: 'json_object' }
    };

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No content received from OpenAI API');
      }

      const llmResponse = this.parseLLMResponse(content);
      
      return {
        success: true,
        data: llmResponse,
        usage: {
          promptTokens: data.usage?.prompt_tokens || 0,
          completionTokens: data.usage?.completion_tokens || 0,
          totalTokens: data.usage?.total_tokens || 0
        }
      };
    } catch (error) {
      throw new Error(`OpenAI API request failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Process book with Anthropic API
   */
  private async processWithAnthropic(book: BookWithEnhancedData): Promise<LLMServiceResponse> {
    const prompt = this.createBookCategorizationPrompt(book);
    
    const requestBody = {
      model: this.config.model,
      max_tokens: this.config.maxTokens,
      temperature: this.config.temperature || 0.3,
      system: this.config.systemPrompt || 'You are an expert book analyst.',
      messages: [
        {
          role: 'user',
          content: `${prompt}\n\nPlease respond with valid JSON only.`
        }
      ]
    };

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': this.config.apiKey!,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Anthropic API error: ${response.status} ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const content = data.content[0]?.text;
      
      if (!content) {
        throw new Error('No content received from Anthropic API');
      }

      const llmResponse = this.parseLLMResponse(content);
      
      return {
        success: true,
        data: llmResponse,
        usage: {
          promptTokens: data.usage?.input_tokens || 0,
          completionTokens: data.usage?.output_tokens || 0,
          totalTokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0)
        }
      };
    } catch (error) {
      throw new Error(`Anthropic API request failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Process book with local model (placeholder for future implementation)
   */
  private async processWithLocalModel(book: BookWithEnhancedData): Promise<LLMServiceResponse> {
    // This could integrate with local models like Ollama, LM Studio, etc.
    return {
      success: false,
      error: 'Local model integration not yet implemented. Please use OpenAI or Anthropic.'
    };
  }

  /**
   * Create the prompt for book categorization
   */
  private createBookCategorizationPrompt(book: BookWithEnhancedData): string {
    return `Analyze this book and provide enhanced categorization in the following JSON format:

Book Information:
- Title: "${book.title}"
- Author: "${book.author}"
- Genre: "${book.genre}"
- Pages: ${book.pages}
- Date Finished: ${book.dateFinished.toISOString().split('T')[0]}

Please analyze the book and return a JSON object with exactly this structure:

{
  "enhancedGenre": "string - refined genre classification",
  "bookCategory": "string - broader category (Fiction, Non-Fiction, Technical, Academic, etc.)",
  "readingLevel": "string - Beginner, Intermediate, or Advanced",
  "themes": ["array", "of", "main", "themes", "or", "topics"],
  "targetAudience": "string - who this book is intended for",
  "complexity": "string - Simple, Moderate, or Complex",
  "readingTime": "string - estimated reading time (e.g., '5 hours')",
  "relatedBooks": ["array", "of", "related", "book", "titles"],
  "keyInsights": ["array", "of", "key", "takeaways", "or", "insights"],
  "tags": ["array", "of", "relevant", "tags", "for", "categorization"]
}

Be specific and accurate. Base your analysis on the book's title, author, genre, and page count. If you're unsure about specific details, make reasonable inferences based on the available information.`;
  }

  /**
   * Parse the LLM response into structured data
   */
  private parseLLMResponse(content: string): LLMResponse {
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate and sanitize the response
      return {
        enhancedGenre: parsed.enhancedGenre || 'General',
        bookCategory: parsed.bookCategory || 'General',
        readingLevel: parsed.readingLevel || 'Intermediate',
        themes: Array.isArray(parsed.themes) ? parsed.themes.slice(0, 5) : ['General'],
        targetAudience: parsed.targetAudience || 'General',
        complexity: parsed.complexity || 'Moderate',
        readingTime: parsed.readingTime || 'Unknown',
        relatedBooks: Array.isArray(parsed.relatedBooks) ? parsed.relatedBooks.slice(0, 5) : [],
        keyInsights: Array.isArray(parsed.keyInsights) ? parsed.keyInsights.slice(0, 5) : [],
        tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 10) : []
      };
    } catch (error) {
      throw new Error(`Failed to parse LLM response: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get service status and configuration
   */
  getStatus(): { enabled: boolean; provider: string; model: string; hasApiKey: boolean } {
    return {
      enabled: this.config.apiKey !== undefined,
      provider: this.config.provider,
      model: this.config.model,
      hasApiKey: this.config.apiKey !== undefined
    };
  }
}

// Export singleton instance
export const llmService = new LLMService();
