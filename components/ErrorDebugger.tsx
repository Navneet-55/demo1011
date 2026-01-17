'use client';

import React, { useState } from 'react';
import { useErrorDebugger } from '@/contexts/ErrorDebuggerContext';
import { ERROR_SEVERITY_COLORS } from '@/types/error-debugger';
import type { ErrorAnalysis, ErrorSuggestion } from '@/types/error-debugger';

interface ErrorDebuggerProps {
  onDebug?: (error: ErrorAnalysis) => void;
}

export function ErrorDebugger({ onDebug }: ErrorDebuggerProps) {
  const { state, selectError, getFrequentErrors, updateError } = useErrorDebugger();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const currentError = state.currentError;
  const frequentErrors = getFrequentErrors(5);

  if (!currentError) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          Error Debugger
        </h3>
        
        {frequentErrors.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Recent Errors
            </p>
            {frequentErrors.map((error) => (
              <button
                key={error.id}
                onClick={() => selectError(error.id)}
                className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor:
                        ERROR_SEVERITY_COLORS[error.suggestions[0]?.severity || 'low'],
                    }}
                  />
                  <span className="font-medium text-sm text-gray-900 dark:text-white">
                    {error.parsedError.type}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                  {error.parsedError.message}
                </p>
              </button>
            ))}
          </div>
        )}

        {frequentErrors.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-center">
            <div className="text-gray-500 dark:text-gray-400">
              <svg
                className="w-12 h-12 mx-auto mb-3 opacity-50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4v2m0 0v2m0-6v-2m0-6h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm font-medium">No errors yet</p>
              <p className="text-xs mt-1">Errors will appear here when detected</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  const error = currentError;
  const firstSuggestion = error.suggestions[0];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                style={{
                  backgroundColor:
                    ERROR_SEVERITY_COLORS[firstSuggestion?.severity || 'low'],
                }}
              >
                {error.parsedError.type}
              </div>
              {error.frequency && error.frequency > 1 && (
                <div className="px-2 py-1 rounded bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-xs">
                  Seen {error.frequency}x
                </div>
              )}
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
              {firstSuggestion?.title || 'Error Detected'}
            </h4>
          </div>
          {error.resolved && (
            <div className="px-2 py-1 rounded bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs">
              ✓ Resolved
            </div>
          )}
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400">{error.parsedError.message}</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Root Location */}
        {error.parsedError.rootLocation && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <p className="text-xs font-semibold text-blue-900 dark:text-blue-200 mb-2">
              Root Location
            </p>
            <div className="space-y-1 text-xs text-blue-800 dark:text-blue-300">
              <p>
                <span className="font-mono">{error.parsedError.rootLocation.file}</span>
              </p>
              <p>
                Line {error.parsedError.rootLocation.line}
                {error.parsedError.rootLocation.column && `, Column ${error.parsedError.rootLocation.column}`}
              </p>
              {error.parsedError.rootLocation.functionName && (
                <p>
                  Function: <span className="font-mono">{error.parsedError.rootLocation.functionName}</span>
                </p>
              )}
            </div>
          </div>
        )}

        {/* Description */}
        {firstSuggestion?.description && (
          <div>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
              What Happened
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {firstSuggestion.description}
            </p>
          </div>
        )}

        {/* Fixes */}
        {firstSuggestion?.fixes && firstSuggestion.fixes.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
              How to Fix
            </p>
            <ol className="space-y-2 list-decimal list-inside text-sm text-gray-600 dark:text-gray-400">
              {firstSuggestion.fixes.map((fix, idx) => (
                <li key={idx}>{fix}</li>
              ))}
            </ol>
          </div>
        )}

        {/* Prevention */}
        {firstSuggestion?.prevention && firstSuggestion.prevention.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
              How to Prevent
            </p>
            <ul className="space-y-1">
              {firstSuggestion.prevention.map((prev, idx) => (
                <li key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                  • {prev}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Stack Trace */}
        {error.parsedError.stackTrace.length > 0 && (
          <div>
            <button
              onClick={() =>
                setExpandedId(expandedId === 'stack' ? null : 'stack')
              }
              className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide hover:text-gray-900 dark:hover:text-white"
            >
              <svg
                className={`w-4 h-4 transition-transform ${
                  expandedId === 'stack' ? 'rotate-90' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              Stack Trace ({error.parsedError.stackTrace.length})
            </button>
            
            {expandedId === 'stack' && (
              <div className="mt-2 bg-gray-900 dark:bg-gray-950 rounded-lg p-3 font-mono text-xs text-gray-300 space-y-1 max-h-40 overflow-y-auto">
                {error.parsedError.stackTrace.slice(0, 10).map((frame, idx) => (
                  <div key={idx} className="text-gray-400">
                    at <span className="text-blue-400">{frame.functionName}</span> (
                    <span className="text-yellow-400">{frame.file}</span>:
                    <span className="text-green-400">{frame.line}</span>)
                  </div>
                ))}
                {error.parsedError.stackTrace.length > 10 && (
                  <div className="text-gray-500">... and {error.parsedError.stackTrace.length - 10} more</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Related Topics */}
        {firstSuggestion?.relatedTopics && firstSuggestion.relatedTopics.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
              Learn More
            </p>
            <div className="flex flex-wrap gap-2">
              {firstSuggestion.relatedTopics.map((topic, idx) => (
                <div
                  key={idx}
                  className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                >
                  {topic}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
        <button
          onClick={() => updateError(error.id, { resolved: !error.resolved })}
          className="flex-1 px-3 py-2 text-sm rounded-lg font-medium transition-all"
          style={{
            backgroundColor: error.resolved
              ? '#dcfce7'
              : '#e5e7eb',
            color: error.resolved
              ? '#166534'
              : '#374151',
          }}
        >
          {error.resolved ? '✓ Marked Resolved' : 'Mark as Resolved'}
        </button>
      </div>
    </div>
  );
}
