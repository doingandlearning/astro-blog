export interface LLMConfig {
  provider: 'openai' | 'anthropic' | 'local';
  apiKey?: string;
  model: string;
  maxTokens: number;
  cacheDuration: number;
  maxRetries: number;
  timeout: number;
  batchSize: number;
}

export const defaultLLMConfig: LLMConfig = {
  provider: 'openai',
  model: 'gpt-4o-mini',
  maxTokens: 1000,
  cacheDuration: 86400, // 24 hours in seconds
  maxRetries: 3,
  timeout: 30000, // 30 seconds in milliseconds
  batchSize: 10,
};

export function getLLMConfig(): LLMConfig {
  // In production, these would come from environment variables
  // For now, return defaults - this will be enhanced in Task 5
  return {
    ...defaultLLMConfig,
    apiKey: process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY,
    provider: process.env.LLM_PROVIDER as 'openai' | 'anthropic' | 'local' || 'openai',
    model: process.env.LLM_MODEL || defaultLLMConfig.model,
    maxTokens: parseInt(process.env.LLM_MAX_TOKENS || '1000'),
    cacheDuration: parseInt(process.env.LLM_CACHE_DURATION || '86400'),
    maxRetries: parseInt(process.env.LLM_MAX_RETRIES || '3'),
    timeout: parseInt(process.env.LLM_TIMEOUT || '30000'),
    batchSize: parseInt(process.env.LLM_BATCH_SIZE || '10'),
  };
}

export function isLLMEnabled(): boolean {
  return process.env.ENABLE_LLM_CATEGORIZATION === 'true';
}
