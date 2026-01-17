/**
 * Learning Session Context
 * Holds: timebox, perspective, futureYou, stuckScore, sessionState
 * Replaces ad-hoc state; single DX for all features; localStorage sync
 */

'use client'

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import {
  LearningSessionState,
  DEFAULT_SESSION_STATE,
  MasteryRecord,
  StuckSignal,
  PracticeProgress,
  QuizResult,
} from '@/types/learning-features'
import { Timebox, Perspective } from '@/types/api-contract'
import { getStorageItem, setStorageItem } from '@/lib/storage-wrapper'

// ============ CONTEXT ============

interface LearningSessionContextType {
  state: LearningSessionState
  setTimebox: (timebox: Timebox) => void
  setPerspective: (perspective: Perspective) => void
  setFutureYou: (futureYou: boolean) => void
  setCurrentResponseId: (responseId: string) => void
  addStuckSignal: (signal: StuckSignal) => void
  setStuckScore: (score: number) => void
  clearStuckSignals: () => void
  addMasteryRecord: (record: MasteryRecord) => void
  addPracticeProgress: (progress: PracticeProgress) => void
  setLastQuizResult: (result: QuizResult) => void
  reset: () => void
}

const LearningSessionContext = createContext<LearningSessionContextType | null>(null)

// ============ REDUCER ============

type Action =
  | { type: 'SET_TIMEBOX'; payload: Timebox }
  | { type: 'SET_PERSPECTIVE'; payload: Perspective }
  | { type: 'SET_FUTURE_YOU'; payload: boolean }
  | { type: 'SET_RESPONSE_ID'; payload: string }
  | { type: 'ADD_STUCK_SIGNAL'; payload: StuckSignal }
  | { type: 'SET_STUCK_SCORE'; payload: number }
  | { type: 'CLEAR_STUCK_SIGNALS' }
  | { type: 'ADD_MASTERY'; payload: MasteryRecord }
  | { type: 'ADD_PRACTICE'; payload: PracticeProgress }
  | { type: 'SET_QUIZ_RESULT'; payload: QuizResult }
  | { type: 'INCREMENT_RESPONSE_COUNT' }
  | { type: 'RESET' }
  | { type: 'HYDRATE'; payload: Partial<LearningSessionState> }

function reducer(state: LearningSessionState, action: Action): LearningSessionState {
  switch (action.type) {
    case 'SET_TIMEBOX':
      return { ...state, timebox: action.payload }

    case 'SET_PERSPECTIVE':
      return { ...state, perspective: action.payload }

    case 'SET_FUTURE_YOU':
      return { ...state, futureYou: action.payload }

    case 'SET_RESPONSE_ID':
      return {
        ...state,
        currentResponseId: action.payload,
        responseCount: state.responseCount + 1,
      }

    case 'ADD_STUCK_SIGNAL':
      return {
        ...state,
        stuckState: {
          ...state.stuckState,
          signals: [...state.stuckState.signals, action.payload],
        },
      }

    case 'SET_STUCK_SCORE':
      return {
        ...state,
        stuckState: {
          ...state.stuckState,
          score: action.payload,
        },
      }

    case 'CLEAR_STUCK_SIGNALS':
      return {
        ...state,
        stuckState: {
          signals: [],
          score: 0,
          interventionShown: false,
        },
      }

    case 'ADD_MASTERY':
      return {
        ...state,
        masteryHistory: [...state.masteryHistory, action.payload],
      }

    case 'ADD_PRACTICE':
      return {
        ...state,
        practiceProgress: [...state.practiceProgress, action.payload],
      }

    case 'SET_QUIZ_RESULT':
      return {
        ...state,
        lastQuizResult: action.payload,
      }

    case 'INCREMENT_RESPONSE_COUNT':
      return {
        ...state,
        responseCount: state.responseCount + 1,
      }

    case 'RESET':
      return DEFAULT_SESSION_STATE

    case 'HYDRATE':
      return {
        ...state,
        ...action.payload,
      }

    default:
      return state
  }
}

// ============ PROVIDER ============

export interface LearningSessionProviderProps {
  children: ReactNode
}

export function LearningSessionProvider({ children }: LearningSessionProviderProps) {
  const [state, dispatch] = useReducer(reducer, DEFAULT_SESSION_STATE)

  // Persist preferences to localStorage
  useEffect(() => {
    setStorageItem('sessionPrefs', {
      lastTimebox: state.timebox,
      lastPerspective: state.perspective,
      lastFutureYou: state.futureYou,
    })
  }, [state.timebox, state.perspective, state.futureYou])

  // Persist mastery history
  useEffect(() => {
    setStorageItem('masteryHistory', state.masteryHistory)
  }, [state.masteryHistory])

  // Persist stuck score
  useEffect(() => {
    setStorageItem('stuckScore', state.stuckState.score)
  }, [state.stuckState.score])

  // Hydrate from localStorage on mount
  useEffect(() => {
    const prefs = getStorageItem('sessionPrefs')
    const history = getStorageItem('masteryHistory')
    const stuckScore = getStorageItem('stuckScore')

    const partial: Partial<LearningSessionState> = {}
    if (prefs) {
      partial.timebox = prefs.lastTimebox
      partial.perspective = prefs.lastPerspective
      partial.futureYou = prefs.lastFutureYou
    }
    if (history) {
      partial.masteryHistory = history as unknown as MasteryRecord[]
    }
    if (stuckScore !== null) {
      partial.stuckState = { ...state.stuckState, score: stuckScore }
    }

    if (Object.keys(partial).length > 0) {
      dispatch({ type: 'HYDRATE', payload: partial })
    }
  }, [])

  const value: LearningSessionContextType = {
    state,
    setTimebox: (timebox) => dispatch({ type: 'SET_TIMEBOX', payload: timebox }),
    setPerspective: (perspective) => dispatch({ type: 'SET_PERSPECTIVE', payload: perspective }),
    setFutureYou: (futureYou) => dispatch({ type: 'SET_FUTURE_YOU', payload: futureYou }),
    setCurrentResponseId: (responseId) => dispatch({ type: 'SET_RESPONSE_ID', payload: responseId }),
    addStuckSignal: (signal) => dispatch({ type: 'ADD_STUCK_SIGNAL', payload: signal }),
    setStuckScore: (score) => dispatch({ type: 'SET_STUCK_SCORE', payload: score }),
    clearStuckSignals: () => dispatch({ type: 'CLEAR_STUCK_SIGNALS' }),
    addMasteryRecord: (record) => dispatch({ type: 'ADD_MASTERY', payload: record }),
    addPracticeProgress: (progress) => dispatch({ type: 'ADD_PRACTICE', payload: progress }),
    setLastQuizResult: (result) => dispatch({ type: 'SET_QUIZ_RESULT', payload: result }),
    reset: () => dispatch({ type: 'RESET' }),
  }

  return (
    <LearningSessionContext.Provider value={value}>
      {children}
    </LearningSessionContext.Provider>
  )
}

// ============ HOOK ============

export function useLearningSession(): LearningSessionContextType {
  const ctx = useContext(LearningSessionContext)
  if (!ctx) {
    throw new Error('useLearningSession must be used within LearningSessionProvider')
  }
  return ctx
}
