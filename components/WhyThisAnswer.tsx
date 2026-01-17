'use client'

import { ExplanationTrace } from '@/types'
import { useState } from 'react'

interface WhyThisAnswerProps {
  trace: ExplanationTrace
}

export default function WhyThisAnswer({ trace }: WhyThisAnswerProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const formatIntent = (intent: string) => {
    const intentMap: Record<string, { icon: string; label: string }> = {
      learn: { icon: '📖', label: 'Learning' },
      debug: { icon: '🐛', label: 'Debugging' },
      docs: { icon: '📚', label: 'Documentation' },
      summarize: { icon: '📝', label: 'Summarizing' },
      test: { icon: '🧪', label: 'Testing' },
      general: { icon: '💬', label: 'General' }
    }
    return intentMap[intent] || intentMap.general
  }

  const formatResponseFormat = (format: string) => {
    const formatMap: Record<string, string> = {
      steps: 'Step-by-Step',
      bullets: 'Bullet Points',
      'code-first': 'Code Examples',
      analogy: 'With Analogies',
      structured: 'Structured Format'
    }
    return formatMap[format] || format
  }

  const intentInfo = formatIntent(trace.intent)

  return (
    <div className="mt-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        aria-expanded={isExpanded}
        aria-label="Toggle explanation details"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">🔍</span>
          <span className="font-medium text-gray-700 dark:text-gray-300">
            Why this answer?
          </span>
          {trace.guardrails?.uncertaintyFlag && (
            <span className="px-2 py-0.5 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full">
              ⚠️ Uncertain
            </span>
          )}
        </div>
        <span className="text-gray-500 dark:text-gray-400">
          {isExpanded ? '▼' : '▶'}
        </span>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 text-sm animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Mode */}
          <div className="flex items-center gap-2">
            <span className="text-gray-600 dark:text-gray-400 font-medium min-w-32">
              Learning Mode:
            </span>
            <span className="px-3 py-1 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-medium">
              {trace.mode === 'Beginner' && '🌱'}
              {trace.mode === 'Student' && '📚'}
              {trace.mode === 'Pro' && '💼'}
              {' '}{trace.mode}
            </span>
          </div>

          {/* Intent */}
          <div className="flex items-center gap-2">
            <span className="text-gray-600 dark:text-gray-400 font-medium min-w-32">
              Detected Intent:
            </span>
            <span className="px-3 py-1 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
              {intentInfo.icon} {intentInfo.label}
            </span>
          </div>

          {/* Response Format */}
          <div className="flex items-center gap-2">
            <span className="text-gray-600 dark:text-gray-400 font-medium min-w-32">
              Response Format:
            </span>
            <span className="px-3 py-1 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
              📋 {formatResponseFormat(trace.responseFormat)}
            </span>
          </div>

          {/* Guardrails */}
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="text-gray-600 dark:text-gray-400 font-medium mb-2">
              🛡️ Guardrails Applied:
            </div>
            <ul className="space-y-1.5 ml-4">
              <li className="flex items-start gap-2">
                <span className={trace.guardrails?.askedClarifyingQuestions ? 'text-green-500' : 'text-gray-400'}>
                  {trace.guardrails?.askedClarifyingQuestions ? '✅' : '⭕'}
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  Clarifying Questions
                  {trace.guardrails?.askedClarifyingQuestions && trace.guardrails?.questionsAsked && (
                    <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                      {trace.guardrails.questionsAsked.map((q, i) => (
                        <div key={i}>• {q}</div>
                      ))}
                    </div>
                  )}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className={trace.guardrails?.structuredOutputApplied ? 'text-green-500' : 'text-gray-400'}>
                  {trace.guardrails?.structuredOutputApplied ? '✅' : '⭕'}
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  Structured Output Format
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className={trace.guardrails?.uncertaintyFlag ? 'text-yellow-500' : 'text-green-500'}>
                  {trace.guardrails?.uncertaintyFlag ? '⚠️' : '✅'}
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  Confidence Check
                  {trace.guardrails?.uncertaintyFlag && trace.guardrails?.uncertaintyReason && (
                    <div className="mt-1 text-xs text-yellow-600 dark:text-yellow-400">
                      ⚠️ {trace.guardrails.uncertaintyReason}
                    </div>
                  )}
                </span>
              </li>
            </ul>
          </div>

          {/* Timestamp */}
          {trace.processingTimeMs && (
            <div className="pt-2 text-xs text-gray-500 dark:text-gray-400">
              ⏱️ Processed in {trace.processingTimeMs}ms
            </div>
          )}
        </div>
      )}
    </div>
  )
}
