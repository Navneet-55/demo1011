'use client'

import { useMode, Mode } from './ModeProvider'

const modes: Mode[] = ['Beginner', 'Student', 'Pro']

export function ModeToggle() {
  const { mode, setMode } = useMode()
  const activeIndex = modes.indexOf(mode)

  return (
    <div className="relative inline-flex items-stretch bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 rounded-lg p-1 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm shadow-lg dark:shadow-2xl">
      
      {/* Active indicator - Sliding background */}
      <div
        className="absolute h-[calc(100%-0.5rem)] top-1 rounded-md transition-all duration-300 ease-out pointer-events-none z-0"
        style={{
          left: `calc(${activeIndex * 33.333}% + 0.25rem)`,
          width: 'calc(33.333% - 0.5rem)',
          background: 'linear-gradient(135deg, rgb(59, 130, 246) 0%, rgb(147, 51, 234) 50%, rgb(168, 85, 247) 100%)',
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.15)',
        }}
      />

      {/* Mode buttons with equal flex distribution */}
      {modes.map((m) => {
        const isActive = mode === m

        return (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`
              relative z-10 flex-1 py-2.5 px-4 text-sm font-semibold
              transition-all duration-200 rounded-md
              ${
                isActive
                  ? 'text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
              }
            `}
            style={{ minWidth: '80px' }}
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
    </div>
  )
}
