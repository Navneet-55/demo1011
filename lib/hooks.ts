/**
 * Custom Hooks for Reusable Logic
 * Composable hooks for common patterns
 */

'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { DEBUG_CONFIG } from '@/lib/constants'

/**
 * Hook for debounced values
 * Useful for delaying state updates (e.g., search input)
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook for throttled callbacks
 * Useful for performance-sensitive handlers (e.g., scroll)
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 100
): T {
  const lastRunRef = useRef<number>(Date.now())

  return useCallback(
    (...args: any[]) => {
      const now = Date.now()
      if (now - lastRunRef.current >= delay) {
        callback(...args)
        lastRunRef.current = now
      }
    },
    [callback, delay]
  ) as T
}

/**
 * Hook for previous value tracking
 * Returns the previous value from last render
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

/**
 * Hook for mounted state
 * Prevents memory leaks from state updates on unmounted components
 */
export function useIsMounted(): boolean {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  return isMounted
}

/**
 * Hook for async data fetching with loading and error states
 */
export function useAsync<T, E = Error>(
  asyncFunction: () => Promise<T>,
  immediate = true
): {
  status: 'idle' | 'pending' | 'success' | 'error'
  value: T | null
  error: E | null
} {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [value, setValue] = useState<T | null>(null)
  const [error, setError] = useState<E | null>(null)

  const execute = useCallback(async () => {
    setStatus('pending')
    setValue(null)
    setError(null)

    try {
      const result = await asyncFunction()
      setValue(result)
      setStatus('success')
      return result
    } catch (error) {
      setError(error as E)
      setStatus('error')
      throw error
    }
  }, [asyncFunction])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return { status, value, error }
}

/**
 * Hook for local storage with type safety
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      if (DEBUG_CONFIG.ENABLED) {
        console.warn(`Failed to read localStorage key "${key}":`, error)
      }
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch (error) {
        if (DEBUG_CONFIG.ENABLED) {
          console.warn(`Failed to write localStorage key "${key}":`, error)
        }
      }
    },
    [key, storedValue]
  )

  return [storedValue, setValue]
}

/**
 * Hook for window resize events
 */
export function useWindowSize(): { width: number; height: number } {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}

/**
 * Hook for click outside detection
 */
export function useClickOutside<T extends HTMLElement>(
  callback: () => void
): React.RefObject<T> {
  const ref = useRef<T>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [callback])

  return ref
}

/**
 * Hook for keyboard shortcut handling
 */
export function useKeyPress(
  targetKey: string,
  callback: () => void,
  options: { ctrlKey?: boolean; shiftKey?: boolean; altKey?: boolean } = {}
): void {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const keyMatches = event.key === targetKey || event.code === targetKey
      const ctrlMatches = options.ctrlKey ? event.ctrlKey : true
      const shiftMatches = options.shiftKey ? event.shiftKey : true
      const altMatches = options.altKey ? event.altKey : true

      if (keyMatches && ctrlMatches && shiftMatches && altMatches) {
        event.preventDefault()
        callback()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [targetKey, callback, options])
}

/**
 * Hook for interval with cleanup
 */
export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay === null) return

    const id = setInterval(() => savedCallback.current(), delay)
    return () => clearInterval(id)
  }, [delay])
}

/**
 * Hook for toggle state
 */
export function useToggle(
  initialValue: boolean = false
): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => {
    setValue(v => !v)
  }, [])

  const setValueSafe = useCallback((newValue: boolean) => {
    setValue(newValue)
  }, [])

  return [value, toggle, setValueSafe]
}

/**
 * Hook for form state management
 */
export function useForm<T extends Record<string, any>>(
  initialValues: T
): {
  values: T
  setValues: (values: T) => void
  resetForm: () => void
  setFieldValue: (field: keyof T, value: any) => void
} {
  const [values, setValues] = useState<T>(initialValues)

  const resetForm = useCallback(() => {
    setValues(initialValues)
  }, [initialValues])

  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({
      ...prev,
      [field]: value,
    }))
  }, [])

  return {
    values,
    setValues,
    resetForm,
    setFieldValue,
  }
}
