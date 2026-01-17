/**
 * API Contract Types
 * Strict types for POST /api/explain request/response + metadata schema
 * Enforces contract between client ↔ server; catches mismatches at compile-time
 */

import { Mode, Intent } from './index'

// ============ REQUEST ============

export interface ExplainRequest {
  input: string
  mode: Mode
  forceOffline?: boolean
  toolId?: string
  context?: Record<string, any>
  timebox?: Timebox
  perspective?: Perspective
  futureYou?: boolean
  stuckScore?: number
}

// ============ METADATA (embedded in streamed response) ============

export type Timebox = '30s' | '2m' | 'deep'
export type Perspective = 'story' | 'diagram' | 'code' | 'analogy' | 'math'

export interface ResponseMetadata {
  responseId: string
  timestamp: number
  topic: string
  trace: {
    intent: Intent
    pedagogy: Perspective
    timebox: Timebox
    cognitiveLoad: 'overwhelmed' | 'balanced' | 'speed' | 'mastery'
    futureYou: boolean
    omitted: string[]
    uncertainty: {
      isUncertain: boolean
      why?: string
      verifySteps?: string[]
    }
    clarifyingQuestionsAsked: string[]
    stuckInterventionApplied: boolean
  }
  practice?: {
    quickQuestions: Array<{ q: string; a: string }>
    miniTask?: { title: string; steps: string[] }
    codeExercise?: { prompt: string; starter: string; hint: string }
  }
  quiz?: {
    questions: Array<{ q: string; expectedKeywords: string[] }>
  }
}

// ============ RESPONSE ============

export interface ExplainResponse {
  type: 'content' | 'clarification'
  questions?: string[] // only if type === 'clarification'
  trace?: ResponseMetadata['trace']
}

// ============ HELPERS ============

export const DEFAULT_METADATA: ResponseMetadata = {
  responseId: '',
  timestamp: Date.now(),
  topic: 'unknown',
  trace: {
    intent: 'general',
    pedagogy: 'story',
    timebox: '2m',
    cognitiveLoad: 'balanced',
    futureYou: false,
    omitted: [],
    uncertainty: {
      isUncertain: false,
    },
    clarifyingQuestionsAsked: [],
    stuckInterventionApplied: false,
  },
}

export function createResponseMetadata(
  responseId: string,
  topic: string,
  overrides: Partial<ResponseMetadata> = {}
): ResponseMetadata {
  return {
    ...DEFAULT_METADATA,
    responseId,
    topic,
    timestamp: Date.now(),
    ...overrides,
  }
}
