import { readFile } from 'fs/promises';
import { join } from 'path';
import { convertCsvToCollection } from './convertCsvToCollection';

/**
 * Convert existing CSV file to content collection
 */
async function convertExistingCsv() {
  try {
    console.log('🔄 Converting existing CSV to content collection...');
    
    // Read the existing CSV file
    const csvPath = join(process.cwd(), 'public', 'data', 'books.csv');
    const csvContent = await readFile(csvPath, 'utf-8');
    
    // Convert to content collection
    const result = await convertCsvToCollection(csvContent);
    
    if (result.success) {
      console.log(`✅ ${result.message}`);
      console.log(`📚 Processed ${result.processedBooks} books`);
      
      if (result.errors.length > 0) {
        console.log(`⚠️  ${result.errors.length} errors encountered:`);
        result.errors.forEach(error => console.log(`   - ${error}`));
      }
    } else {
      console.error(`❌ ${result.message}`);
      result.errors.forEach(error => console.error(`   - ${error}`));
    }
  } catch (error) {
    console.error('❌ Failed to convert CSV:', error);
  }
}

// Run the conversion if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  convertExistingCsv();
}

export { convertExistingCsv };
