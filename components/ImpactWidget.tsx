'use client'

import { useState, useEffect } from 'react'
import { ImpactMetrics, SessionSummary } from '@/types'
import { storageUtils } from '@/lib/localStorage'

interface ImpactWidgetProps {
  onSave: (metrics: Omit<ImpactMetrics, 'id' | 'timestamp'>) => void
  mode: ImpactMetrics['mode']
  intent: ImpactMetrics['intent']
}

export default function ImpactWidget({ onSave, mode, intent }: ImpactWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [confidenceBefore, setConfidenceBefore] = useState(50)
  const [confidenceAfter, setConfidenceAfter] = useState(50)
  const [clarityRating, setClarityRating] = useState(3)
  const [timeSaved, setTimeSaved] = useState(10)
  const [summary, setSummary] = useState<SessionSummary | null>(null)

  useEffect(() => {
    if (showSummary) {
      setSummary(storageUtils.getSessionSummary())
    }
  }, [showSummary])

  const handleSave = () => {
    const metrics: Omit<ImpactMetrics, 'id' | 'timestamp'> = {
      confidenceBefore,
      confidenceAfter,
      clarityRating,
      timeSavedMinutes: timeSaved,
      mode,
      intent
    }
    onSave(metrics)
    setIsOpen(false)
    // Reset for next time with optimistic defaults
    setConfidenceBefore(50)
    setConfidenceAfter(70) // Optimistic default
    setClarityRating(3)
    setTimeSaved(10)
  }

  if (showSummary && summary) {
    return (
      <div className="fixed bottom-6 right-6 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 z-50">
        <div className="px-4 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">📊</span>
              <h3 className="font-semibold">Session Impact</h3>
            </div>
            <button
              onClick={() => setShowSummary(false)}
              className="text-white hover:bg-white/20 rounded px-2 py-1"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Overall Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {summary.totalResponses}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Total Responses
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {summary.totalTimeSaved}m
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Time Saved
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Avg Confidence Gain</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                +{summary.avgConfidenceGain}%
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Avg Clarity Rating</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={star <= summary.avgClarityRating ? 'text-yellow-400' : 'text-gray-300'}>
                    ★
                  </span>
                ))}
                <span className="ml-1 text-gray-600 dark:text-gray-400">
                  {summary.avgClarityRating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Mode Breakdown */}
          <div>
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
              Mode Usage
            </div>
            <div className="space-y-1">
              {Object.entries(summary.modeBreakdown).map(([mode, count]) => (
                <div key={mode} className="flex items-center gap-2 text-sm">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full"
                      style={{ width: `${(count / summary.totalResponses) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 min-w-20">
                    {mode} ({count})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                storageUtils.clearSession()
                setSummary(storageUtils.getSessionSummary())
              }}
              className="flex-1 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              Reset Session
            </button>
            <button
              onClick={() => setShowSummary(false)}
              className="flex-1 px-3 py-2 text-sm bg-gradient-to-r from-green-500 to-teal-500 text-white rounded hover:from-green-600 hover:to-teal-600 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
        <button
          onClick={() => setShowSummary(true)}
          className="px-4 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
        >
          <span className="text-lg">📊</span>
          <span className="font-medium">View Impact</span>
        </button>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
        >
          <span className="text-lg">📈</span>
          <span className="font-medium">Rate Response</span>
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 z-50">
      <div className="px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📈</span>
            <h3 className="font-semibold">Rate This Response</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 rounded px-2 py-1"
          >
            ✕
          </button>
        </div>
        <p className="text-sm text-blue-100 mt-1">
          Help us measure real impact
        </p>
      </div>

      <div className="p-4 space-y-4">
        {/* Confidence Before */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Confidence Before (0-100)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="100"
              value={confidenceBefore}
              onChange={(e) => setConfidenceBefore(parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-lg font-semibold text-gray-700 dark:text-gray-300 min-w-12">
              {confidenceBefore}%
            </span>
          </div>
        </div>

        {/* Confidence After */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Confidence After (0-100)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="100"
              value={confidenceAfter}
              onChange={(e) => setConfidenceAfter(parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-lg font-semibold text-green-600 dark:text-green-400 min-w-12">
              {confidenceAfter}%
            </span>
          </div>
          {confidenceAfter > confidenceBefore && (
            <div className="mt-1 text-xs text-green-600 dark:text-green-400">
              ↑ +{confidenceAfter - confidenceBefore}% gain
            </div>
          )}
        </div>

        {/* Clarity Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Clarity Rating (1-5)
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => setClarityRating(rating)}
                className={`flex-1 py-2 rounded transition-all ${
                  clarityRating >= rating
                    ? 'bg-yellow-400 text-yellow-900'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Time Saved */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Time Saved (minutes)
          </label>
          <div className="flex gap-2">
            {[5, 10, 20].map((minutes) => (
              <button
                key={minutes}
                onClick={() => setTimeSaved(minutes)}
                className={`flex-1 py-2 px-4 rounded font-medium transition-all ${
                  timeSaved === minutes
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                {minutes}m
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all"
        >
          Save Metrics
        </button>
      </div>
    </div>
  )
}
