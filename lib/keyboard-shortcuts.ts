/**
 * Keyboard Shortcuts Utilities
 * Provides hooks and utilities for handling global keyboard shortcuts
 */

import React, { useEffect, useRef } from 'react'

interface UseKeyboardShortcutOptions {
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  metaKey?: boolean
  code?: string
  key?: string
  preventDefault?: boolean
  stopPropagation?: boolean
}

/**
 * Hook to listen for a specific keyboard shortcut globally
 *
 * @param callback Function to call when shortcut is pressed
 * @param options Keyboard modifiers and keys to listen for
 *
 * @example
 * useKeyboardShortcut(() => openPalette(), { metaKey: true, key: 'k' })
 */
export function useKeyboardShortcut(
  callback: (e: KeyboardEvent) => void,
  options: UseKeyboardShortcutOptions = {}
) {
  const {
    ctrlKey = false,
    shiftKey = false,
    altKey = false,
    metaKey = false,
    code,
    key,
    preventDefault = true,
    stopPropagation = true,
  } = options

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const matches =
        e.ctrlKey === ctrlKey &&
        e.shiftKey === shiftKey &&
        e.altKey === altKey &&
        e.metaKey === metaKey &&
        (!code || e.code === code) &&
        (!key || e.key.toLowerCase() === key.toLowerCase())

      if (matches) {
        if (preventDefault) e.preventDefault()
        if (stopPropagation) e.stopPropagation()
        callback(e)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [callback, ctrlKey, shiftKey, altKey, metaKey, code, key, preventDefault, stopPropagation])
}

/**
 * Hook to listen for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
 *
 * @param callback Function to call when Cmd/Ctrl+K is pressed
 */
export function useCommandPaletteShortcut(callback: () => void) {
  const [isMac, setIsMac] = React.useState(false)

  React.useEffect(() => {
    setIsMac(/Mac|iPhone|iPad|iPod/.test(navigator.platform))
  }, [])

  useKeyboardShortcut(
    (e) => {
      callback()
    },
    {
      metaKey: isMac,
      ctrlKey: !isMac,
      key: 'k',
      preventDefault: true,
      stopPropagation: true,
    }
  )
}

/**
 * Hook to listen for Escape key
 */
export function useEscapeKey(callback: () => void) {
  useKeyboardShortcut(callback, {
    key: 'Escape',
    preventDefault: true,
    stopPropagation: true,
  })
}

/**
 * Hook for arrow key navigation
 */
export function useArrowKeyNavigation(
  onUp: () => void,
  onDown: () => void,
  options: { enabled?: boolean } = {}
) {
  const { enabled = true } = options

  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        onUp()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        onDown()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enabled, onUp, onDown])
}

/**
 * Hook to detect if an input element is focused (to avoid capturing shortcuts)
 */
export function useIsInputFocused() {
  const isInputFocused = () => {
    const activeElement = document.activeElement as HTMLElement
    const inputTypes = ['INPUT', 'TEXTAREA', 'SELECT']
    return activeElement && inputTypes.includes(activeElement.tagName)
  }

  return isInputFocused
}

/**
 * Format keyboard shortcut for display
 *
 * @example
 * formatShortcut({ metaKey: true, key: 'K' }) // "⌘K" on Mac, "Ctrl+K" elsewhere
 */
export function formatShortcut(options: UseKeyboardShortcutOptions): string {
  const isMac = typeof window !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform)

  let parts: string[] = []

  if (options.metaKey) parts.push(isMac ? '⌘' : 'Win')
  if (options.ctrlKey) parts.push(isMac ? '⌃' : 'Ctrl')
  if (options.altKey) parts.push(isMac ? '⌥' : 'Alt')
  if (options.shiftKey) parts.push(isMac ? '⇧' : 'Shift')

  if (options.key) {
    parts.push(options.key.toUpperCase())
  }

  return parts.join(isMac ? '' : '+')
}

/**
 * Detect if command/ctrl key is pressed (for icon indication)
 */
export function useCommandKeyPressed() {
  const [isPressed, setIsPressed] = React.useState(false)
  const isMac = typeof window !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform)

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((isMac && e.metaKey) || (!isMac && e.ctrlKey)) {
        setIsPressed(true)
      }
    }

    const handleKeyUp = () => {
      setIsPressed(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [isMac])

  return isPressed
}
