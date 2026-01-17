/**
 * Trace Panel
 * Tab in right drawer; displays parsed trace metadata
 * Feature #9
 */

'use client'

import React, { memo } from 'react'
import { ResponseMetadata } from '@/types/api-contract'
import { Badge } from '@/components/ui/index'

interface TracePanelProps {
  metadata: ResponseMetadata | null
}

export const TracePanel = memo(function TracePanel({ metadata }: TracePanelProps) {
  if (!metadata) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <div className="text-4xl mb-2">🔍</div>
        <p className="text-sm">No trace data available</p>
        <p className="text-xs mt-1">Submit a query to see analysis</p>
      </div>
    )
  }

  // Safety check for metadata structure
  if (!metadata.trace || typeof metadata.trace !== 'object') {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <p className="text-sm">Invalid trace data</p>
      </div>
    )
  }

  const { trace, topic, timestamp } = metadata

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Why This Answer?
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Topic: <span className="font-medium">{topic}</span>
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Time: {new Date(timestamp).toLocaleString()}
        </p>
      </div>

      {/* Intent */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Detected Intent
        </h4>
        <Badge
          label={trace.intent}
          variant={
            trace.intent === 'learn'
              ? 'primary'
              : trace.intent === 'debug'
              ? 'error'
              : trace.intent === 'practice'
              ? 'success'
              : 'neutral'
          }
          icon={
            trace.intent === 'learn'
              ? '📚'
              : trace.intent === 'debug'
              ? '🐛'
              : trace.intent === 'practice'
              ? '🎯'
              : trace.intent === 'test'
              ? '✅'
              : '💡'
          }
        />
      </div>

      {/* Pedagogy */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Teaching Approach
        </h4>
        <div className="flex gap-2 flex-wrap">
          <Badge label={`Pedagogy: ${trace.pedagogy}`} variant="primary" />
          <Badge label={`Timebox: ${trace.timebox}`} variant="neutral" />
          <Badge label={`Load: ${trace.cognitiveLoad}`} variant="neutral" />
          {trace.futureYou && <Badge label="Future-You 🚀" variant="success" />}
        </div>
      </div>

      {/* Uncertainty */}
      {trace.uncertainty.isUncertain && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
          <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300 flex items-center gap-2">
            ⚠️ Uncertainty Flagged
          </h4>
          {trace.uncertainty.why && (
            <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
              {trace.uncertainty.why}
            </p>
          )}
          {trace.uncertainty.verifySteps && trace.uncertainty.verifySteps.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-medium text-yellow-800 dark:text-yellow-300">
                Verify:
              </p>
              <ul className="text-xs text-yellow-700 dark:text-yellow-400 mt-1 space-y-1">
                {trace.uncertainty.verifySteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span>•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Omitted Info */}
      {trace.omitted.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Intentionally Omitted
          </h4>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            {trace.omitted.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span>•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Clarifying Questions */}
      {trace.clarifyingQuestionsAsked.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Clarifying Questions Asked
          </h4>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            {trace.clarifyingQuestionsAsked.map((q, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-blue-500">?</span>
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Stuck Intervention */}
      {trace.stuckInterventionApplied && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <p className="text-xs font-medium text-blue-800 dark:text-blue-300 flex items-center gap-2">
            💡 Stuck intervention applied
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
            Modified approach to help you progress
          </p>
        </div>
      )}
    </div>
  )
})
