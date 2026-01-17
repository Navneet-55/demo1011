'use client';

import React, { useState } from 'react';
import { useErrorDebugger } from '@/contexts/ErrorDebuggerContext';
import { parseErrorStack, generateErrorSuggestions } from '@/lib/errorAnalyzer';
import type { ErrorAnalysis, ErrorSuggestion } from '@/types/error-debugger';

export function ErrorInput() {
  const { addError } = useErrorDebugger();
  const [errorText, setErrorText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!errorText.trim()) return;

    setIsAnalyzing(true);
    try {
      // Parse the error
      const parsedError = parseErrorStack(errorText);
      
      // Generate suggestions
      const suggestions = generateErrorSuggestions(parsedError);
      
      // Create error suggestion object
      const suggestion: ErrorSuggestion = {
        id: `suggestion-${Date.now()}`,
        title: `${parsedError.type} Error`,
        description: parsedError.message,
        severity: getSeverityFromType(parsedError.type),
        fixes: suggestions.slice(0, 4),
        prevention: suggestions.slice(4),
        relatedTopics: getRelatedTopics(parsedError.type),
      };

      // Create error analysis
      const errorAnalysis: ErrorAnalysis = {
        id: `error-${Date.now()}`,
        timestamp: Date.now(),
        parsedError,
        suggestions: [suggestion],
        frequency: 1,
        resolved: false,
      };

      // Add to debugger
      addError(errorAnalysis);
      setErrorText('');
    } catch (error) {
      console.error('Failed to analyze error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Paste Error Message
        </label>
        <textarea
          value={errorText}
          onChange={(e) => setErrorText(e.target.value)}
          placeholder="Paste your error message, stack trace, or exception here..."
          className="w-full h-24 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <button
        onClick={handleAnalyze}
        disabled={!errorText.trim() || isAnalyzing}
        className="w-full px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all"
      >
        {isAnalyzing ? 'Analyzing...' : '🔍 Analyze Error'}
      </button>
    </div>
  );
}

function getSeverityFromType(
  type: string
): 'critical' | 'high' | 'medium' | 'low' {
  if (type === 'SyntaxError') return 'critical';
  if (type === 'TypeError' || type === 'ReferenceError') return 'high';
  if (type === 'RangeError') return 'medium';
  return 'low';
}

function getRelatedTopics(errorType: string): string[] {
  const topics: Record<string, string[]> = {
    TypeError: [
      'Null/Undefined checks',
      'Optional chaining',
      'Type guards',
      'Error handling',
    ],
    ReferenceError: [
      'Variable scope',
      'Hoisting',
      'Module imports',
      'Declaration order',
    ],
    SyntaxError: [
      'JavaScript syntax',
      'ES6+ features',
      'Bracket matching',
      'Arrow functions',
    ],
    RangeError: [
      'Array indexing',
      'Recursion limits',
      'Numeric ranges',
      'Loop conditions',
    ],
  };

  return topics[errorType] || ['Error handling', 'Debugging', 'Best practices'];
}
