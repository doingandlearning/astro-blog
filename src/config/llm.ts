import dotenv from 'dotenv';

dotenv.config();

export interface LLMConfig {
  provider: 'openai' | 'anthropic' | 'local';
  apiKey?: string;
  model: string;
  maxTokens: number;
  cacheDuration: number;
  maxRetries: number;
  timeout: number;
  batchSize: number;
  temperature?: number;
  systemPrompt?: string;
}

export const defaultLLMConfig: LLMConfig = {
  provider: 'openai',
  model: 'gpt-4o-mini',
  maxTokens: 1000,
  cacheDuration: 86400, // 24 hours in seconds
  maxRetries: 3,
  timeout: 30000, // 30 seconds in milliseconds
  batchSize: 10,
  temperature: 0.3,
  systemPrompt: `You are an expert book analyst and librarian. Your task is to analyze books and provide enhanced categorization, insights, and metadata. Be concise, accurate, and consistent in your responses. Always return valid JSON with the exact structure requested.`,
};

export function getLLMConfig(): LLMConfig {
  return {
    ...defaultLLMConfig,
    apiKey: process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY,
    provider: (process.env.LLM_PROVIDER as 'openai' | 'anthropic' | 'local') || 'openai',
    model: process.env.LLM_MODEL || defaultLLMConfig.model,
    maxTokens: parseInt(process.env.LLM_MAX_TOKENS || '1000'),
    cacheDuration: parseInt(process.env.LLM_CACHE_DURATION || '86400'),
    maxRetries: parseInt(process.env.LLM_MAX_RETRIES || '3'),
    timeout: parseInt(process.env.LLM_TIMEOUT || '30000'),
    batchSize: parseInt(process.env.LLM_BATCH_SIZE || '10'),
    temperature: parseFloat(process.env.LLM_TEMPERATURE || '0.3'),
    systemPrompt: process.env.LLM_SYSTEM_PROMPT || defaultLLMConfig.systemPrompt,
  };
}

export function isLLMEnabled(): boolean {
  return process.env.ENABLE_LLM_CATEGORIZATION === 'true';
}
