# LLM Integration Setup Guide

This guide will help you set up real LLM integration for the book reading feature, replacing the mock implementation with actual OpenAI or Anthropic APIs.

## Prerequisites

- OpenAI API key OR Anthropic API key
- Node.js 18+ and npm
- Basic understanding of environment variables

## Step 1: Get API Keys

### OpenAI
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-`)

### Anthropic (Alternative)
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key

## Step 2: Configure Environment Variables

Create a `.env` file in your project root with the following variables:

```bash
# LLM Configuration
ENABLE_LLM_CATEGORIZATION=true

# Choose your provider: 'openai' or 'anthropic'
LLM_PROVIDER=openai

# OpenAI Configuration
OPENAI_API_KEY=sk-your_openai_api_key_here
LLM_MODEL=gpt-4o-mini
LLM_MAX_TOKENS=1000
LLM_TEMPERATURE=0.3

# Anthropic Configuration (if using Anthropic)
# ANTHROPIC_API_KEY=your_anthropic_api_key_here
# LLM_MODEL=claude-3-sonnet-20240229

# Performance Settings
LLM_CACHE_DURATION=86400
LLM_MAX_RETRIES=3
LLM_TIMEOUT=30000
LLM_BATCH_SIZE=10
```

## Step 3: Test the Integration

### Check Configuration
```bash
# Check if LLM is properly configured
npm run enhance-status
```

### Process a Single Book
```bash
# Process a specific book (replace with actual filename)
npm run enhance-book wizard-of-earthsea.json
```

### Process All Books
```bash
# Process all unprocessed books
npm run enhance-all
```

## Step 4: Monitor Usage

The system will log token usage for each processed book:

```
Book "The Pragmatic Programmer" processed successfully. Tokens used: 245 (prompt: 180, completion: 65)
```

## Configuration Options

### Models

#### OpenAI Models
- `gpt-4o-mini` - Fast, cost-effective (recommended)
- `gpt-4o` - More capable, higher cost
- `gpt-4-turbo` - Balanced performance and cost

#### Anthropic Models
- `claude-3-sonnet-20240229` - Balanced performance
- `claude-3-haiku-20240307` - Fast, cost-effective
- `claude-3-opus-20240229` - Most capable, highest cost

### Temperature
- `0.0` - Most consistent, deterministic
- `0.3` - Balanced creativity and consistency (recommended)
- `0.7` - More creative, varied responses

### Max Tokens
- `500` - Shorter responses, lower cost
- `1000` - Balanced length and cost (recommended)
- `2000` - Longer, more detailed responses

## Troubleshooting

### Common Issues

#### "No API key configured"
- Check that your `.env` file exists
- Verify the API key variable name matches exactly
- Ensure the file is in the project root

#### "API error: 401 Unauthorized"
- Invalid or expired API key
- Check your API key is correct
- Verify your account has sufficient credits

#### "Rate limit exceeded"
- Too many requests in a short time
- Increase `LLM_TIMEOUT` value
- Reduce `LLM_BATCH_SIZE`

#### "Model not found"
- Check the model name is correct
- Verify the model is available in your region
- Ensure your account has access to the model

### Fallback Behavior

If the LLM service fails, the system automatically falls back to the mock implementation, ensuring your workflow continues uninterrupted.

## Cost Optimization

### Token Usage
- Average prompt: ~180 tokens
- Average completion: ~65 tokens
- Total per book: ~245 tokens

### Cost Estimates (OpenAI GPT-4o-mini)
- Input: $0.00015 per 1K tokens
- Output: $0.0006 per 1K tokens
- Per book: ~$0.0001

### Cost Estimates (Anthropic Claude 3 Sonnet)
- Input: $0.003 per 1M tokens
- Output: $0.015 per 1M tokens
- Per book: ~$0.000001

## Security Considerations

- Never commit your `.env` file to version control
- Use environment variables in production deployments
- Monitor API usage for unexpected charges
- Consider implementing rate limiting for production use

## Production Deployment

### Vercel
```bash
# Set environment variables in Vercel dashboard
vercel env add OPENAI_API_KEY
vercel env add ENABLE_LLM_CATEGORIZATION
vercel env add LLM_PROVIDER
```

### Netlify
```bash
# Set environment variables in Netlify dashboard
# Site settings > Environment variables
```

### Docker
```dockerfile
# In your Dockerfile or docker-compose.yml
ENV OPENAI_API_KEY=your_key_here
ENV ENABLE_LLM_CATEGORIZATION=true
```

## Advanced Configuration

### Custom System Prompts
```bash
LLM_SYSTEM_PROMPT="You are a specialized book analyst focusing on technical and programming books. Provide detailed technical insights and practical recommendations."
```

### Batch Processing
```bash
# Process books in smaller batches to avoid rate limits
LLM_BATCH_SIZE=5
LLM_TIMEOUT=60000
```

### Caching
```bash
# Cache results for 24 hours (86400 seconds)
LLM_CACHE_DURATION=86400
```

## Support

If you encounter issues:

1. Check the console logs for detailed error messages
2. Verify your API key and configuration
3. Test with a single book first
4. Check your API provider's status page
5. Review the error handling logs in the system

The system is designed to be robust and will fall back to mock data if anything goes wrong, ensuring your book reading feature continues to work.
