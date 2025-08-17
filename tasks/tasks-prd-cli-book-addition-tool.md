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

- [ ] 2.0 Implement OpenLibrary API Integration
  - [ ] 2.1 Create `src/services/openLibraryService.ts` service class
  - [ ] 2.2 Implement book search functionality by title and author
  - [ ] 2.3 Add page count and cover URL extraction from OpenLibrary responses
  - [ ] 2.4 Implement error handling for API failures and rate limiting
  - [ ] 2.5 Add user confirmation prompts for auto-fetched data
  - [ ] 2.6 Create fallback handling when OpenLibrary data is unavailable

- [ ] 3.0 Build Interactive Book Data Input System
  - [ ] 3.1 Implement interactive prompts for required book fields (title, author, genre)
  - [ ] 3.2 Add date input handling with current date as default
  - [ ] 3.3 Create validation for user input data
  - [ ] 3.4 Implement manual override options for auto-fetched data
  - [ ] 3.5 Add confirmation prompts before proceeding with book creation
  - [ ] 3.6 Handle optional fields with sensible defaults

- [ ] 4.0 Integrate LLM Metadata Enrichment
  - [ ] 4.1 Connect existing `llmService.ts` to the CLI tool
  - [ ] 4.2 Implement LLM processing after book data collection
  - [ ] 4.3 Add user confirmation for LLM-enhanced metadata
  - [ ] 4.4 Handle LLM service failures gracefully
  - [ ] 4.5 Mark books as LLM-processed with timestamps
  - [ ] 4.6 Integrate enhanced metadata into final book object

- [ ] 5.0 Implement File Generation and Validation System
  - [ ] 5.1 Create `src/utils/bookUtils.ts` with slugification and validation functions
  - [ ] 5.2 Implement filename generation based on book title
  - [ ] 5.3 Add duplicate book detection and conflict resolution
  - [ ] 5.4 Create JSON file generation with proper formatting
  - [ ] 5.5 Implement comprehensive data validation before saving
  - [ ] 5.6 Add success feedback and file path confirmation
  - [ ] 5.7 Create backup strategy for existing files (if needed)
