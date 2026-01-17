/**
 * Stuck Intervention Banner
 * Sticky banner when stuckScore > threshold; non-intrusive suggestions
 * Feature #8
 */

'use client'

import React from 'react'

interface StuckInterventionBannerProps {
  score: number
  suggestions: string[]
  onDismiss: () => void
}

export function StuckInterventionBanner({
  score,
  suggestions,
  onDismiss,
}: StuckInterventionBannerProps) {
  if (score < 50 || suggestions.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 max-w-2xl w-full mx-4">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg shadow-2xl p-4 text-white">
        <div className="flex items-start gap-4">
          <div className="text-3xl">🤔</div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">
                Stuck? Let&apos;s try a different approach
              </h4>
              <button
                onClick={onDismiss}
                className="text-white hover:text-orange-100 transition-colors"
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>
            <p className="text-sm opacity-90">
              I noticed you might be having difficulty. Here are some suggestions:
            </p>
            <ul className="space-y-1">
              {suggestions.map((suggestion, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="text-yellow-200">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3 bg-white/20 rounded-full h-1 overflow-hidden">
          <div
            className="bg-white h-full transition-all duration-500"
            style={{ width: `${score}%` }}
          />
        </div>
        <p className="text-xs text-white/70 mt-1 text-right">
          Stuck score: {score}/100
        </p>
      </div>
    </div>
  )
}
