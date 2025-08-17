import { readFile, writeFile, readdir } from 'fs/promises';
import { join } from 'path';
import { enhanceBookCategorization } from './enhanceCategorization';

interface CleanupResult {
  success: boolean;
  message: string;
  cleanedBooks: number;
  errors: string[];
}

/**
 * Clean up test data by removing generic placeholder content
 */
async function cleanupTestData(): Promise<CleanupResult> {
  const result: CleanupResult = {
    success: true,
    message: 'Test data cleanup completed successfully',
    cleanedBooks: 0,
    errors: []
  };

  try {
    const booksDir = join(process.cwd(), 'src', 'content', 'books');
    const bookFiles = await readdir(booksDir);
    
    for (const filename of bookFiles) {
      if (!filename.endsWith('.json')) continue;
      
      try {
        const filePath = join(booksDir, filename);
        const bookData = await readFile(filePath, 'utf-8');
        const book = JSON.parse(bookData);
        
        // Check if book has generic test data
        const hasGenericData = checkForGenericData(book);
        
        if (hasGenericData) {
          console.log(`Cleaning up generic data in: ${book.title}`);
          
          // Remove the generic fields to force regeneration
          const cleanedBook = { ...book };
          delete cleanedBook.llmProcessed;
          delete cleanedBook.llmProcessedAt;
          delete cleanedBook.enhancedGenre;
          delete cleanedBook.bookCategory;
          delete cleanedBook.readingLevel;
          delete cleanedBook.themes;
          delete cleanedBook.targetAudience;
          delete cleanedBook.complexity;
          delete cleanedBook.readingTime;
          delete cleanedBook.relatedBooks;
          delete cleanedBook.keyInsights;
          delete cleanedBook.tags;
          
          // Also remove any numeric keys that indicate corrupted data
          Object.keys(cleanedBook).forEach(key => {
            if (!isNaN(Number(key))) {
              delete cleanedBook[key];
            }
          });
          
          // Write the cleaned book back
          await writeFile(filePath, JSON.stringify(cleanedBook, null, 2));
          result.cleanedBooks++;
        }
      } catch (error) {
        const errorMsg = `Error cleaning up ${filename}: ${error}`;
        console.error(errorMsg);
        result.errors.push(errorMsg);
        result.success = false;
      }
    }
    
    result.message = `Cleaned up ${result.cleanedBooks} books with generic test data`;
    
  } catch (error) {
    result.success = false;
    result.message = 'Failed to cleanup test data';
    result.errors.push(`General error: ${error}`);
  }
  
  return result;
}

/**
 * Check if a book contains generic test data
 */
function checkForGenericData(book: any): boolean {
  // Check for generic themes
  if (book.themes && Array.isArray(book.themes)) {
    const genericThemes = [
      'Learning',
      'Personal Development', 
      'Knowledge'
    ];
    if (book.themes.some((theme: string) => genericThemes.includes(theme))) {
      return true;
    }
  }
  
  // Check for generic key insights
  if (book.keyInsights && Array.isArray(book.keyInsights)) {
    const genericInsights = [
      'Important concepts covered in this book',
      'Key takeaways for readers',
      'Practical applications of the content'
    ];
    if (book.keyInsights.some((insight: string) => genericInsights.includes(insight))) {
      return true;
    }
  }
  
  // Check for corrupted JSON structure (numeric keys)
  const hasNumericKeys = Object.keys(book).some(key => !isNaN(Number(key)));
  if (hasNumericKeys) {
    return true;
  }
  
  // Check for generic related books
  if (book.relatedBooks && Array.isArray(book.relatedBooks)) {
    const genericBooks = [
      'Similar books in this genre',
      'Related topics',
      'Further reading'
    ];
    if (book.relatedBooks.some((bookTitle: string) => genericBooks.includes(bookTitle))) {
      return true;
    }
  }
  
  // Check for duplicate tags
  if (book.tags && Array.isArray(book.tags)) {
    const uniqueTags = new Set(book.tags);
    if (uniqueTags.size !== book.tags.length) {
      return true;
    }
  }
  
  return false;
}

/**
 * Full cleanup and regeneration process
 */
export async function fullCleanupAndRegeneration(): Promise<{
  cleanup: CleanupResult;
  regeneration: any;
}> {
  console.log('🧹 Starting test data cleanup...');
  const cleanupResult = await cleanupTestData();
  
  if (cleanupResult.success && cleanupResult.cleanedBooks > 0) {
    console.log('🔄 Regenerating enhanced categorization...');
    const regenerationResult = await enhanceBookCategorization();
    
    return {
      cleanup: cleanupResult,
      regeneration: regenerationResult
    };
  }
  
  return {
    cleanup: cleanupResult,
    regeneration: { success: true, message: 'No regeneration needed' }
  };
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];
  
  switch (command) {
    case 'cleanup':
      cleanupTestData().then(result => {
        console.log(result.message);
        if (result.errors.length > 0) {
          console.log('\nErrors:');
          result.errors.forEach(error => console.log(`- ${error}`));
        }
      });
      break;
      
    case 'full':
      fullCleanupAndRegeneration().then(({ cleanup, regeneration }) => {
        console.log('\n🧹 Cleanup Results:');
        console.log(cleanup.message);
        
        console.log('\n🔄 Regeneration Results:');
        console.log(regeneration.message);
        
        if (cleanup.errors.length > 0) {
          console.log('\nCleanup Errors:');
          cleanup.errors.forEach(error => console.log(`- ${error}`));
        }
        
        if (regeneration.errors && regeneration.errors.length > 0) {
          console.log('\nRegeneration Errors:');
          regeneration.errors.forEach((error: string) => console.log(`- ${error}`));
        }
      });
      break;
      
    default:
      console.log('Usage:');
      console.log('  npm run cleanup-data     - Clean up generic test data');
      console.log('  npm run cleanup-full     - Full cleanup and regeneration');
      break;
  }
}
