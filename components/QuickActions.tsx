/**
 * Quick Actions Menu
 * Provides fast access to common actions without the complexity of a full command palette
 */

'use client'

import React, { useState, useRef, useEffect } from 'react'

interface QuickAction {
  id: string
  label: string
  icon: string
  description: string
  action: () => void
  category: 'learning' | 'tools' | 'settings'
}

interface QuickActionsProps {
  onClearInput?: () => void
  onExampleQuery?: () => void
  onToggleDarkMode?: () => void
  onExportNotes?: () => void
}

export function QuickActions({
  onClearInput,
  onExampleQuery,
  onToggleDarkMode,
  onExportNotes,
}: QuickActionsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const actions: QuickAction[] = [
    {
      id: 'clear',
      label: 'Clear Input',
      icon: '🗑️',
      description: 'Clear the current input field',
      category: 'tools',
      action: () => {
        onClearInput?.()
        setIsOpen(false)
      },
    },
    {
      id: 'example',
      label: 'Load Example',
      icon: '💡',
      description: 'Load an example query',
      category: 'learning',
      action: () => {
        onExampleQuery?.()
        setIsOpen(false)
      },
    },
    {
      id: 'theme',
      label: 'Toggle Theme',
      icon: '🌓',
      description: 'Switch between light and dark mode',
      category: 'settings',
      action: () => {
        onToggleDarkMode?.()
        setIsOpen(false)
      },
    },
    {
      id: 'export',
      label: 'Export Notes',
      icon: '📥',
      description: 'Download your learning notes',
      category: 'tools',
      action: () => {
        onExportNotes?.()
        setIsOpen(false)
      },
    },
    {
      id: 'shortcuts',
      label: 'View Shortcuts',
      icon: '⌨️',
      description: 'See keyboard shortcuts',
      category: 'settings',
      action: () => {
        alert('Keyboard Shortcuts:\n\n• Tab: Focus next element\n• Esc: Close menus\n• Ctrl/Cmd + K: Quick actions (coming soon)')
        setIsOpen(false)
      },
    },
  ]

  const categories = {
    learning: { label: 'Learning', color: 'text-blue-600 dark:text-blue-400' },
    tools: { label: 'Tools', color: 'text-green-600 dark:text-green-400' },
    settings: { label: 'Settings', color: 'text-purple-600 dark:text-purple-400' },
  }

  const groupedActions = {
    learning: actions.filter(a => a.category === 'learning'),
    tools: actions.filter(a => a.category === 'tools'),
    settings: actions.filter(a => a.category === 'settings'),
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 group"
        aria-label="Quick actions menu"
        title="Quick Actions"
      >
        <span className="text-gray-600 dark:text-gray-400 text-sm">⚡</span>
        <span className="hidden sm:inline text-xs text-gray-600 dark:text-gray-400 font-medium">
          Quick Actions
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span>⚡</span>
              Quick Actions
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Fast access to common tasks
            </p>
          </div>

          {/* Actions List */}
          <div className="max-h-96 overflow-y-auto">
            {Object.entries(groupedActions).map(([category, categoryActions]) => {
              if (categoryActions.length === 0) return null
              
              return (
                <div key={category} className="py-2">
                  <div className="px-4 py-1">
                    <p className={`text-xs font-semibold uppercase tracking-wide ${categories[category as keyof typeof categories].color}`}>
                      {categories[category as keyof typeof categories].label}
                    </p>
                  </div>
                  {categoryActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={action.action}
                      className="w-full px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left flex items-start gap-3 group"
                    >
                      <span className="text-xl flex-shrink-0 mt-0.5">{action.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {action.label}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {action.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Press <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Esc</kbd> to close
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
