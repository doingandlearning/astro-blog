---
title: "I Built an AI Powered Google Extension in 15 Minutes"
description: "Build 'Super Summarizer', a Chrome extension that uses ChatGPT to condense web pages into three main points with a readability score. Learn about creating files, setting up permissions, and working with APIs."
date: "2023-08-14"
updateDate: ""
tags: ["chrome-extension", "ai", "chatgpt", "javascript", "api"]
draft: true
youtubeId: "wInHSlsgUjo"
---

# I Built an AI Powered Google Extension in 15 Minutes

> This blog post accompanies the YouTube video: [Watch on YouTube](https://www.youtube.com/watch?v=wInHSlsgUjo)

Ever wanted to quickly understand the key points of a lengthy article or webpage? In this tutorial, we'll build "Super Summarizer" - a Chrome extension that uses ChatGPT to extract the three main points from any webpage and provide a readability score.

## Overview

We'll create a Chrome extension that:
- Extracts text content from web pages
- Sends it to OpenAI's ChatGPT API
- Returns three key points and a readability score
- Works on any webpage with a simple click

## Project Structure

```
super-summarizer/
├── manifest.json
├── popup.html
├── popup.js
├── content.js
└── styles.css
```

## Setting Up the Manifest

The `manifest.json` file defines our extension's configuration:

```json
{
  "manifest_version": 3,
  "name": "Super Summarizer",
  "version": "1.0",
  "description": "AI-powered webpage summarizer using ChatGPT",
  "permissions": [
    "activeTab",
    "storage"
  ],
  "host_permissions": [
    "https://api.openai.com/*"
  ],
  "action": {
    "default_popup": "popup.html",
    "default_title": "Super Summarizer"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"]
    }
  ]
}
```

### Key Permissions Explained

- **activeTab**: Access to the currently active tab
- **storage**: Store API keys and preferences
- **host_permissions**: Make requests to OpenAI API
- **content_scripts**: Inject JavaScript to extract page content

## Creating the Popup Interface

### popup.html

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <h1>🚀 Super Summarizer</h1>
    
    <div id="setup-section">
      <h3>Setup API Key</h3>
      <input type="password" id="api-key" placeholder="Enter OpenAI API Key">
      <button id="save-key">Save</button>
      <p class="info">Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank">OpenAI</a></p>
    </div>
    
    <div id="summarizer-section" style="display: none;">
      <button id="summarize-btn">📝 Summarize This Page</button>
      
      <div id="loading" style="display: none;">
        <p>🤖 AI is analyzing the page...</p>
      </div>
      
      <div id="results" style="display: none;">
        <h3>Summary</h3>
        <div id="summary-content"></div>
        
        <h3>Readability Score</h3>
        <div id="readability-score"></div>
        
        <button id="reset-btn">Analyze Another Page</button>
      </div>
      
      <div id="error" style="display: none;">
        <p class="error-message"></p>
      </div>
    </div>
  </div>
  
  <script src="popup.js"></script>
</body>
</html>
```

### styles.css

```css
body {
  width: 350px;
  padding: 0;
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.container {
  padding: 20px;
}

h1 {
  color: #2563eb;
  text-align: center;
  margin-bottom: 20px;
  font-size: 18px;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  margin-bottom: 10px;
  box-sizing: border-box;
}

button {
  background: #2563eb;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  width: 100%;
  margin-bottom: 10px;
}

button:hover {
  background: #1d4ed8;
}

.info {
  font-size: 12px;
  color: #6b7280;
  text-align: center;
}

.info a {
  color: #2563eb;
}

#results {
  background: #f8fafc;
  padding: 15px;
  border-radius: 6px;
  margin-top: 15px;
}

.summary-point {
  background: white;
  padding: 10px;
  margin: 5px 0;
  border-radius: 4px;
  border-left: 3px solid #2563eb;
}

.readability-score {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  padding: 10px;
  border-radius: 6px;
}

.score-excellent { background: #10b981; color: white; }
.score-good { background: #f59e0b; color: white; }
.score-poor { background: #ef4444; color: white; }

.error-message {
  color: #ef4444;
  background: #fef2f2;
  padding: 10px;
  border-radius: 6px;
}

#loading {
  text-align: center;
  color: #6b7280;
}
```

## Content Script for Page Analysis

### content.js

```javascript
// Content script to extract page text
function extractPageContent() {
  // Remove script and style elements
  const elementsToRemove = document.querySelectorAll('script, style, nav, header, footer, aside');
  elementsToRemove.forEach(el => el.remove());
  
  // Get main content
  const contentSelectors = [
    'main',
    'article', 
    '[role="main"]',
    '.content',
    '.post-content',
    '.article-content'
  ];
  
  let mainContent = null;
  for (const selector of contentSelectors) {
    mainContent = document.querySelector(selector);
    if (mainContent) break;
  }
  
  // Fallback to body if no main content found
  const textSource = mainContent || document.body;
  
  // Extract and clean text
  let text = textSource.innerText || textSource.textContent || '';
  
  // Clean up the text
  text = text
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\n\s*\n/g, '\n') // Remove empty lines
    .trim();
  
  // Limit text length for API efficiency (approximately 3000 words)
  if (text.length > 12000) {
    text = text.substring(0, 12000) + '...';
  }
  
  return {
    text: text,
    title: document.title,
    url: window.location.href
  };
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractContent') {
    const content = extractPageContent();
    sendResponse(content);
  }
});
```

## Popup Logic and API Integration

### popup.js

```javascript
class SuperSummarizer {
  constructor() {
    this.apiKey = null;
    this.initializeUI();
    this.loadApiKey();
  }
  
