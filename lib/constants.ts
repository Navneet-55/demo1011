/**
 * Application Constants
 * Centralized constants for the entire application
 * Benefits: Single source of truth, easier maintenance, type safety
 */

// Learning Session Preferences
export const LEARNING_CONSTANTS = {
  TIMEBOX_VALUES: ['30s', '2m', 'deep'] as const,
  PERSPECTIVES: ['story', 'diagram', 'code', 'analogy', 'math'] as const,
  MODES: ['Beginner', 'Student', 'Pro'] as const,
  COGNITIVE_LOADS: ['overwhelmed', 'balanced', 'speed', 'mastery'] as const,
} as const

// Stuck Detection Thresholds
export const STUCK_DETECTION = {
  STUCK_THRESHOLD: 50,
  SIGNAL_WEIGHT_LOW: 5,
  SIGNAL_WEIGHT_MEDIUM: 10,
  SIGNAL_WEIGHT_HIGH: 20,
  QUESTION_SIMILARITY_THRESHOLD: 0.7,
  RECENT_SIGNALS_COUNT: 10,
  RECENT_QUESTIONS_COUNT: 5,
  RECENT_LOAD_COUNT: 5,
  OVERWHELMED_THRESHOLD: 3,
  REREAD_THRESHOLD: 3,
  REREAD_WEIGHT: 15,
  OVERWHELMED_WEIGHT: 20,
  SIMILARITY_WEIGHT: 25,
  MAX_SCORE: 100,
  MIN_SCORE: 0,
} as const

// Cognitive Load Configuration
export const COGNITIVE_LOAD_CONFIG = {
  overwhelmed: { chunkSize: 150, delay: 100, label: '🧘 Overwhelmed' },
  balanced: { chunkSize: 300, delay: 50, label: '⚖️ Balanced' },
  speed: { chunkSize: 600, delay: 20, label: '⚡ Speed' },
  mastery: { chunkSize: 0, delay: 0, label: '🎓 Mastery' },
} as const

// Quiz Configuration
export const QUIZ_CONFIG = {
  MAX_QUESTIONS: 10,
  MIN_QUESTIONS: 1,
  DEFAULT_SCORE: 50,
  MAX_SCORE: 100,
  MIN_SCORE: 0,
} as const

// Storage Keys (versioned for cache-busting)
export const STORAGE_KEYS = {
  THEME: 'theme:v1',
  MODE: 'mode:v1',
  TIMEBOX: 'timebox:v1',
  PERSPECTIVE: 'perspective:v1',
  FUTURE_YOU: 'futureYou:v1',
  MASTERY_HISTORY: 'masteryHistory:v1',
  STUCK_SCORE: 'stuckScore:v1',
  SESSION_PREFS: 'sessionPrefs:v1',
  COGNITIVE_LOAD: 'cognitiveLoad:v1',
  ONLINE_STATUS: 'onlineStatus:v1',
} as const

// API Configuration
export const API_CONFIG = {
  BASE_URL: '/api',
  ENDPOINTS: {
    EXPLAIN: '/api/explain',
  },
  TIMEOUT: 30000,
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000,
} as const

// Error Messages
export const ERROR_MESSAGES = {
  CONTEXT_NOT_FOUND: (contextName: string) => 
    `${contextName} must be used within its provider`,
  INVALID_ACTION_TYPE: (actionType: string) => 
    `Invalid action type: ${actionType}`,
  INVALID_ACTION_PAYLOAD: (actionType: string) => 
    `Invalid payload for action type: ${actionType}`,
  API_ERROR: 'Failed to fetch explanation. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  INVALID_MODE: 'Invalid learning mode',
  INVALID_TIMEBOX: 'Invalid timebox value',
  INVALID_PERSPECTIVE: 'Invalid perspective value',
} as const

// Debug Configuration
export const DEBUG_CONFIG = {
  ENABLED: process.env.NODE_ENV === 'development',
  LOG_ACTIONS: process.env.NODE_ENV === 'development',
  LOG_STATE_CHANGES: process.env.NODE_ENV === 'development',
  LOG_API_CALLS: process.env.NODE_ENV === 'development',
} as const

// Type-safe getter functions
export const getStorageKey = (key: keyof typeof STORAGE_KEYS): string => {
  return STORAGE_KEYS[key]
}

export const isValidTimebox = (value: unknown): value is typeof LEARNING_CONSTANTS.TIMEBOX_VALUES[number] => {
  return LEARNING_CONSTANTS.TIMEBOX_VALUES.includes(value as any)
}

export const isValidPerspective = (value: unknown): value is typeof LEARNING_CONSTANTS.PERSPECTIVES[number] => {
  return LEARNING_CONSTANTS.PERSPECTIVES.includes(value as any)
}

export const isValidMode = (value: unknown): value is typeof LEARNING_CONSTANTS.MODES[number] => {
  return LEARNING_CONSTANTS.MODES.includes(value as any)
}

export const isValidCognitiveLoad = (value: unknown): value is typeof LEARNING_CONSTANTS.COGNITIVE_LOADS[number] => {
  return LEARNING_CONSTANTS.COGNITIVE_LOADS.includes(value as any)
}

/**
 * Get configuration for cognitive load mode
 */
export const getCognitiveLoadConfig = (mode: typeof LEARNING_CONSTANTS.COGNITIVE_LOADS[number]) => {
  return COGNITIVE_LOAD_CONFIG[mode]
}

/**
 * Safe error message formatter
 */
export const formatErrorMessage = (key: keyof typeof ERROR_MESSAGES, ...args: any[]): string => {
  const template = ERROR_MESSAGES[key]
  if (typeof template === 'function') {
    return (template as any)(...args)
  }
  return template
}
