/**
 * Future-You Toggle
 * UI: checkbox toggle; reads/writes to context
 * Feature #10
 */

'use client'

import React, { memo } from 'react'
import { useLearningSession } from '@/contexts/LearningSessionContext'

export const FutureYouToggle = memo(function FutureYouToggle() {
  const { state, setFutureYou } = useLearningSession()

  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-3 cursor-pointer group">
        <div className="relative">
          <input
            type="checkbox"
            checked={state.futureYou}
            onChange={(e) => setFutureYou(e.target.checked)}
            className="sr-only peer"
            aria-label="Toggle Future-You mode"
          />
          <div className="w-11 h-6 bg-slate-300 dark:bg-slate-600 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-500 transition-all"></div>
          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow-sm"></div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Future-You Mode
            </span>
            <span className="text-lg">{state.futureYou ? '🚀' : '⏳'}</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {state.futureYou
              ? 'Speaking as you in 6 months, teaching past-you'
              : 'Standard explanation mode'}
          </p>
        </div>
      </label>
    </div>
  )
})
