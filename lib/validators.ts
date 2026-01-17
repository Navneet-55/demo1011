/**
 * Type Guards and Validators
 * Reusable validation functions with proper TypeScript typing
 */

import { LEARNING_CONSTANTS, STUCK_DETECTION, QUIZ_CONFIG } from '@/lib/constants'
import type { LearningSessionState, StuckSignal, MasteryRecord } from '@/types/learning-features'
import type { Timebox, Perspective, Mode } from '@/types/api-contract'

/**
 * Validate if a value is a valid timebox value
 */
export function isValidTimebox(value: unknown): value is Timebox {
  return typeof value === 'string' && LEARNING_CONSTANTS.TIMEBOX_VALUES.includes(value as any)
}

/**
 * Validate if a value is a valid perspective value
 */
export function isValidPerspective(value: unknown): value is Perspective {
  return typeof value === 'string' && LEARNING_CONSTANTS.PERSPECTIVES.includes(value as any)
}

/**
 * Validate if a value is a valid learning mode
 */
export function isValidMode(value: unknown): value is Mode {
  return typeof value === 'string' && LEARNING_CONSTANTS.MODES.includes(value as any)
}

/**
 * Validate if a value is a valid score (0-100)
 */
export function isValidScore(value: unknown): value is number {
  return typeof value === 'number' && value >= 0 && value <= 100
}

/**
 * Validate if a value is a valid stuck signal severity
 */
export function isValidSeverity(value: unknown): value is 'low' | 'medium' | 'high' {
  return typeof value === 'string' && ['low', 'medium', 'high'].includes(value)
}

/**
 * Validate if value is an array of stuck signals
 */
export function isValidSignalsArray(value: unknown): value is StuckSignal[] {
  return Array.isArray(value) && value.every(signal => 
    signal && 
    typeof signal === 'object' &&
    'type' in signal &&
    'severity' in signal &&
    isValidSeverity(signal.severity)
  )
}

/**
 * Validate if value is an array of strings
 */
export function isValidStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === 'string')
}

/**
 * Validate if value is an array of cognitive load modes
 */
export function isValidCognitiveLoadArray(value: unknown): value is Array<'overwhelmed' | 'balanced' | 'speed' | 'mastery'> {
  return Array.isArray(value) && value.every(item =>
    typeof item === 'string' && LEARNING_CONSTANTS.COGNITIVE_LOADS.includes(item as any)
  )
}

/**
 * Validate complete learning session state
 */
export function isValidLearningSessionState(value: unknown): value is LearningSessionState {
  if (!value || typeof value !== 'object') return false
  
  const state = value as any
  return (
    isValidTimebox(state.timebox) &&
    isValidPerspective(state.perspective) &&
    typeof state.futureYou === 'boolean' &&
    typeof state.currentResponseId === 'string' &&
    state.responseCount >= 0 &&
    typeof state.responseCount === 'number' &&
    Array.isArray(state.masteryHistory) &&
    Array.isArray(state.practiceProgress) &&
    typeof state.lastQuizResult === 'object' &&
    typeof state.stuckState === 'object'
  )
}

/**
 * Safe score clamping (0-100)
 */
export function clampScore(value: number): number {
  return Math.max(QUIZ_CONFIG.MIN_SCORE, Math.min(QUIZ_CONFIG.MAX_SCORE, value))
}

/**
 * Safe integer conversion
 */
export function toSafeInteger(value: unknown, defaultValue: number = 0): number {
  try {
    const num = typeof value === 'string' ? parseInt(value, 10) : Number(value)
    return Number.isInteger(num) ? num : defaultValue
  } catch {
    return defaultValue
  }
}

/**
 * Safe boolean conversion
 */
export function toSafeBoolean(value: unknown, defaultValue: boolean = false): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') return value.toLowerCase() === 'true'
  return defaultValue
}

/**
 * Safely get array element with fallback
 */
export function safeArrayAccess<T>(array: unknown, index: number, defaultValue: T): T {
  try {
    if (Array.isArray(array) && index >= 0 && index < array.length) {
      return array[index] ?? defaultValue
    }
  } catch {
    // Ignore errors
  }
  return defaultValue
}

/**
 * Safely access object property with type guard
 */
export function safeObjectAccess<T, K extends PropertyKey>(
  obj: unknown,
  key: K,
  defaultValue: T,
  typeGuard?: (val: unknown) => val is T
): T {
  try {
    if (obj && typeof obj === 'object' && key in obj) {
      const val = (obj as Record<K, any>)[key]
      return typeGuard ? (typeGuard(val) ? val : defaultValue) : val ?? defaultValue
    }
  } catch {
    // Ignore errors
  }
  return defaultValue
}

/**
 * Validate and sanitize string input
 */
export function sanitizeString(value: unknown, maxLength: number = 1000): string {
  try {
    if (typeof value !== 'string') return ''
    return value.trim().slice(0, maxLength)
  } catch {
    return ''
  }
}

/**
 * Validate and sanitize URL input
 */
export function sanitizeUrl(value: unknown): string {
  try {
    if (typeof value !== 'string') return ''
    const url = new URL(value)
    return url.toString()
  } catch {
    return ''
  }
}

/**
 * Create a type-safe error wrapper
 */
export class ValidationError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly context?: Record<string, any>
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}

/**
 * Try-catch wrapper for type-safe error handling
 */
export function tryAsync<T>(
  fn: () => Promise<T>,
  onError?: (error: Error) => T
): Promise<T | null> {
  return fn().catch(error => {
    if (onError) {
      try {
        return onError(error)
      } catch {
        return null
      }
    }
    return null
  })
}

/**
 * Memoization decorator for pure functions
 */
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map()
  
  return ((...args: any[]) => {
    const key = JSON.stringify(args)
    if (cache.has(key)) {
      return cache.get(key)
    }
    const result = fn(...args)
    cache.set(key, result)
    return result
  }) as T
}
