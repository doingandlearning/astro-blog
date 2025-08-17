# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Astro-based personal blog website (kevincunningham.co.uk) with a sophisticated book reading tracking system, content management, and LLM-powered book categorization features. The site includes blog posts, courses, bookmarks, webmentions, and a comprehensive book collection with enhanced metadata.

## Common Commands

### Development & Build
- `npm run dev` - Start local development server at localhost:4321
- `npm run build` - Build production site (runs astro check then astro build)
- `npm run preview` - Preview production build locally
- `npm run astro` - Run Astro CLI commands

### Testing
- `npm run test` - Run Vitest tests in watch mode
- `npm run test:ui` - Run Vitest with UI interface
- `npm run test:run` - Run tests once and exit
- `npm run test:coverage` - Run tests with coverage report

### Book Management Scripts
- `npm run add-book` - Interactive CLI tool to add new books (tsx src/scripts/addBook.ts)
- `npm run convert-csv` - Convert existing CSV data to new format
- `npm run enhance-status` - Check LLM enhancement status for books
- `npm run enhance-all` - Process all books with LLM enhancement
- `npm run enhance-book` - Process a specific book with LLM enhancement
- `npm run cleanup-data` - Clean up test data from books collection
- `npm run cleanup-full` - Full cleanup of book data

## Architecture Overview

### Content Collections
The project uses Astro's content collections system with TypeScript schemas:
- **posts**: Blog posts (MDX/Markdown) with frontmatter including title, date, tags, images
- **books**: JSON-based book collection with enhanced LLM metadata
- **bookmarks**: JSON arrays of curated bookmarks with tags
- **webmentions**: Social interaction data
- **livecourses**: Course information with order and duration
- **prerecorded**: Pre-recorded course content

### Book System Architecture
The book system is the most complex feature with multiple layers:

1. **Data Layer** (`src/types/books.ts`):
   - Base `Book` interface with core fields (title, author, genre, etc.)
   - `BookWithEnhancedData` extends with LLM-processed metadata
   - `LLMResponse` interface for AI-generated categorization

2. **Service Layer**:
   - `src/services/llmService.ts`: Multi-provider LLM integration (OpenAI, Anthropic, local models)
   - `src/services/openLibraryService.ts`: External API integration for book metadata

3. **CLI Tools** (`src/scripts/`):
   - `addBook.ts`: Comprehensive CLI for adding books with OpenLibrary integration and LLM enhancement
   - `enhanceCategorization.ts`: Batch processing for LLM metadata enhancement
   - Processing utilities in `processBooks.ts` and `books/index.ts`

4. **Frontend Components** (`src/components/`):
   - `BookCard.astro`: Individual book display
   - `BookGrid.astro`: Grid layout for book collection
   - `BookFilters.astro`: Interactive filtering interface
   - `EnhancedBookStats.astro`: Statistics dashboard

### LLM Integration
The system supports multiple LLM providers through a unified interface:
- Configuration via environment variables (OPENAI_API_KEY, ANTHROPIC_API_KEY)
- Structured prompts for book categorization and metadata enhancement
- JSON response parsing with validation and fallbacks
- Usage tracking and error handling

### Content Management
- MDX support for rich blog posts with embedded components
- Astro content collections for type-safe content management
- Custom components for interactive elements (code editors, embeds, etc.)
- RSS feed generation and sitemap integration

## Key Patterns

### File Organization
- Content in `src/content/` organized by collection type
- Components in `src/components/` with co-located CSS files
- Scripts in `src/scripts/` for CLI tools and data processing
- Types in `src/types/` for shared TypeScript interfaces
- Services in `src/services/` for external integrations

### Testing Strategy
- Vitest with jsdom environment for component testing
- Integration tests for book processing workflows
- Setup file at `src/test/setup.ts` for test configuration
- Test files follow `*.{test,spec}.{js,ts}` pattern

### Data Flow
1. Books added via CLI tool (`addBook.ts`)
2. OpenLibrary API integration for metadata fetching
3. LLM processing for enhanced categorization
4. JSON files stored in `src/content/books/`
5. Astro builds static pages from content collections
6. Frontend components provide interactive filtering and display

## Environment Configuration

### Required for LLM Features
- `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` for book enhancement
- LLM configuration in `src/config/llm.ts`

### Deployment
- Configured for Vercel deployment
- Static site generation with Astro
- Redirects configured in astro.config.mjs

## Development Notes

- Uses Astro 5 with Preact integration for interactive components
- TypeScript throughout with strict typing
- Custom Vitest configuration with @ alias pointing to src/
- ExpressiveCode for syntax highlighting with Catppuccin theme
- Content-driven architecture with file-based routing

## Important Implementation Details

- Book data stored as individual JSON files, not in a database
- LLM enhancement is optional and gracefully degrades if unavailable
- OpenLibrary integration includes data quality scoring and fallback handling
- CLI tools include comprehensive error handling and user interaction
- All book processing includes validation and data consistency checks