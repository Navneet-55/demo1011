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

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Input</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Paste code, errors, or ask questions
        </p>
      </div>
      
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholders[mode]}
        className="flex-1 w-full p-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 resize-none font-mono text-sm transition-all duration-200"
        disabled={isLoading}
      />
      
      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-gray-500 dark:text-gray-500">
          Tip: Press <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700 text-xs">⌘</kbd> + <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700 text-xs">Enter</kbd> to submit
        </p>
        
        <button
          onClick={onSubmit}
          disabled={!value.trim() || isLoading}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
        >
          {isLoading ? 'Processing...' : 'Explain'}
        </button>
      </div>
    </div>
  )
}
