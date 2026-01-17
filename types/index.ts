export type Mode = 'Beginner' | 'Student' | 'Pro'

export type Intent = 'learn' | 'debug' | 'docs' | 'summarize' | 'test' | 'general'

export type ResponseFormat = 'steps' | 'bullets' | 'code-first' | 'analogy' | 'structured'

export type CognitiveLoadMode = 'overwhelmed' | 'balanced' | 'speed' | 'mastery'

export interface ExplanationTrace {
  mode: Mode
  intent: Intent
  responseFormat: ResponseFormat
  guardrails: {
    askedClarifyingQuestions: boolean
    questionsAsked?: string[]
    uncertaintyFlag: boolean
    uncertaintyReason?: string
    structuredOutputApplied: boolean
  }
  timestamp: number
  processingTimeMs?: number
}

export interface ImpactMetrics {
  id: string
  timestamp: number
  confidenceBefore: number // 0-100
  confidenceAfter: number // 0-100
  clarityRating: number // 1-5
  timeSavedMinutes: number // 5, 10, or 20
  mode: Mode
  intent: Intent
}

export interface Tool {
  id: string
  label: string
  description: string
  icon: string
  buildPrompt: (input: string, mode: Mode, context?: any) => string
  parseTrace?: (output: string) => Partial<ExplanationTrace>
  requiresClarification?: (input: string) => string[] | null
}

export interface SessionSummary {
  totalResponses: number
  avgConfidenceGain: number
  avgClarityRating: number
  totalTimeSaved: number
  modeBreakdown: Record<Mode, number>
  intentBreakdown: Record<Intent, number>
}