  async initializeUI() {
    // DOM elements
    this.setupSection = document.getElementById('setup-section');
    this.summarizerSection = document.getElementById('summarizer-section');
    this.apiKeyInput = document.getElementById('api-key');
    this.saveKeyBtn = document.getElementById('save-key');
    this.summarizeBtn = document.getElementById('summarize-btn');
    this.loadingDiv = document.getElementById('loading');
    this.resultsDiv = document.getElementById('results');
    this.errorDiv = document.getElementById('error');
    this.resetBtn = document.getElementById('reset-btn');
    
    // Event listeners
    this.saveKeyBtn.addEventListener('click', () => this.saveApiKey());
    this.summarizeBtn.addEventListener('click', () => this.summarizePage());
    this.resetBtn.addEventListener('click', () => this.resetResults());
    
    // Enter key on API key input
    this.apiKeyInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.saveApiKey();
    });
  }
  
  async loadApiKey() {
    const result = await chrome.storage.sync.get(['openai_api_key']);
    if (result.openai_api_key) {
      this.apiKey = result.openai_api_key;
      this.showSummarizerSection();
    }
  }
  
  async saveApiKey() {
    const apiKey = this.apiKeyInput.value.trim();
    if (!apiKey) {
      this.showError('Please enter a valid API key');
      return;
    }
    
    // Test API key
    if (await this.testApiKey(apiKey)) {
      await chrome.storage.sync.set({ openai_api_key: apiKey });
      this.apiKey = apiKey;
      this.showSummarizerSection();
    } else {
      this.showError('Invalid API key. Please check and try again.');
    }
  }
  
  async testApiKey(apiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
  
  showSummarizerSection() {
    this.setupSection.style.display = 'none';
    this.summarizerSection.style.display = 'block';
  }
  
  async summarizePage() {
    try {
      this.showLoading();
      
      // Get current tab content
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Extract content from the page
      const content = await chrome.tabs.sendMessage(tab.id, { action: 'extractContent' });
      
      if (!content || !content.text) {
        throw new Error('Could not extract content from this page');
      }
      
      // Send to OpenAI API
      const summary = await this.callOpenAI(content);
      
      // Display results
      this.displayResults(summary, content.title);
      
    } catch (error) {
      this.showError(error.message || 'Failed to summarize page');
    } finally {
      this.hideLoading();
    }
  }
  
  async callOpenAI(content) {
    const prompt = `Please analyze the following webpage content and provide:
1. Three key points (bullet points)
2. A readability score from 1-10 (10 being easiest to read)

Content:
${content.text}

Please respond in this JSON format:
{
  "keyPoints": ["point 1", "point 2", "point 3"],
  "readabilityScore": 7,
  "readabilityDescription": "Easy to read"
}`;
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that summarizes web content and provides readability scores.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    try {
      return JSON.parse(aiResponse);
    } catch (error) {
      // Fallback parsing if JSON is malformed
      return this.parseAIResponse(aiResponse);
    }
  }
  
  parseAIResponse(response) {
    // Fallback parsing for non-JSON responses
    const lines = response.split('\n');
    const keyPoints = [];
    let readabilityScore = 5;
    
    lines.forEach(line => {
      if (line.includes('•') || line.includes('-') || line.includes('1.') || line.includes('2.') || line.includes('3.')) {
        keyPoints.push(line.replace(/^[•\-\d\.]\s*/, '').trim());
      }
      if (line.toLowerCase().includes('readability') && /\d+/.test(line)) {
        const match = line.match(/\d+/);
        if (match) readabilityScore = parseInt(match[0]);
      }
    });
    
    return {
      keyPoints: keyPoints.slice(0, 3),
      readabilityScore: readabilityScore,
      readabilityDescription: this.getReadabilityDescription(readabilityScore)
    };
  }
  
  getReadabilityDescription(score) {
    if (score >= 8) return 'Very Easy to Read';
    if (score >= 6) return 'Easy to Read';
    if (score >= 4) return 'Moderate Difficulty';
    return 'Difficult to Read';
  }
  
  displayResults(summary, pageTitle) {
    const summaryContent = document.getElementById('summary-content');
    const readabilityDiv = document.getElementById('readability-score');
    
    // Display key points
    summaryContent.innerHTML = summary.keyPoints
      .map(point => `<div class="summary-point">• ${point}</div>`)
      .join('');
    
    // Display readability score
    const scoreClass = this.getScoreClass(summary.readabilityScore);
    readabilityDiv.innerHTML = `
      <div class="readability-score ${scoreClass}">
        ${summary.readabilityScore}/10 - ${summary.readabilityDescription}
      </div>
    `;
    
    this.resultsDiv.style.display = 'block';
  }
  
  getScoreClass(score) {
    if (score >= 7) return 'score-excellent';
    if (score >= 4) return 'score-good';
    return 'score-poor';
  }
  
  showLoading() {
    this.loadingDiv.style.display = 'block';
    this.resultsDiv.style.display = 'none';
    this.errorDiv.style.display = 'none';
  }
  
  hideLoading() {
    this.loadingDiv.style.display = 'none';
  }
  
  showError(message) {
    this.errorDiv.querySelector('.error-message').textContent = message;
    this.errorDiv.style.display = 'block';
    this.resultsDiv.style.display = 'none';
  }
  
  resetResults() {
    this.resultsDiv.style.display = 'none';
    this.errorDiv.style.display = 'none';
  }
}

