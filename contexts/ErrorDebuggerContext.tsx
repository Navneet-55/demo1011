'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ErrorAnalysis, ErrorDebuggerState, ErrorPattern } from '@/types/error-debugger';

interface ErrorDebuggerContextType {
  state: ErrorDebuggerState;
  addError: (error: ErrorAnalysis) => void;
  selectError: (errorId: string | null) => void;
  clearHistory: () => void;
  getErrorPatterns: () => ErrorPattern[];
  getFrequentErrors: (limit?: number) => ErrorAnalysis[];
  updateError: (errorId: string, updates: Partial<ErrorAnalysis>) => void;
}

const ErrorDebuggerContext = createContext<ErrorDebuggerContextType | undefined>(undefined);

const STORAGE_KEY = 'gyaanforge_error_history';
const MAX_ERROR_HISTORY = 50;

export function ErrorDebuggerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ErrorDebuggerState>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          return {
            currentError: parsed.currentError || null,
            errorHistory: parsed.errorHistory || [],
            errorPatterns: parsed.errorPatterns || [],
            selectedErrorId: null,
          };
        }
      } catch (error) {
        console.error('Failed to load error history:', error);
      }
    }
    return {
      currentError: null,
      errorHistory: [],
      errorPatterns: [],
      selectedErrorId: null,
    };
  });

  // Persist to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && (state.errorHistory.length > 0 || state.currentError)) {
      try {
        const toStore = {
          currentError: state.currentError,
          errorHistory: state.errorHistory.slice(-MAX_ERROR_HISTORY),
          errorPatterns: state.errorPatterns,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
      } catch (error) {
        console.error('Failed to save error history:', error);
      }
    }
  }, [state.errorHistory, state.currentError, state.errorPatterns]);

  const addError = useCallback((error: ErrorAnalysis) => {
    setState((prev) => {
      // Check if this error type already exists in patterns
      const existingPattern = prev.errorPatterns.find(
        (p) => p.errorType === error.parsedError.type
      );

      const newPatterns = existingPattern
        ? prev.errorPatterns.map((p) =>
            p.errorType === error.parsedError.type
              ? {
                  ...p,
                  count: p.count + 1,
                  lastSeen: error.timestamp,
                }
              : p
          )
        : [
            ...prev.errorPatterns,
            {
              errorType: error.parsedError.type,
              count: 1,
              firstSeen: error.timestamp,
              lastSeen: error.timestamp,
            },
          ];

      return {
        ...prev,
        currentError: error,
        errorHistory: [error, ...prev.errorHistory].slice(0, MAX_ERROR_HISTORY),
        errorPatterns: newPatterns,
        selectedErrorId: error.id,
      };
    });
  }, []);

  const selectError = useCallback((errorId: string | null) => {
    setState((prev) => ({
      ...prev,
      selectedErrorId: errorId,
      currentError: errorId
        ? prev.errorHistory.find((e) => e.id === errorId) || null
        : null,
    }));
  }, []);

  const clearHistory = useCallback(() => {
    setState({
      currentError: null,
      errorHistory: [],
      errorPatterns: [],
      selectedErrorId: null,
    });
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const getErrorPatterns = useCallback((): ErrorPattern[] => {
    return state.errorPatterns.sort((a, b) => b.count - a.count);
  }, [state.errorPatterns]);

  const getFrequentErrors = useCallback(
    (limit: number = 5): ErrorAnalysis[] => {
      const patternMap = new Map<string, number>();
      state.errorHistory.forEach((error) => {
        const key = error.parsedError.type;
        patternMap.set(key, (patternMap.get(key) || 0) + 1);
      });

      const sorted = Array.from(patternMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([type]) => type);

      return state.errorHistory
        .filter((e) => sorted.includes(e.parsedError.type))
        .slice(0, limit);
    },
    [state.errorHistory]
  );

  const updateError = useCallback((errorId: string, updates: Partial<ErrorAnalysis>) => {
    setState((prev) => ({
      ...prev,
      errorHistory: prev.errorHistory.map((e) =>
        e.id === errorId ? { ...e, ...updates } : e
      ),
      currentError:
        prev.currentError?.id === errorId
          ? { ...prev.currentError, ...updates }
          : prev.currentError,
    }));
  }, []);

  return (
    <ErrorDebuggerContext.Provider
      value={{
        state,
        addError,
        selectError,
        clearHistory,
        getErrorPatterns,
        getFrequentErrors,
        updateError,
      }}
    >
      {children}
    </ErrorDebuggerContext.Provider>
  );
}

export function useErrorDebugger() {
  const context = useContext(ErrorDebuggerContext);
  if (context === undefined) {
    throw new Error('useErrorDebugger must be used within an ErrorDebuggerProvider');
  }
  return context;
}
