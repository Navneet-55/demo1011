'use client'

import { useMode, Mode } from './ModeProvider'

const modes: Mode[] = ['Beginner', 'Student', 'Pro']

export function ModeToggle() {
  const { mode, setMode } = useMode()

  return (
    <div className="inline-flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 relative">
      {modes.map((m) => (
        <button
          key={m}
          onClick={() => setMode(m)}
          className={`
            relative z-10 px-6 py-2 text-sm font-medium rounded-md transition-colors duration-200
            ${
              mode === m
                ? 'text-white'
                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }
          `}
        >
          {m}
        </button>
      ))}
      
      {/* Sliding background indicator */}
      <div
        className="absolute top-1 bottom-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md transition-all duration-250 ease-out"
        style={{
          left: `${modes.indexOf(mode) * 33.333 + 2}%`,
          width: 'calc(33.333% - 8px)',
        }}
      />
    </div>
  )
}
