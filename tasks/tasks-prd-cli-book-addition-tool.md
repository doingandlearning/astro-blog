# Task List: CLI Book Addition Tool

## Relevant Files

- `src/scripts/addBook.ts` - Main CLI script for adding books to the database.
- `src/scripts/addBook.test.ts` - Unit tests for the addBook CLI script.
- `src/services/openLibraryService.ts` - Service for integrating with OpenLibrary API to fetch book metadata.
- `src/services/openLibraryService.test.ts` - Unit tests for the OpenLibrary service.
- `src/utils/bookUtils.ts` - Utility functions for book data validation, slugification, and file operations.
- `src/utils/bookUtils.test.ts` - Unit tests for book utility functions.
- `src/types/books.ts` - Existing book type definitions (already exists).
- `src/services/llmService.ts` - Existing LLM service for book enrichment (already exists).
- `package.json` - Scripts configuration for the CLI tool.

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Tasks

- [x] 1.0 Create Core CLI Infrastructure
  - [x] 1.1 Set up CLI script structure in `src/scripts/addBook.ts`
- [x] 1.2 Create command-line argument parsing for basic book data
- [x] 1.3 Add npm script entry in `package.json` for `add-book` command
- [x] 1.4 Implement basic CLI help and usage information
- [x] 1.5 Set up error handling and exit codes for CLI operations

- [x] 2.0 Implement OpenLibrary API Integration
  - [x] 2.1 Create `src/services/openLibraryService.ts` service class
- [x] 2.2 Implement book search functionality by title and author
- [x] 2.3 Add page count and cover URL extraction from OpenLibrary responses
- [x] 2.4 Implement error handling for API failures and rate limiting
- [x] 2.5 Add user confirmation prompts for auto-fetched data
- [x] 2.6 Create fallback handling when OpenLibrary data is unavailable

- [x] 3.0 Build Interactive Book Data Input System
  - [x] 3.1 Implement interactive prompts for required book fields (title, author, genre)
  - [x] 3.2 Add date input handling with current date as default
  - [x] 3.3 Create validation for user input data
  - [x] 3.4 Implement manual override options for auto-fetched data
  - [x] 3.5 Add confirmation prompts before proceeding with book creation
  - [x] 3.6 Handle optional fields with sensible defaults

- [x] 4.0 Integrate LLM Metadata Enrichment
  - [x] 4.1 Connect existing `llmService.ts` to the CLI tool
  - [x] 4.2 Implement LLM processing after book data collection
  - [x] 4.3 Add user confirmation for LLM-enhanced metadata
  - [x] 4.4 Handle LLM service failures gracefully
  - [x] 4.5 Mark books as LLM-processed with timestamps
  - [x] 4.6 Integrate enhanced metadata into final book object

- [x] 5.0 Implement File Generation and Validation System
  - [x] 5.1 Create `src/utils/bookUtils.ts` with slugification and validation functions
  - [x] 5.2 Implement filename generation based on book title
  - [x] 5.3 Add duplicate book detection and conflict resolution
  - [x] 5.4 Create JSON file generation with proper formatting
  - [x] 5.5 Implement comprehensive data validation before saving
  - [x] 5.6 Add success feedback and file path confirmation
  - [x] 5.7 Create backup strategy for existing files (if needed)