// Initialize the extension
document.addEventListener('DOMContentLoaded', () => {
  new SuperSummarizer();
});
```

## Installation and Testing

### Loading the Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select your extension folder
4. The extension should appear in your extensions list

### Getting an OpenAI API Key

1. Visit [OpenAI's API Keys page](https://platform.openai.com/api-keys)
2. Create an account or sign in
3. Generate a new API key
4. Copy and paste it into the extension

### Testing the Extension

1. Navigate to any article or blog post
2. Click the extension icon in the toolbar
3. Enter your API key (first time only)
4. Click "Summarize This Page"
5. Wait for the AI analysis to complete

## Enhancements and Ideas

### Possible Improvements

1. **Save summaries** - Store previous summaries locally
2. **Export functionality** - Export summaries as PDF or text
3. **Multiple AI models** - Support for different AI providers
4. **Custom prompts** - Allow users to customize the analysis prompt
5. **Batch processing** - Summarize multiple tabs at once

### Advanced Features

```javascript
// Add to popup.js for saving summaries
async saveSummary(summary, pageTitle, url) {
  const summaries = await chrome.storage.local.get(['saved_summaries']) || { saved_summaries: [] };
  
  summaries.saved_summaries.unshift({
    id: Date.now(),
    title: pageTitle,
    url: url,
    summary: summary,
    timestamp: new Date().toISOString()
  });
  
  // Keep only last 50 summaries
  summaries.saved_summaries = summaries.saved_summaries.slice(0, 50);
  
  await chrome.storage.local.set(summaries);
}
```

## Security Considerations

1. **API Key Storage** - Store securely using Chrome's storage API
2. **Content Security Policy** - Properly configure CSP in manifest
3. **Permissions** - Request only necessary permissions
4. **Error Handling** - Don't expose sensitive information in errors
5. **Rate Limiting** - Implement client-side rate limiting for API calls

## Additional Resources

- [Watch the video on YouTube](https://www.youtube.com/watch?v=wInHSlsgUjo)
- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [Chrome Extension Samples](https://github.com/GoogleChrome/chrome-extensions-samples)

## Next Steps

- Publish to Chrome Web Store
- Add support for other browsers (Firefox, Edge)
- Implement offline caching
- Add user preferences and customization
- Create a options page for advanced settings

---

*This post is part of my YouTube tutorial series. Subscribe to [my channel](https://www.youtube.com/channel/UCtzNXx0YjJFvAuAPL9ZjQOw) for more tutorials!*