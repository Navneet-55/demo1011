/**
 * Timebox Control
 * UI: 30s / 2m / Deep toggle; reads/writes to context + localStorage
 * Feature #4
 */

'use client'

import React, { memo } from 'react'
import { SegmentedControl } from '@/components/ui/index'
import { useLearningSession } from '@/contexts/LearningSessionContext'
import { Timebox } from '@/types'

export const TimeboxControl = memo(function TimeboxControl() {
  const { state, setTimebox } = useLearningSession()

  const options: Array<{ label: string; value: Timebox; icon: React.ReactNode }> = [
    { label: '30s', value: '30s', icon: '⚡' },
    { label: '2m', value: '2m', icon: '⏱️' },
    { label: 'Deep', value: 'deep', icon: '🔬' },
  ]

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
        Time Budget
      </label>
      <SegmentedControl
        options={options}
        value={state.timebox}
        onChange={setTimebox}
        size="md"
      />
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {state.timebox === '30s' && 'Ultra-fast, bite-sized explanations'}
        {state.timebox === '2m' && 'Balanced depth and speed'}
        {state.timebox === 'deep' && 'Comprehensive deep-dive analysis'}
      </p>
    </div>
  )
})
