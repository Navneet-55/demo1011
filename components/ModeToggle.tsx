'use client'

import { useMode, Mode } from './ModeProvider'
import { useState } from 'react'

const modes: Mode[] = ['Beginner', 'Student', 'Pro']

export function ModeToggle() {
  const { mode, setMode } = useMode()
  const [hoveredMode, setHoveredMode] = useState<Mode | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleModeChange = (m: Mode) => {
    if (mode !== m) {
      setIsAnimating(true)
      setMode(m)
      setTimeout(() => setIsAnimating(false), 300)
    }
  }

  const activeIndex = modes.indexOf(mode)

  return (
    <div className="relative">
      {/* Main toggle container with proper spacing */}
      <div className="relative inline-flex items-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 rounded-lg p-1 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm shadow-lg dark:shadow-2xl">
        
        {/* Active indicator - Premium sliding background */}
        <div
          className="absolute top-1 bottom-1 rounded-md transition-all duration-300 ease-out pointer-events-none"
          style={{
            left: `calc(${activeIndex} * 33.333% + 0.25rem)`,
            width: 'calc(33.333% - 0.5rem)',
            background: 'linear-gradient(135deg, rgb(59, 130, 246) 0%, rgb(147, 51, 234) 50%, rgb(168, 85, 247) 100%)',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.15)',
          }}
        />

        {/* Mode buttons */}
        {modes.map((m, index) => {
          const isActive = mode === m
          const isHovered = hoveredMode === m

          return (
            <button
              key={m}
              onClick={() => handleModeChange(m)}
              onMouseEnter={() => setHoveredMode(m)}
              onMouseLeave={() => setHoveredMode(null)}
              className={`
                relative z-10 px-6 py-2 text-sm font-semibold
                transition-all duration-200 ease-out
                ${
                  isActive
                    ? 'text-white drop-shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                }
                ${isHovered && !isActive ? 'scale-105' : 'scale-100'}
                whitespace-nowrap
              `}
              aria-pressed={isActive}
              aria-label={`${m} mode - ${m === 'Beginner' ? 'Simple & Clear explanations' : m === 'Student' ? 'Balanced learning content' : 'Advanced technical content'}`}
            >
              <span className="block truncate">{m}</span>

              {/* Hover effect background for non-active buttons */}
              {!isActive && (
                <div
                  className="absolute inset-0 rounded-md bg-gray-200/40 dark:bg-gray-700/40 -z-10 transition-all duration-200"
                  style={{
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered ? 'scale(1)' : 'scale(0.9)',
                  }}
                />
              )}
            </button>
          )
        })}

        {/* Outer glow on hover */}
        <div className="absolute inset-0 -inset-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </div>
  )
}
