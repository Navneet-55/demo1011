/**
 * Learning Features Types
 * Types for Timebox, Perspective, FutureYou, StuckState, MasteryRecord, Practice, Quiz
 * Single source of truth for all feature #4–#10 shapes
 */

import { Timebox, Perspective } from './api-contract'

// ============ MASTERY TRACKING ============

export interface MasteryRecord {
  topic: string
  score: number // 0-100
  date: string // ISO 8601
  sessionId: string
}

export interface MasteryRecordStorage extends Omit<MasteryRecord, 'sessionId'> {
  sessionId?: string
}

// ============ STUCK STATE ============

export interface StuckSignal {
  type: 'repeated-question' | 'low-confidence' | 'overwhelmed-click' | 'reread'
  timestamp: number
  severity: 'low' | 'medium' | 'high'
}

export interface StuckState {
  signals: StuckSignal[]
  score: number // 0-100
  interventionShown: boolean
  lastInterventionTime?: number
}

// ============ PRACTICE ============

export interface QuickQuestion {
  q: string
  a: string
  id?: string
}

export interface MiniTask {
  title: string
  steps: string[]
}

export interface CodeExercise {
  prompt: string
  starter: string
  hint: string
  solution?: string
}

export interface PracticeSet {
  responseId: string
  topic: string
  quickQuestions?: QuickQuestion[]
  miniTask?: MiniTask
  codeExercise?: CodeExercise
  completed: boolean
  completedAt?: number
}

export interface PracticeProgress {
  practiceId: string
  responseId: string
  questionsAnswered: boolean[]
  taskCompleted: boolean
  exerciseSubmitted: boolean
  submittedCode?: string
}

// ============ QUIZ (REVERSE TEACHING) ============

export interface QuizQuestion {
  q: string
  expectedKeywords: string[]
}

export interface QuizAttempt {
  questionIndex: number
  userAnswer: string
  correct: boolean
  feedback: string
}

export interface QuizResult {
  responseId: string
  topic: string
  questions: QuizQuestion[]
  attempts: QuizAttempt[]
  masteryScore: number // 0-100
  misconceptions: string[]
  nextSteps: string[]
  timestamp: number
}

// ============ SESSION STATE ============

export interface LearningSessionState {
  timebox: Timebox
  perspective: Perspective
  futureYou: boolean
  currentResponseId: string | null
  stuckState: StuckState
  masteryHistory: MasteryRecord[]
  practiceProgress: PracticeProgress[]
  lastQuizResult: QuizResult | null
  sessionStartTime: number
  responseCount: number
}

export const DEFAULT_SESSION_STATE: LearningSessionState = {
  timebox: '2m',
  perspective: 'story',
  futureYou: false,
  currentResponseId: null,
  stuckState: {
    signals: [],
    score: 0,
    interventionShown: false,
  },
  masteryHistory: [],
  practiceProgress: [],
  lastQuizResult: null,
  sessionStartTime: Date.now(),
  responseCount: 0,
}
