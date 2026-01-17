'use client'

import { useMode, Mode } from './ModeProvider'
import { useState } from 'react'

const modes: Mode[] = ['Beginner', 'Student', 'Pro']

const modeDescriptions: Record<Mode, string> = {
  Beginner: 'Simple & Clear',
  Student: 'Balanced Learning',
  Pro: 'Advanced Tech',
}

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
      {/* Outer glow container */}
      <div className="absolute inset-0 -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Main toggle container */}
      <div className="relative inline-flex items-center gap-1 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 rounded-xl p-1.5 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm shadow-lg dark:shadow-2xl">
        {/* Background animated gradient */}
        <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300" />
        </div>

        {/* Active indicator - Premium sliding background */}
        <div
          className="absolute top-2 bottom-2 rounded-lg transition-all duration-300 ease-out pointer-events-none"
          style={{
            left: `calc(${activeIndex} * (100% / 3) + 0.375rem)`,
            width: `calc(100% / 3 - 0.75rem)`,
            background: isAnimating
              ? 'linear-gradient(135deg, rgb(59, 130, 246) 0%, rgb(168, 85, 247) 100%)'
              : 'linear-gradient(135deg, rgb(59, 130, 246) 0%, rgb(147, 51, 234) 50%, rgb(168, 85, 247) 100%)',
            boxShadow: isAnimating
              ? '0 8px 16px rgba(59, 130, 246, 0.3)'
              : '0 4px 12px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
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
              className="relative z-10 px-5 py-2.5 text-sm font-semibold transition-all duration-200 group"
              aria-pressed={isActive}
              aria-label={`${m} mode`}
            >
              {/* Button content container */}
              <div
                className={`flex flex-col items-center transition-all duration-200 ${
                  isActive
                    ? 'text-white drop-shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                } ${isHovered && !isActive ? 'text-gray-800 dark:text-gray-200' : ''}`}
              >
                {/* Mode name */}
                <span className="text-xs tracking-wider">{m}</span>

                {/* Hover description - Only show for non-active when hovering */}
                {isHovered && !isActive && (
                  <span
                    className="text-xs opacity-70 whitespace-nowrap transition-all duration-200"
                    style={{
                      fontSize: '0.65rem',
                      marginTop: '1px',
                    }}
                  >
                    {modeDescriptions[m]}
                  </span>
                )}
              </div>

              {/* Hover effect background */}
              {!isActive && (
                <div
                  className="absolute inset-0 rounded-lg bg-gray-200/30 dark:bg-gray-700/30 -z-10 transition-all duration-200"
                  style={{
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered ? 'scale(1)' : 'scale(0.95)',
                  }}
                />
              )}
            </button>
          )
        })}

        {/* Subtle border animation on active */}
        <div
          className="absolute inset-0 rounded-xl pointer-events-none transition-all duration-300"
          style={{
            border: '1px solid transparent',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(168, 85, 247, 0.2))',
            backgroundClip: 'padding-box',
            borderImage: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(168, 85, 247, 0.3) 100%) 1',
            opacity: isAnimating ? 1 : 0,
          }}
        />
      </div>

      {/* Optional: Floating label indicator */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
          {mode} Mode Active
        </div>
      </div>
    </div>
  )
}
