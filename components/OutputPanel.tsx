'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useTheme } from './ThemeProvider'

type OutputPanelProps = {
  content: string
  isLoading: boolean
}

export function OutputPanel({ content, isLoading }: OutputPanelProps) {
  const { theme } = useTheme()
  const wordCount = content ? content.split(/\s+/).filter(Boolean).length : 0

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-1 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Explanation</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI-powered adaptive learning
            </p>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500 font-mono">
            {wordCount > 0 && `${wordCount} words`}
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 custom-scrollbar">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-800"></div>
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-blue-600 absolute top-0 left-0"></div>
              </div>
              <p className="mt-6 text-gray-600 dark:text-gray-400 font-medium animate-pulse">⚒️ Forging understanding...</p>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">This may take a moment</p>
            </div>
          </div>
        ) : content ? (
          <div className="markdown-content prose dark:prose-invert max-w-none animate-fadeIn">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code: ({ inline, className, children, ...props }: any) => {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={theme === 'dark' ? vscDarkPlus : vs}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{
                        borderRadius: '0.75rem',
                        padding: '1.5rem',
                        fontSize: '0.875rem',
                      }}
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded-md text-sm font-mono" {...props}>
                      {children}
                    </code>
                  )
                }
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-600">
            <div className="text-center max-w-md">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-2xl rounded-full"></div>
                <svg className="w-20 h-20 mx-auto relative opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <p className="text-xl font-semibold mb-2 bg-gradient-to-r from-gray-700 to-gray-500 dark:from-gray-300 dark:to-gray-500 bg-clip-text text-transparent">Ready to forge understanding</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">Enter your code or question on the left to get started</p>
              <p className="text-xs text-gray-400 dark:text-gray-600 mt-4">✨ Adaptive explanations tailored to your level</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
