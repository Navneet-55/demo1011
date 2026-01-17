/**
 * Perspective Control
 * UI: Story / Diagram / Code / Analogy / Math selector; reads/writes to context
 * Feature #5
 */

'use client'

import React, { memo } from 'react'
import { SegmentedControl } from '@/components/ui/index'
import { useLearningSession } from '@/contexts/LearningSessionContext'
import { Perspective } from '@/types'

export const PerspectiveControl = memo(function PerspectiveControl() {
  const { state, setPerspective } = useLearningSession()

  const options: Array<{ label: string; value: Perspective; icon: React.ReactNode }> = [
    { label: 'Story', value: 'story', icon: '📖' },
    { label: 'Diagram', value: 'diagram', icon: '📊' },
    { label: 'Code', value: 'code', icon: '💻' },
    { label: 'Analogy', value: 'analogy', icon: '🔗' },
    { label: 'Math', value: 'math', icon: '🔢' },
  ]

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
        Perspective
      </label>
      <div className="overflow-x-auto">
        <SegmentedControl
          options={options}
          value={state.perspective}
          onChange={setPerspective}
          size="sm"
        />
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {state.perspective === 'story' && 'Narrative-driven with context and flow'}
        {state.perspective === 'diagram' && 'Visual descriptions and structure'}
        {state.perspective === 'code' && 'Code-first with implementation details'}
        {state.perspective === 'analogy' && 'Real-world comparisons and metaphors'}
        {state.perspective === 'math' && 'Mathematical notation and formulas'}
      </p>
    </div>
  )
})
