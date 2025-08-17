# Product Requirements Document: CLI Book Addition Tool

## Introduction/Overview

This feature will create a command-line interface (CLI) tool that allows blog owners to quickly and efficiently add new books to their book database. The tool will solve the problem of manual database entry being time-consuming and error-prone, while also providing a standardized format for book data entry. The CLI tool will integrate with the existing book content collection system and use the established book schema.

## Goals

1. **Streamline Book Addition**: Reduce the time required to add a new book from manual file creation to a single CLI command
2. **Standardize Data Entry**: Ensure all books follow the same data structure and validation rules
3. **Improve Data Quality**: Validate book information before saving to prevent errors
4. **Enhance Developer Experience**: Provide an intuitive CLI interface for content management

## User Stories

**Primary User Story**: As a blog owner, I want to quickly add a new book via CLI so that I can update my reading list without opening the database or manually creating JSON files.

**Secondary User Stories**:
- As a blog owner, I want the CLI to validate my book data so that I don't accidentally save incomplete or incorrect information
- As a blog owner, I want the CLI to generate appropriate file names and IDs automatically so that I don't have to worry about naming conventions
- As a blog owner, I want the CLI to provide interactive prompts when I don't have all the information so that I can complete the book entry process

## Functional Requirements

1. **Command Line Interface**: The system must provide a CLI command (e.g., `npm run add-book` or `node scripts/addBook.js`) that can be executed from the project root directory.

2. **OpenLibrary Integration**: The system must automatically fetch book metadata from OpenLibrary API when possible:
   - Search for books by title and author
   - Retrieve page count information
   - Fetch cover image URLs
   - Handle cases where OpenLibrary data is unavailable or incomplete
   - Provide user confirmation before using fetched data
   - Allow manual override of any auto-fetched data

3. **LLM Metadata Enrichment**: The system must integrate with existing LLM services to enhance book metadata:
   - Use the existing `llmService.ts` to process book information
   - Generate enhanced genre categorization
   - Identify book categories and reading levels
   - Extract themes and target audience information
   - Generate complexity assessments and reading time estimates
   - Suggest related books and key insights
   - Add relevant tags for better categorization
   - Mark books as LLM-processed with timestamps

4. **Book Data Input**: The system must accept book metadata through interactive prompts for the following required fields:
   - Title (string, required)
   - Author (string, required)
   - Date Finished (Date, required, with validation for proper date format) - default to the current date
   - Genre (string, required)
   - Pages (number, auto-fetched from OpenLibrary when possible, with manual override option)
   - Cover URL (string, auto-fetched from OpenLibrary when possible, with manual override option)

5. **Optional Field Support**: The system must allow users to optionally provide:
   - Reading Year (number, auto-calculated from dateFinished if not provided)
   - Reading Month (number, auto-calculated from dateFinished if not provided)
   - Is Currently Reading (boolean, defaults to false)

6. **Data Validation**: The system must validate all input data before saving:
   - Title and Author must not be empty strings
   - Date Finished must be a valid date format
   - Pages must be a positive integer (when manually provided)
   - Cover URL must be a valid URL format (when manually provided)

7. **File Generation**: The system must automatically generate a new JSON file in the `src/content/books/` directory with:
   - A filename based on the book title (slugified, e.g., "The Great Gatsby" → "the-great-gatsby.json")
   - Proper JSON formatting with all required and optional fields
   - Timestamp for when the book was added

8. **Error Handling**: The system must provide clear error messages for:
   - Invalid data input
   - File system errors
   - Duplicate book detection (if applicable)
   - OpenLibrary API errors or network issues

9. **Success Feedback**: The system must confirm successful book addition with:
   - Success message
   - File path where the book was saved
   - Summary of the book data that was saved
   - Indication of which data was auto-fetched vs. manually entered

## Non-Goals (Out of Scope)

- **Book Editing**: This tool will not edit existing book records
- **Book Deletion**: This tool will not delete books from the database
- **Image Uploads**: This tool will not handle book cover image file uploads (only URLs)
- **User Authentication**: This tool will not manage user permissions or authentication
- **Batch Operations**: This tool will not support importing multiple books at once
- **Database Schema Changes**: This tool will not modify the existing book data structure

## Design Considerations

The CLI tool should follow these design principles:
- **Simple and Intuitive**: Use clear prompts and validation messages
- **Consistent with Project**: Follow the existing project's coding standards and file organization
- **Progressive Enhancement**: Start with basic functionality and allow for future enhancements
- **Error Prevention**: Validate input at each step to prevent invalid data from being saved

## Technical Considerations

- **Integration**: Must integrate with the existing book content collection system in `src/content/books/`
- **File Format**: Must generate JSON files compatible with the existing `BookWithEnhancedData` interface
- **Dependencies**: Should use existing project dependencies and avoid adding new external packages
- **File Naming**: Must generate unique, slugified filenames that don't conflict with existing books
- **Data Types**: Must ensure all data types match the TypeScript interface definitions
- **Error Handling**: Must gracefully handle file system operations and provide meaningful error messages
- **API Integration**: Must handle OpenLibrary API calls with proper error handling and rate limiting
- **Network Resilience**: Must gracefully handle network failures and provide fallback options

## Success Metrics

1. **Efficiency**: Reduce time to add a new book from manual file creation (~2-3 minutes) to CLI operation (~30 seconds)
2. **Data Quality**: Ensure 100% of books added via CLI pass validation and match the required schema
3. **User Satisfaction**: Blog owner can successfully add books without referring to documentation
4. **Error Reduction**: Minimize data entry errors through validation and clear prompts

## Open Questions

1. **File Naming Conflicts**: How should the system handle cases where a book with a similar title already exists?
2. **Validation Strictness**: Should the system allow partial data entry and save incomplete books, or require all fields to be complete?
3. **Backup Strategy**: Should the system create backups of existing book files before making changes?
4. **OpenLibrary Fallback**: What should happen when OpenLibrary doesn't have data for a book? Should we prompt for manual entry or skip those fields?
5. **LLM Integration Scope**: Should the LLM integration be part of the initial CLI tool, or implemented as a separate post-processing step?
6. **Future Enhancements**: What additional features might be valuable in future iterations (e.g., book search, genre suggestions, author autocomplete, Goodreads integration)?

## Implementation Notes

- The CLI tool should be implemented as a Node.js script in the `src/scripts/` directory
- Use existing project dependencies and utilities where possible
- Follow the established project structure and coding conventions
- Include proper error handling and user feedback
- Consider adding the CLI command to `package.json` scripts for easy access
- Integrate with OpenLibrary API using their public endpoints (no API key required)
- Handle rate limiting and network timeouts gracefully
- Provide clear feedback about which data was auto-fetched vs. manually entered
- Consider implementing a simple caching mechanism for OpenLibrary responses to avoid repeated API calls
