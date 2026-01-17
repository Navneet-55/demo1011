'use client'

import { useMode, Mode } from './ModeProvider'

const modes: Mode[] = ['Beginner', 'Student', 'Pro']

const modeIcons: Record<Mode, string> = {
  Beginner: '🌱',
  Student: '📚',
  Pro: '⚡'
}

export function ModeToggle() {
  const { mode, setMode } = useMode()
  const activeIndex = modes.indexOf(mode)

  return (
    <div className="relative inline-flex items-stretch bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 rounded-xl p-1.5 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm shadow-lg dark:shadow-2xl overflow-hidden">
      
      {/* Active indicator with enhanced gradient */}
      <div
        className="absolute h-[calc(100%-0.75rem)] top-1.5 rounded-lg transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] pointer-events-none z-0"
        style={{
          left: `calc(${activeIndex * 33.333}% + 0.375rem)`,
          width: 'calc(33.333% - 0.75rem)',
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #a855f7 100%)',
          boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.2)',
        }}
      />

      {/* Mode buttons */}
      {modes.map((m) => {
        const isActive = mode === m

        return (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`
              relative z-10 flex-1 py-2.5 px-4 text-sm font-semibold rounded-lg
              transition-all duration-200 ease-out select-none
              ${
                isActive
                  ? 'text-white scale-100'
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:scale-105'
              }
            `}
            style={{ minWidth: '85px' }}
            aria-pressed={isActive}
            aria-label={`Switch to ${m} mode`}
            title={`${m} Mode`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <span className="text-base" aria-hidden="true">{modeIcons[m]}</span>
              <span>{m}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
