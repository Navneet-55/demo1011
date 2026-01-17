/**
 * Practice Panel
 * Tab in right drawer; renders quick Q/A, mini-tasks, code exercises from metadata
 * Feature #6
 */

'use client'

import React, { useState } from 'react'
import { ResponseMetadata } from '@/types/api-contract'

interface PracticePanelProps {
  metadata: ResponseMetadata | null
}

export function PracticePanel({ metadata }: PracticePanelProps) {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set())
  const [taskChecked, setTaskChecked] = useState<boolean[]>([])

  if (!metadata || !metadata.practice) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <div className="text-4xl mb-2">🎯</div>
        <p className="text-sm">No practice exercises available</p>
        <p className="text-xs mt-1">Submit a query to generate practice</p>
      </div>
    )
  }

  // Safety checks for practice data
  const { practice } = metadata
  if (!practice || typeof practice !== 'object') {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <p className="text-sm">Invalid practice data</p>
      </div>
    )
  }

  const toggleQuestion = (index: number) => {
    const newExpanded = new Set(expandedQuestions)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedQuestions(newExpanded)
  }

  const toggleTaskStep = (index: number) => {
    const newChecked = [...taskChecked]
    newChecked[index] = !newChecked[index]
    setTaskChecked(newChecked)
  }

  return (
    <div className="space-y-6">
      {/* Quick Questions */}
      {practice.quickQuestions && practice.quickQuestions.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>💭</span>
            Quick Questions
          </h3>
          <div className="space-y-2">
            {practice.quickQuestions.map((item, i) => (
              <div
                key={i}
                className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleQuestion(i)}
                  className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-start gap-3"
                >
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    {i + 1}.
                  </span>
                  <span className="flex-1 text-sm text-slate-700 dark:text-slate-300">
                    {item.q}
                  </span>
                  <span className="text-slate-400">
                    {expandedQuestions.has(i) ? '▼' : '▶'}
                  </span>
                </button>
                {expandedQuestions.has(i) && (
                  <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      <span className="font-medium text-blue-600 dark:text-blue-400">
                        Answer:
                      </span>{' '}
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mini Task */}
      {practice.miniTask && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>✅</span>
            Mini Task
          </h3>
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-3">
              {practice.miniTask.title}
            </h4>
            <div className="space-y-2">
              {practice.miniTask.steps.map((step, i) => (
                <label
                  key={i}
                  className="flex items-start gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={taskChecked[i] || false}
                    onChange={() => toggleTaskStep(i)}
                    className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span
                    className={`text-sm ${
                      taskChecked[i]
                        ? 'line-through text-slate-400'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {step}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Code Exercise */}
      {practice.codeExercise && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>💻</span>
            Code Exercise
          </h3>
          <div className="space-y-3">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase mb-2">
                Prompt
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                {practice.codeExercise.prompt}
              </p>
            </div>
            
            <div className="bg-slate-900 dark:bg-slate-950 rounded-lg p-4">
              <h4 className="text-xs font-medium text-slate-400 uppercase mb-2">
                Starter Code
              </h4>
              <pre className="text-xs text-slate-200 dark:text-slate-300 font-mono overflow-x-auto">
                {practice.codeExercise.starter}
              </pre>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <h4 className="text-xs font-medium text-yellow-800 dark:text-yellow-300 uppercase mb-2">
                💡 Hint
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                {practice.codeExercise.hint}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
