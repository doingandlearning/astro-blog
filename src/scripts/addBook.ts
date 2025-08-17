#!/usr/bin/env node

import * as readline from 'readline';
import { promises as fs } from 'fs';
import path from 'path';
import { llmService } from '../services/llmService.js';
import { openLibraryService } from '../services/openLibraryService.js';
import type { BookWithEnhancedData } from '../types/books.js';

class SimpleBookCLI {
  private rl: readline.Interface;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  private question(prompt: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(prompt, resolve);
    });
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 100);
  }

  private async checkFileExists(filename: string): Promise<boolean> {
    try {
      await fs.access(filename);
      return true;
    } catch {
      return false;
    }
  }

  private async generateUniqueFilename(title: string): Promise<string> {
    const booksDir = path.join(process.cwd(), 'src/content/books');
    let slug = this.generateSlug(title);
    let filename = path.join(booksDir, `${slug}.json`);
    let counter = 1;

    while (await this.checkFileExists(filename)) {
      slug = `${this.generateSlug(title)}-${counter}`;
      filename = path.join(booksDir, `${slug}.json`);
      counter++;
    }

    return filename;
  }

  async run(): Promise<void> {
    try {
      console.log('📚 Add New Book\n');

      // Get title and author
      const title = await this.question('📖 Book title: ');
      if (!title.trim()) {
        console.log('❌ Title is required');
        this.rl.close();
        return;
      }

      const author = await this.question('✍️  Author: ');
      if (!author.trim()) {
        console.log('❌ Author is required');
        this.rl.close();
        return;
      }

      console.log('\n🔍 Fetching metadata from OpenLibrary...');

      // Try to get data from OpenLibrary
      let pages = 0;
      let coverUrl = '';
      
      try {
        const result = await openLibraryService.searchBooks(title, author);
        if (result.success && result.searchResults && result.searchResults.length > 0) {
          const book = result.searchResults[0];
          pages = book.number_of_pages_median || 0;
          coverUrl = openLibraryService.getCoverUrlFromBook(book) || '';
          console.log(`✅ Found: ${pages} pages, ${coverUrl ? 'cover image' : 'no cover'}`);
        } else {
          console.log('⚠️  No data found in OpenLibrary');
        }
      } catch (error) {
        console.log(`⚠️  OpenLibrary error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // Set defaults
      const now = new Date();
      const bookData: BookWithEnhancedData = {
        title: title.trim(),
        author: author.trim(),
        dateFinished: now,
        genre: 'General',
        pages: pages,
        coverUrl: coverUrl || 'https://via.placeholder.com/300x400?text=No+Cover',
        readingYear: now.getFullYear(),
        readingMonth: now.getMonth() + 1,
        isCurrentlyReading: false,
      };

      console.log('\n🤖 Enhancing with LLM...');

      // Try LLM enhancement
      try {
        const llmStatus = llmService.getStatus();
        if (llmStatus.enabled) {
          const llmResponse = await llmService.processBook(bookData);
          if (llmResponse.success && llmResponse.data) {
            Object.assign(bookData, llmResponse.data, {
              llmProcessed: true,
              llmProcessedAt: new Date().toISOString(),
            });
            console.log('✅ LLM enhancement completed');
          } else {
            console.log(`⚠️  LLM enhancement failed: ${llmResponse.error}`);
          }
        } else {
          console.log('⚠️  LLM service not configured');
        }
      } catch (error) {
        console.log(`⚠️  LLM error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // Save file
      const filename = await this.generateUniqueFilename(title);
      await fs.writeFile(filename, JSON.stringify(bookData, null, 2));

      console.log(`\n🎉 Book added successfully!`);
      console.log(`📁 Saved to: ${path.basename(filename)}`);
      console.log(`📚 Title: ${bookData.title}`);
      console.log(`✍️  Author: ${bookData.author}`);
      
      this.rl.close();

    } catch (error) {
      console.error('❌ Error:', error instanceof Error ? error.message : 'Unknown error');
      this.rl.close();
      process.exit(1);
    }
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const cli = new SimpleBookCLI();
  cli.run();
}

export { SimpleBookCLI };