'use client'

import React, { useState } from 'react'
import { useTheme } from './ThemeProvider'
import { ModeToggle } from '@/components/ModeToggle'
import { OnlineOfflineToggle } from './OnlineOfflineToggle'

interface HeaderProps {
  onCommandPaletteOpen?: () => void
}

export function Header({ onCommandPaletteOpen }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const isMac = typeof window !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform)
  const shortcutHint = isMac ? '⌘K' : 'Ctrl+K'

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md shadow-sm dark:shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo with enhanced gradient */}
          <div className="flex-shrink-0 group">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-purple-700 bg-clip-text text-transparent hover:from-blue-700 hover:via-purple-700 hover:to-purple-800 transition-all duration-300 cursor-default select-none">
              <span className="inline-flex items-center gap-2">
                <span className="text-2xl" aria-hidden="true">⚒️</span>
                GyaanForge
              </span>
            </h1>
          </div>

          {/* Mode Toggle */}
          <div className="flex-1 flex justify-center">
            <ModeToggle />
          </div>

          {/* Command Palette Button - Hidden on mobile */}
          {onCommandPaletteOpen && (
            <button
              onClick={onCommandPaletteOpen}
              className="hidden sm:flex flex-shrink-0 relative items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 group"
              title="Open command palette"
            >
              <span className="text-gray-600 dark:text-gray-400 text-sm">✨</span>
              <span className="hidden md:inline text-xs text-gray-600 dark:text-gray-400 font-mono">
                {shortcutHint}
              </span>
            </button>
          )}

          {/* Online/Offline Toggle */}
          <div className="flex-shrink-0">
            <OnlineOfflineToggle />
          </div>

          {/* Enhanced Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="flex-shrink-0 relative p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group overflow-hidden"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            {theme === 'dark' ? (
              <svg
                className="w-5 h-5 text-yellow-500 transition-transform duration-300 group-hover:rotate-180"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-gray-700 transition-transform duration-300 group-hover:-rotate-12"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
