/**
 * Storage Wrapper
 * Typed localStorage with version keys + migration helpers
 * Safe read/write; handles missing/stale data gracefully
 */

type StorageKey =
  | 'timebox'
  | 'perspective'
  | 'futureYou'
  | 'masteryHistory'
  | 'practiceProgress'
  | 'stuckScore'
  | 'sessionPrefs'

const STORAGE_VERSION = 1
const VERSION_KEY = 'gyaan_storage_v'

interface StorageSchema {
  timebox: '30s' | '2m' | 'deep'
  perspective: 'story' | 'diagram' | 'code' | 'analogy' | 'math'
  futureYou: boolean
  masteryHistory: Array<{
    topic: string
    score: number
    date: string
  }>
  practiceProgress: Record<
    string,
    {
      completed: boolean
      date: string
    }
  >
  stuckScore: number
  sessionPrefs: {
    lastTimebox: '30s' | '2m' | 'deep'
    lastPerspective: 'story' | 'diagram' | 'code' | 'analogy' | 'math'
    lastFutureYou: boolean
  }
}

/**
 * Get versioned key
 */
function getVersionedKey(key: StorageKey): string {
  return `${key}:v${STORAGE_VERSION}`
}

/**
 * Safe read from localStorage
 */
export function getStorageItem<K extends StorageKey>(
  key: K
): StorageSchema[K] | null {
  if (typeof window === 'undefined') return null

  try {
    const versionedKey = getVersionedKey(key)
    const value = localStorage.getItem(versionedKey)

    if (!value) {
      // Try old key (migration)
      const oldValue = localStorage.getItem(key)
      if (oldValue) {
        try {
          return JSON.parse(oldValue)
        } catch {
          return null
        }
      }
      return null
    }

    return JSON.parse(value)
  } catch (error) {
    console.warn(`Failed to read storage key ${key}:`, error)
    return null
  }
}

/**
 * Safe write to localStorage
 */
export function setStorageItem<K extends StorageKey>(
  key: K,
  value: StorageSchema[K]
): void {
  if (typeof window === 'undefined') return

  try {
    const versionedKey = getVersionedKey(key)
    localStorage.setItem(versionedKey, JSON.stringify(value))
  } catch (error) {
    console.warn(`Failed to write storage key ${key}:`, error)
  }
}

/**
 * Remove from localStorage
 */
export function removeStorageItem(key: StorageKey): void {
  if (typeof window === 'undefined') return

  try {
    const versionedKey = getVersionedKey(key)
    localStorage.removeItem(versionedKey)
  } catch (error) {
    console.warn(`Failed to remove storage key ${key}:`, error)
  }
}

/**
 * Batch read multiple keys
 */
export function getStorageItems<K extends StorageKey>(
  keys: K[]
): Partial<StorageSchema> {
  const result: Partial<StorageSchema> = {}
  for (const key of keys) {
    const value = getStorageItem(key)
    if (value !== null) {
      result[key] = value
    }
  }
  return result
}

/**
 * Clear all versioned storage
 */
export function clearVersionedStorage(): void {
  if (typeof window === 'undefined') return

  try {
    const keys = Object.keys(localStorage)
    const versionPrefix = `:v${STORAGE_VERSION}`
    for (const key of keys) {
      if (key.endsWith(versionPrefix)) {
        localStorage.removeItem(key)
      }
    }
  } catch (error) {
    console.warn('Failed to clear storage:', error)
  }
}

/**
 * Export all stored data (debugging)
 */
export function exportStorageData(): Record<string, any> {
  if (typeof window === 'undefined') return {}

  const result: Record<string, any> = {}
  const keys: StorageKey[] = [
    'timebox',
    'perspective',
    'futureYou',
    'masteryHistory',
    'practiceProgress',
    'stuckScore',
    'sessionPrefs',
  ]

  for (const key of keys) {
    const value = getStorageItem(key)
    if (value !== null) {
      result[key] = value
    }
  }

  return result
}
