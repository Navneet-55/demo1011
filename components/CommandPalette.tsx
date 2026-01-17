/**
 * Command Palette Component
 * Main command palette with search, navigation, and execution
 */

'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Modal } from '@/components/ui/Modal'
import {
  commandRegistry,
  filterCommands,
  executeCommand,
  getCommandGroups,
  findCommand,
} from '@/lib/commands'
import { useArrowKeyNavigation } from '@/lib/keyboard-shortcuts'
import { Command, CommandContext } from '@/types/commands'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  context?: Omit<CommandContext, 'onClose'>
}

export const CommandPalette = React.forwardRef<HTMLDivElement, CommandPaletteProps>(
  ({ isOpen, onClose, context = {} }, ref) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [displayCommands, setDisplayCommands] = useState<Command[]>(commandRegistry)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const listRef = useRef<HTMLDivElement>(null)

    // Filter commands based on search
    useEffect(() => {
      const filtered = filterCommands(searchQuery)
      setDisplayCommands(filtered)
      setSelectedIndex(0)
    }, [searchQuery])

    // Focus input on open
    useEffect(() => {
      if (isOpen) {
        inputRef.current?.focus()
        setSearchQuery('')
        setError(null)
      }
    }, [isOpen])

    // Arrow key navigation
    useArrowKeyNavigation(
      () => {
        setSelectedIndex((prev) => {
          const newIndex = Math.max(0, prev - 1)
          scrollToSelected(newIndex)
          return newIndex
        })
      },
      () => {
        setSelectedIndex((prev) => {
          const newIndex = Math.min(displayCommands.length - 1, prev + 1)
          scrollToSelected(newIndex)
          return newIndex
        })
      },
      { enabled: isOpen }
    )

    // Scroll selected item into view
    const scrollToSelected = (index: number) => {
      if (!listRef.current) return
      const items = listRef.current.querySelectorAll('[data-command-item]')
      const item = items[index] as HTMLElement
      if (item) {
        item.scrollIntoView({ block: 'nearest' })
      }
    }

    // Execute selected command
    const handleExecute = async (cmd: Command) => {
      if (cmd.subcommands) {
        // Replace display with subcommands
        setDisplayCommands(cmd.subcommands)
        setSelectedIndex(0)
        setSearchQuery('')
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        await executeCommand(cmd, { ...context, onClose })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Command failed')
        console.error('[CommandPalette] Error executing command:', err)
      } finally {
        setIsLoading(false)
      }
    }

    // Handle key press
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && displayCommands.length > 0) {
        e.preventDefault()
        handleExecute(displayCommands[selectedIndex])
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'Backspace' && searchQuery === '' && displayCommands !== commandRegistry) {
        // Go back to main commands if backspace with empty search
        e.preventDefault()
        setDisplayCommands(commandRegistry)
        setSelectedIndex(0)
      }
    }

    return (
      <Modal
        ref={ref}
        isOpen={isOpen}
        onClose={onClose}
        size="md"
        closeOnEsc={true}
        closeOnBackdrop={true}
        focusTrap={true}
        className="flex flex-col max-h-[500px]"
      >
        {/* Search Input */}
        <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-800 p-4">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search commands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            disabled={isLoading}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex-shrink-0 border-b border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 px-4 py-2">
            <p className="text-sm text-red-700 dark:text-red-300">❌ {error}</p>
          </div>
        )}

        {/* Commands List */}
        <div ref={listRef} className="flex-1 overflow-y-auto">
          {displayCommands.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">No commands found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {displayCommands.map((cmd, idx) => (
                <CommandPaletteItem
                  key={cmd.id}
                  command={cmd}
                  isSelected={idx === selectedIndex}
                  isLoading={isLoading}
                  onSelect={() => handleExecute(cmd)}
                  onHover={() => setSelectedIndex(idx)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer Help */}
        <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 px-4 py-2">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>
              <kbd className="rounded px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-mono">
                ↑↓
              </kbd>
              <span className="ml-1">to navigate</span>
              <kbd className="ml-2 rounded px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-mono">
                ↲
              </kbd>
              <span className="ml-1">to select</span>
              <kbd className="ml-2 rounded px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-mono">
                esc
              </kbd>
              <span className="ml-1">to close</span>
            </span>
            <span>{displayCommands.length} commands</span>
          </div>
        </div>
      </Modal>
    )
  }
)

CommandPalette.displayName = 'CommandPalette'

/**
 * Individual command item in the palette
 */
interface CommandPaletteItemProps {
  command: Command
  isSelected: boolean
  isLoading: boolean
  onSelect: () => void
  onHover: () => void
}

function CommandPaletteItem({
  command,
  isSelected,
  isLoading,
  onSelect,
  onHover,
}: CommandPaletteItemProps) {
  return (
    <button
      data-command-item
      onClick={onSelect}
      onMouseEnter={onHover}
      disabled={isLoading}
      className={`
        w-full text-left px-4 py-3 transition-colors
        ${
          isSelected
            ? 'bg-blue-500/10 border-l-2 border-blue-500'
            : 'bg-white dark:bg-gray-900 border-l-2 border-transparent'
        }
        hover:bg-gray-50 dark:hover:bg-gray-800
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 text-xl mt-0.5">{command.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {command.label}
            </p>
            {command.subcommands && (
              <span className="flex-shrink-0 text-xs text-gray-400 dark:text-gray-500">
                ({command.subcommands.length})
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {command.description}
          </p>
        </div>
        {command.subcommands && (
          <span className="flex-shrink-0 text-gray-400 dark:text-gray-500 mt-0.5">→</span>
        )}
      </div>
    </button>
  )
}
