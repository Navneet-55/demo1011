'use client'

import { Mode } from './ModeProvider'

const placeholders: Record<Mode, string> = {
  Beginner: 'Paste your code, error message, or concept here...\n\nExample: "What does this function do?"\nExample: "TypeError: Cannot read property of undefined"',
  Student: 'Enter code, errors, or questions to learn...\n\nExample: Paste a React component\nExample: "Explain async/await"\nExample: Error stack trace',
  Pro: 'Code, errors, or technical questions...\n\nExample: Complex algorithm\nExample: Performance issue\nExample: Architecture pattern'
}

type InputPanelProps = {
  mode: Mode
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isLoading: boolean
}

export function InputPanel({ mode, value, onChange, onSubmit, isLoading }: InputPanelProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      if (value.trim() && !isLoading) {
        onSubmit()
      }
    }
  }

  const charCount = value.length
  const hasContent = value.trim().length > 0

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-1 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Input</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Paste code, errors, or ask questions
            </p>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500 font-mono">
            {charCount > 0 && `${charCount} chars`}
          </div>
        </div>
      </div>
      
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholders[mode]}
        className="flex-1 w-full p-4 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:border-blue-500 dark:focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-600/10 resize-none font-mono text-sm transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-600"
        disabled={isLoading}
        spellCheck={false}
      />
      
      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
          <span className="hidden sm:inline">💡 Tip:</span>
          <span>Press</span>
          <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700 text-xs font-semibold">⌘</kbd>
          <span>+</span>
          <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700 text-xs font-semibold">Enter</kbd>
        </p>
        
        <button
          onClick={onSubmit}
          disabled={!hasContent || isLoading}
          className="relative px-6 py-2.5 bg-gradient-to-r from-blue-600 via-purple-600 to-purple-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:via-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 overflow-hidden group"
        >
          <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <span className="relative flex items-center gap-2">
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </>
            ) : (
              <>
                <span>⚡</span>
                Explain
              </>
            )}
          </span>
        </button>
      </div>
    </div>
  )
}
