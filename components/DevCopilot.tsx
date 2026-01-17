'use client'

import { useState } from 'react'
import { Mode } from '@/types'

interface DevCopilotProps {
  mode: Mode
  onSubmit: (input: string, toolId: string, context?: any) => void
  isLoading: boolean
}

type Tab = 'explain' | 'debug' | 'test'

export default function DevCopilot({ mode, onSubmit, isLoading }: DevCopilotProps) {
  const [activeTab, setActiveTab] = useState<Tab>('explain')
  const [input, setInput] = useState('')
  const [language, setLanguage] = useState('JavaScript')
  const [framework, setFramework] = useState('Jest')

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return

    const toolIdMap = {
      explain: 'explain-code',
      debug: 'debug-error',
      test: 'generate-tests'
    } as const

    const context = activeTab === 'test' ? { language, framework } : undefined
    onSubmit(input, toolIdMap[activeTab], context)
    setInput('') // Clear input after submit
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  const tabs = [
    { id: 'explain' as Tab, icon: '📝', label: 'Explain Code' },
    { id: 'debug' as Tab, icon: '🐛', label: 'Debug Error' },
    { id: 'test' as Tab, icon: '🧪', label: 'Generate Tests' }
  ]

  const placeholders = {
    explain: 'Paste your code snippet here...\n\nfunction example() {\n  // your code\n}',
    debug: 'Paste your error stacktrace or describe the issue...\n\nError: Cannot read property \'foo\' of undefined\n  at Object.<anonymous> (file.js:10:5)',
    test: 'Paste the function/class you want to test...\n\nfunction add(a, b) {\n  return a + b;\n}'
  }

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500">
        <div className="flex items-center gap-2 text-white">
          <span className="text-xl">🚀</span>
          <h3 className="font-semibold">Dev Copilot Mode</h3>
        </div>
        <p className="text-sm text-indigo-100 mt-1">
          Specialized tools for developer productivity
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-max flex items-center justify-center gap-2 px-4 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
            aria-selected={activeTab === tab.id}
            role="tab"
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Language/Framework selectors for test tab */}
        {activeTab === 'test' && (
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option>JavaScript</option>
                <option>TypeScript</option>
                <option>Python</option>
                <option>Java</option>
                <option>Go</option>
                <option>Rust</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Framework
              </label>
              <select
                value={framework}
                onChange={(e) => setFramework(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option>Jest</option>
                <option>Mocha</option>
                <option>PyTest</option>
                <option>JUnit</option>
                <option>Go Test</option>
                <option>Rust Test</option>
              </select>
            </div>
          </div>
        )}

        {/* Input */}
        <div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholders[activeTab]}
            className="w-full h-64 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
            aria-label={`${tabs.find(t => t.id === activeTab)?.label} input`}
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={isLoading || !input.trim()}
          className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              {tabs.find(t => t.id === activeTab)?.icon}
              {activeTab === 'explain' && 'Explain This Code'}
              {activeTab === 'debug' && 'Debug This Error'}
              {activeTab === 'test' && 'Generate Tests'}
            </span>
          )}
        </button>

        {/* Tips */}
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <div className="font-medium">💡 Tips:</div>
          {activeTab === 'explain' && (
            <>
              <div>• Paste complete functions or classes for best results</div>
              <div>• Include context like imports or surrounding code</div>
            </>
          )}
          {activeTab === 'debug' && (
            <>
              <div>• Include the full error stacktrace</div>
              <div>• Mention what you expected vs what happened</div>
            </>
          )}
          {activeTab === 'test' && (
            <>
              <div>• Paste the function/class to test</div>
              <div>• Select your language and testing framework</div>
            </>
          )}
          <div className="pt-1 border-t border-gray-300 dark:border-gray-600 mt-2">⌨️ Press <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Cmd/Ctrl+Enter</kbd> to submit</div>
        </div>
      </div>
    </div>
  )
}
