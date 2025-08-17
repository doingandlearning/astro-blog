// Test setup file for Vitest
import { vi } from 'vitest';

// Mock environment variables for testing
process.env.NODE_ENV = 'test';

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment to suppress console.log during tests
  // log: vi.fn(),
  // warn: vi.fn(),
  // error: vi.fn(),
};

// Setup global test utilities
(global as any).testUtils = {
  // Add any global test utilities here
};
