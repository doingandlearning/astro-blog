#!/usr/bin/env node

import { llmService } from '../services/llmService.js';
import type { BookWithEnhancedData } from '../types/books.js';

/**
 * CLI Book Addition Tool
 * 
 * This tool allows users to add new books to the book database via command line.
 * It integrates with OpenLibrary API for metadata and LLM services for enrichment.
 */

interface CLIBookData {
  title: string;
  author: string;
  dateFinished: Date;
  genre: string;
  pages?: number;
  coverUrl?: string;
  isCurrentlyReading?: boolean;
}

interface CLIOptions {
  title?: string;
  author?: string;
  genre?: string;
  date?: string;
  pages?: number;
  coverUrl?: string;
  help?: boolean;
  interactive?: boolean;
}

class BookAdditionCLI {
  private bookData: Partial<CLIBookData> = {};
  private options: CLIOptions = {};

  constructor() {
    this.setupErrorHandling();
  }

  /**
   * Set up global error handling for the CLI
   */
  private setupErrorHandling(): void {
    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error.message);
      if (error.stack) {
        console.error('Stack trace:', error.stack);
      }
      process.exit(1);
    });

    process.on('unhandledRejection', (reason) => {
      console.error('❌ Unhandled Rejection:', reason);
      process.exit(1);
    });

    process.on('SIGINT', () => {
      console.log('\n\n⚠️  Operation cancelled by user');
      process.exit(130); // Standard exit code for Ctrl+C
    });

    process.on('SIGTERM', () => {
      console.log('\n⚠️  Process terminated');
      process.exit(143); // Standard exit code for SIGTERM
    });
  }

  /**
   * Main entry point for the CLI
   */
  async run(): Promise<void> {
    try {
      this.parseArguments();
      
      if (this.options.help) {
        this.showHelp();
        return;
      }

      // Validate arguments before proceeding
      this.validateArguments();

      console.log('📚 CLI Book Addition Tool');
      console.log('========================\n');
      
      // Display parsed arguments for debugging
      this.displayParsedArguments();
      
      // TODO: Implement interactive prompts and data collection
      // TODO: Implement OpenLibrary integration
      // TODO: Implement LLM enrichment
      // TODO: Implement file generation
      
      console.log('🚧 CLI tool structure created - implementation pending');
      
    } catch (error) {
      console.error('❌ Error running CLI tool:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  }

  /**
   * Parse command line arguments
   */
  private parseArguments(): void {
    const args = process.argv.slice(2);
    
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      
      switch (arg) {
        case '--help':
        case '-h':
          this.options.help = true;
          break;
          
        case '--title':
        case '-t':
          if (i + 1 < args.length) {
            this.options.title = args[i + 1];
            i++; // Skip the next argument since we consumed it
          }
          break;
          
        case '--author':
        case '-a':
          if (i + 1 < args.length) {
            this.options.author = args[i + 1];
            i++; // Skip the next argument since we consumed it
          }
          break;
          
        case '--genre':
        case '-g':
          if (i + 1 < args.length) {
            this.options.genre = args[i + 1];
            i++; // Skip the next argument since we consumed it
          }
          break;
          
        case '--date':
        case '-d':
          if (i + 1 < args.length) {
            this.options.date = args[i + 1];
            i++; // Skip the next argument since we consumed it
          }
          break;
          
        case '--pages':
        case '-p':
          if (i + 1 < args.length) {
            const pages = parseInt(args[i + 1]);
            if (!isNaN(pages)) {
              this.options.pages = pages;
            }
            i++; // Skip the next argument since we consumed it
          }
          break;
          
        case '--cover-url':
        case '-c':
          if (i + 1 < args.length) {
            this.options.coverUrl = args[i + 1];
            i++; // Skip the next argument since we consumed it
          }
          break;
          
        case '--interactive':
        case '-i':
          this.options.interactive = true;
          break;
          
        default:
          if (arg.startsWith('-')) {
            console.warn(`⚠️  Unknown option: ${arg}`);
          }
          break;
      }
    }
  }

  /**
   * Display parsed arguments for debugging purposes
   */
  private displayParsedArguments(): void {
    if (Object.keys(this.options).length === 0) {
      console.log('📝 No command line arguments provided');
      return;
    }
    
    console.log('📝 Parsed command line arguments:');
    Object.entries(this.options).forEach(([key, value]) => {
      if (value !== undefined) {
        console.log(`   ${key}: ${value}`);
      }
    });
    console.log('');
  }

  /**
   * Handle errors with appropriate exit codes
   */
  private handleError(message: string, exitCode: number = 1, showHelp: boolean = false): never {
    console.error(`❌ Error: ${message}`);
    
    if (showHelp) {
      console.log('\n');
      this.showHelp();
    }
    
    process.exit(exitCode);
  }

  /**
   * Validate command line arguments
   */
  private validateArguments(): void {
    // Check for missing required arguments when not in interactive mode
    if (!this.options.interactive) {
      const missingArgs: string[] = [];
      
      if (!this.options.title) missingArgs.push('title');
      if (!this.options.author) missingArgs.push('author');
      if (!this.options.genre) missingArgs.push('genre');
      
      if (missingArgs.length > 0) {
        this.handleError(
          `Missing required arguments: ${missingArgs.join(', ')}. Use --interactive mode or provide all required arguments.`,
          2,
          true
        );
      }
    }

    // Validate date format if provided
    if (this.options.date) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(this.options.date)) {
        this.handleError(
          'Invalid date format. Please use YYYY-MM-DD format.',
          3
        );
      }
      
      const parsedDate = new Date(this.options.date);
      if (isNaN(parsedDate.getTime())) {
        this.handleError(
          'Invalid date. Please provide a valid date in YYYY-MM-DD format.',
          3
        );
      }
    }

    // Validate pages if provided
    if (this.options.pages !== undefined && (this.options.pages <= 0 || !Number.isInteger(this.options.pages))) {
      this.handleError(
        'Pages must be a positive integer.',
        4
      );
    }

    // Validate cover URL if provided
    if (this.options.coverUrl) {
      try {
        new URL(this.options.coverUrl);
      } catch {
        this.handleError(
          'Invalid cover URL format. Please provide a valid URL.',
          5
        );
      }
    }
  }

  /**
   * Display help information
   */
  private showHelp(): void {
    console.log(`
Usage: npm run add-book [options]

Options:
  -h, --help              Show this help message
  -t, --title <title>     Book title
  -a, --author <author>   Book author
  -g, --genre <genre>     Book genre
  -d, --date <date>       Date finished (YYYY-MM-DD format)
  -p, --pages <pages>     Number of pages
  -c, --cover-url <url>   Cover image URL
  -i, --interactive       Force interactive mode

Examples:
  npm run add-book --title "The Great Gatsby" --author "F. Scott Fitzgerald"
  npm run add-book --interactive
  npm run add-book --help

This CLI tool helps you add new books to your book database.

Features:
- Interactive data input
- Automatic metadata fetching from OpenLibrary
- LLM-powered book categorization
- Automatic file generation

The tool will guide you through the process step by step.
    `);
  }
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  const cli = new BookAdditionCLI();
  cli.run().catch((error) => {
    console.error('❌ CLI execution failed:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}

export { BookAdditionCLI };
