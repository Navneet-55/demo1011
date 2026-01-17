/**
 * Error Handling and Logging Utilities
 * Centralized error handling with proper typing and context
 */

import { DEBUG_CONFIG } from '@/lib/constants'

/**
 * Custom error class for application-specific errors
 */
export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly context?: Record<string, any>,
    public readonly statusCode?: number
  ) {
    super(message)
    this.name = 'AppError'
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      context: this.context,
      statusCode: this.statusCode,
    }
  }
}

/**
 * Logger levels
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

/**
 * Structured logger
 */
export class Logger {
  constructor(private readonly namespace: string) {}

  private log(level: LogLevel, message: string, data?: any): void {
    if (!DEBUG_CONFIG.ENABLED && level === LogLevel.DEBUG) {
      return
    }

    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [${this.namespace}] [${level.toUpperCase()}]`

    const logFn = {
      [LogLevel.DEBUG]: console.debug,
      [LogLevel.INFO]: console.info,
      [LogLevel.WARN]: console.warn,
      [LogLevel.ERROR]: console.error,
    }[level]

    if (data) {
      logFn(`${prefix} ${message}`, data)
    } else {
      logFn(`${prefix} ${message}`)
    }
  }

  debug(message: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, data)
  }

  info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data)
  }

  warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, message, data)
  }

  error(message: string, data?: any): void {
    this.log(LogLevel.ERROR, message, data)
  }

  /**
   * Log error with stack trace and context
   */
  logError(error: Error | unknown, context?: Record<string, any>): void {
    const errorData = {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      context,
    }
    this.error('Exception occurred', errorData)
  }
}

/**
 * Safe async wrapper - never throws, always returns result or null
 */
export async function trySafe<T>(
  fn: () => Promise<T>,
  onError?: (error: Error) => void
): Promise<T | null> {
  try {
    return await fn()
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    if (onError) {
      try {
        onError(err)
      } catch {
        // Ignore errors in error handler
      }
    }
    return null
  }
}

/**
 * Safe sync wrapper - never throws
 */
export function trySafeSync<T>(
  fn: () => T,
  defaultValue: T,
  onError?: (error: Error) => void
): T {
  try {
    return fn()
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    if (onError) {
      try {
        onError(err)
      } catch {
        // Ignore errors in error handler
      }
    }
    return defaultValue
  }
}

/**
 * Error boundary helper for React
 */
export function createErrorBoundary(
  fallback: (error: Error) => React.ReactNode,
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
) {
  return class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; error: Error | null }
  > {
    constructor(props: { children: React.ReactNode }) {
      super(props)
      this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error) {
      return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      if (onError) {
        onError(error, errorInfo)
      }
      console.error('ErrorBoundary caught:', error, errorInfo)
    }

    render() {
      if (this.state.hasError && this.state.error) {
        return fallback(this.state.error)
      }
      return this.props.children
    }
  }
}

/**
 * Retry logic with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number
    initialDelay?: number
    maxDelay?: number
    backoffMultiplier?: number
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2,
  } = options

  let lastError: Error | undefined

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (attempt < maxRetries) {
        const delay = Math.min(
          initialDelay * Math.pow(backoffMultiplier, attempt),
          maxDelay
        )
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError || new Error('Retry failed')
}

/**
 * Timeout wrapper for promises
 */
export function withTimeout<T>(
  promise: Promise<T>,
  ms: number = 5000,
  timeoutError: Error = new Error(`Operation timed out after ${ms}ms`)
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(timeoutError), ms)
    ),
  ])
}

/**
 * Format error for user display
 */
export function formatErrorForUser(error: Error | unknown): string {
  if (error instanceof AppError) {
    return error.message
  }

  if (error instanceof Error) {
    // Sanitize technical error messages
    if (error.message.includes('Network')) {
      return 'Network connection error. Please check your internet connection.'
    }
    if (error.message.includes('timeout')) {
      return 'Request timed out. Please try again.'
    }
    return error.message || 'An unexpected error occurred'
  }

  return 'An unexpected error occurred'
}

/**
 * Create logger for a module
 */
export function createLogger(namespace: string): Logger {
  return new Logger(namespace)
}

// Re-export React for error boundary helper
import React from 'react'
