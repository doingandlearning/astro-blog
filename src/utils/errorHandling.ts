export interface ErrorLog {
  timestamp: string;
  level: 'error' | 'warn' | 'info';
  message: string;
  context?: string;
  stack?: string;
  userAgent?: string;
  url?: string;
}

export interface PerformanceLog {
  timestamp: string;
  operation: string;
  duration: number;
  bookCount?: number;
  cacheHit?: boolean;
}

class ErrorMonitor {
  private errors: ErrorLog[] = [];
  private performanceLogs: PerformanceLog[] = [];
  private maxLogs = 100;

  /**
   * Log an error with context
   */
  logError(message: string, context?: string, error?: Error): void {
    const errorLog: ErrorLog = {
      timestamp: new Date().toISOString(),
      level: 'error',
      message,
      context,
      stack: error?.stack,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined
    };

    this.errors.push(errorLog);
    this.trimLogs();

    // In development, log to console
    if (import.meta.env.DEV) {
      console.error(`[BookReader Error] ${message}`, { context, error });
    }

    // In production, could send to external service
    if (import.meta.env.PROD) {
      this.sendToMonitoringService(errorLog);
    }
  }

  /**
   * Log a warning
   */
  logWarning(message: string, context?: string): void {
    const warningLog: ErrorLog = {
      timestamp: new Date().toISOString(),
      level: 'warn',
      message,
      context,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined
    };

    this.errors.push(warningLog);
    this.trimLogs();

    if (import.meta.env.DEV) {
      console.warn(`[BookReader Warning] ${message}`, { context });
    }
  }

  /**
   * Log performance metrics
   */
  logPerformance(operation: string, duration: number, bookCount?: number, cacheHit?: boolean): void {
    const performanceLog: PerformanceLog = {
      timestamp: new Date().toISOString(),
      operation,
      duration,
      bookCount,
      cacheHit
    };

    this.performanceLogs.push(performanceLog);
    this.trimLogs();

    if (import.meta.env.DEV) {
      console.log(`[BookReader Performance] ${operation}: ${duration.toFixed(2)}ms`, { bookCount, cacheHit });
    }
  }

  /**
   * Get error summary for monitoring
   */
  getErrorSummary(): { total: number; errors: number; warnings: number; recent: ErrorLog[] } {
    const recent = this.errors.slice(-10);
    const errors = this.errors.filter(log => log.level === 'error').length;
    const warnings = this.errors.filter(log => log.level === 'warn').length;

    return {
      total: this.errors.length,
      errors,
      warnings,
      recent
    };
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary(): { total: number; averageDuration: number; operations: Record<string, number> } {
    if (this.performanceLogs.length === 0) {
      return { total: 0, averageDuration: 0, operations: {} };
    }

    const total = this.performanceLogs.length;
    const averageDuration = this.performanceLogs.reduce((sum, log) => sum + log.duration, 0) / total;
    
    const operations: Record<string, number> = {};
    this.performanceLogs.forEach(log => {
      operations[log.operation] = (operations[log.operation] || 0) + 1;
    });

    return { total, averageDuration, operations };
  }

  /**
   * Clear old logs to prevent memory issues
   */
  private trimLogs(): void {
    if (this.errors.length > this.maxLogs) {
      this.errors = this.errors.slice(-this.maxLogs);
    }
    if (this.performanceLogs.length > this.maxLogs) {
      this.performanceLogs = this.performanceLogs.slice(-this.maxLogs);
    }
  }

  /**
   * Send error to external monitoring service (placeholder)
   */
  private sendToMonitoringService(_errorLog: ErrorLog): void {
    // In a real implementation, this would send to Sentry, LogRocket, etc.
    // For now, we'll just store it locally
    try {
      // Could implement actual sending logic here
      // fetch('/api/errors', { method: 'POST', body: JSON.stringify(errorLog) });
    } catch (e) {
      // Fallback to console if monitoring fails
      console.error('Failed to send error to monitoring service:', e);
    }
  }

  /**
   * Clear all logs (useful for testing)
   */
  clearLogs(): void {
    this.errors = [];
    this.performanceLogs = [];
  }
}

// Export singleton instance
export const errorMonitor = new ErrorMonitor();

/**
 * Utility function to wrap async operations with error handling
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context: string,
  fallback?: T
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    errorMonitor.logError(`Operation failed: ${message}`, context, error instanceof Error ? error : undefined);
    
    if (fallback !== undefined) {
      return fallback;
    }
    
    throw error;
  }
}

/**
 * Utility function to wrap operations with performance monitoring
 */
export function withPerformanceMonitoring<T>(
  operation: () => T,
  operationName: string,
  bookCount?: number
): T {
  const startTime = performance.now();
  
  try {
    const result = operation();
    const duration = performance.now() - startTime;
    errorMonitor.logPerformance(operationName, duration, bookCount);
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    errorMonitor.logPerformance(operationName, duration, bookCount);
    throw error;
  }
}

/**
 * Utility function to wrap async operations with performance monitoring
 */
export async function withAsyncPerformanceMonitoring<T>(
  operation: () => Promise<T>,
  operationName: string,
  bookCount?: number
): Promise<T> {
  const startTime = performance.now();
  
  try {
    const result = await operation();
    const duration = performance.now() - startTime;
    errorMonitor.logPerformance(operationName, duration, bookCount);
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    errorMonitor.logPerformance(operationName, duration, bookCount);
    throw error;
  }
}
