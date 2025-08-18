#!/usr/bin/env tsx

import { promises as fs } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

interface Book {
	title: string;
	author: string;
	coverUrl?: string;
	dateFinished: string;
	genre: string;
	pages: number;
	readingYear: number;
	readingMonth: number;
	isCurrentlyReading?: boolean;
	enhancedGenre?: string;
	bookCategory?: string;
	readingLevel?: string;
	themes?: string[];
	targetAudience?: string;
	complexity?: string;
	readingTime?: string;
	relatedBooks?: string[];
	keyInsights?: string[];
	tags?: string[];
	llmProcessed?: boolean;
	llmProcessedAt?: string;
	localCoverPath?: string;
}

async function downloadImage(url: string, outputPath: string): Promise<void> {
	try {
		console.log(`Downloading: ${url}`);
		
		const response = await fetch(url, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
			}
		});
		
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		
		const buffer = await response.arrayBuffer();
		await fs.writeFile(outputPath, new Uint8Array(buffer));
		
		console.log(`✅ Downloaded: ${outputPath}`);
	} catch (error) {
		console.error(`❌ Failed to download ${url}:`, error);
		throw error;
	}
}

function sanitizeFilename(filename: string): string {
	// Remove or replace characters that aren't safe for filenames
	return filename
		.replace(/[<>:"/\\|?*]/g, '')
		.replace(/\s+/g, '-')
		.replace(/[^\w\-_.]/g, '')
		.toLowerCase();
}

async function processBooks() {
	const booksDir = join(__dirname, '..', 'content', 'books');
	const publicDir = join(__dirname, '..', '..', 'public');
	const coversDir = join(publicDir, 'book-covers');
	
	// Create covers directory if it doesn't exist
	try {
		await fs.mkdir(coversDir, { recursive: true });
	} catch (error) {
		// Directory might already exist
	}
	
	try {
		const files = await fs.readdir(booksDir);
		const jsonFiles = files.filter(file => file.endsWith('.json'));
		
		console.log(`Found ${jsonFiles.length} book files to process`);
		
		for (const file of jsonFiles) {
			const filePath = join(booksDir, file);
			const bookData: Book = JSON.parse(await fs.readFile(filePath, 'utf-8'));
			
			// Skip if already has local cover or no remote cover
			if (bookData.localCoverPath || !bookData.coverUrl) {
				console.log(`⏭️  Skipping ${bookData.title}: ${bookData.localCoverPath ? 'already has local cover' : 'no cover URL'}`);
				continue;
			}
			
			// Generate local filename
			const sanitizedTitle = sanitizeFilename(bookData.title);
			const sanitizedAuthor = sanitizeFilename(bookData.author);
			const filename = `${sanitizedTitle}-${sanitizedAuthor}.jpg`;
			const localPath = join(coversDir, filename);
			const relativePath = `/book-covers/${filename}`;
			
			try {
				// Download the image
				await downloadImage(bookData.coverUrl, localPath);
				
				// Update book data with local path
				bookData.localCoverPath = relativePath;
				
				// Write updated book data back to file
				await fs.writeFile(filePath, JSON.stringify(bookData, null, 2));
				
				console.log(`✅ Updated ${bookData.title} with local cover path: ${relativePath}`);
			} catch (error) {
				console.error(`❌ Failed to process ${bookData.title}:`, error);
				// Continue with next book instead of stopping
				continue;
			}
			
			// Add a small delay between downloads to be respectful
			await new Promise(resolve => setTimeout(resolve, 500));
		}
		
		console.log('\n🎉 Cover image download complete!');
		
	} catch (error) {
		console.error('Error processing books:', error);
		process.exit(1);
	}
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
	processBooks();
}

export { processBooks };