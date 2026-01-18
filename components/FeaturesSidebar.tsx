"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Chip } from '@/components/ui/primitives'
import type { CognitiveLoadMode } from '@/types'
import { useLearningSession } from '@/contexts/LearningSessionContext'

interface FeaturesSidebarProps {
  onOpenCommandPalette: () => void
  onOpenQuiz: () => void
  cognitiveLoad: CognitiveLoadMode
  onCycleCognitiveLoad: () => void
  onCycleTimebox: () => void
  onCyclePerspective: () => void
}

export function FeaturesSidebar({
  onOpenCommandPalette,
  onOpenQuiz,
  cognitiveLoad,
  onCycleCognitiveLoad,
  onCycleTimebox,
  onCyclePerspective,
}: FeaturesSidebarProps) {
  const { state, setFutureYou } = useLearningSession()

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="hidden lg:flex lg:flex-col lg:w-64 xl:w-72 bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl border-r border-white/50 dark:border-gray-800/70 p-4 gap-6 overflow-y-auto custom-scrollbar"
    >
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Features</h2>
        <p className="text-xs text-gray-600 dark:text-gray-400">Quick access to learning tools</p>
      </div>

      {/* Learning Actions */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Learning
        </h3>
        <div className="flex flex-col gap-2">
          <Chip size="sm" variant="glass" onClick={onOpenCommandPalette} className="w-full justify-start">
            📝 Explain selection
          </Chip>
          <Chip size="sm" variant="glass" onClick={onOpenCommandPalette} className="w-full justify-start">
            🔀 Compare concepts
          </Chip>
          <Chip size="sm" variant="glass" onClick={onOpenCommandPalette} className="w-full justify-start">
            🗺️ Learning path
          </Chip>
          <Chip size="sm" variant="glass" onClick={onOpenCommandPalette} className="w-full justify-start">
            🔍 Explain diff / PR
          </Chip>
          <Chip size="sm" variant="glass" onClick={onOpenQuiz} className="w-full justify-start">
            🧠 Start quiz
          </Chip>
        </div>
      </div>

      {/* Settings */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Settings
        </h3>
        <div className="flex flex-col gap-2">
          <Chip
            size="sm"
            variant={state.futureYou ? 'solid' : 'glass'}
            active={state.futureYou}
            onClick={() => setFutureYou(!state.futureYou)}
            className="w-full justify-start"
          >
            {state.futureYou ? '🚀' : '⏳'} Future-You
          </Chip>
          <Chip size="sm" variant="glass" onClick={onCyclePerspective} className="w-full justify-start">
            🎛️ Perspective: {state.perspective}
          </Chip>
          <Chip size="sm" variant="glass" onClick={onCycleTimebox} className="w-full justify-start">
            ⏱️ Timebox: {state.timebox}
          </Chip>
          <Chip size="sm" variant="glass" onClick={onCycleCognitiveLoad} className="w-full justify-start">
            🧠 Load: {cognitiveLoad}
          </Chip>
        </div>
      </div>

      {/* Memory */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Memory
        </h3>
        <div className="flex flex-col gap-2">
          <Chip size="sm" variant="glass" onClick={onOpenCommandPalette} className="w-full justify-start">
            📊 Open Vault
          </Chip>
        </div>
      </div>

      {/* Footer hint */}
      <div className="mt-auto pt-4 border-t border-white/40 dark:border-gray-800/70">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          💡 Press{' '}
          <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded text-xs">⌘K</kbd>
          {' '}for command palette
        </p>
      </div>
    </motion.aside>
  )
}
