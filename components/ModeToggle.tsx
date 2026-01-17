'use client'

import { useMode, Mode } from './ModeProvider'
import { useState } from 'react'

const modes: Mode[] = ['Beginner', 'Student', 'Pro']

export function ModeToggle() {
  const { mode, setMode } = useMode()
  const [hoveredMode, setHoveredMode] = useState<Mode | null>(null)

  const handleModeChange = (m: Mode) => {
    setMode(m)
  }

  const activeIndex = modes.indexOf(mode)

  return (
    <div className="relative inline-flex items-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 rounded-lg p-1 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm shadow-lg dark:shadow-2xl">
      
      {/* Active indicator - Sliding background */}
      <div
        className="absolute top-1 bottom-1 rounded-md transition-all duration-300 ease-out pointer-events-none"
        style={{
          left: `calc(${activeIndex} * calc(100% / 3) + 0.25rem)`,
          width: `calc(100% / 3 - 0.5rem)`,
          background: 'linear-gradient(135deg, rgb(59, 130, 246) 0%, rgb(147, 51, 234) 50%, rgb(168, 85, 247) 100%)',
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.15)',
        }}
      />

      {/* Mode buttons */}
      {modes.map((m) => {
        const isActive = mode === m
        const isHovered = hoveredMode === m

        return (
          <button
            key={m}
            onClick={() => handleModeChange(m)}
            onMouseEnter={() => setHoveredMode(m)}
            onMouseLeave={() => setHoveredMode(null)}
            className={`
              relative z-10 flex-1 w-24 py-2 px-3 text-sm font-semibold
              transition-all duration-200 text-center
              ${
                isActive
                  ? 'text-white drop-shadow-sm'
                  : 'text-gray-700 dark:text-gray-300'
              }
              ${isHovered && !isActive ? 'text-gray-900 dark:text-gray-100' : ''}
            `}
            aria-pressed={isActive}
            aria-label={`${m} mode`}
          >
            {m}
          </button>
        )
      })}
    </div>
  )
}
