/**
 * Meta Validation
 * Runtime validators (no heavy deps; pure TS functions)
 * Fail-safe: validate before using; log/ignore invalid fields
 */

import { ResponseMetadata, Timebox, Perspective } from '@/types/api-contract'

type ValidationResult<T> = { valid: true; data: T } | { valid: false; reason: string }

function isString(val: unknown): val is string {
  return typeof val === 'string'
}

function isNumber(val: unknown): val is number {
  return typeof val === 'number'
}

function isBoolean(val: unknown): val is boolean {
  return typeof val === 'boolean'
}

function isArray<T>(val: unknown): val is T[] {
  return Array.isArray(val)
}

function isRecord(val: unknown): val is Record<string, any> {
  return typeof val === 'object' && val !== null && !Array.isArray(val)
}

function isOneOf<T extends readonly unknown[]>(
  val: unknown,
  options: T
): val is T[number] {
  return options.includes(val)
}

// Validators for enums
const VALID_INTENTS = [
  'learn',
  'debug',
  'docs',
  'summarize',
  'practice',
  'test',
  'general',
] as const
const VALID_PERSPECTIVES = ['story', 'diagram', 'code', 'analogy', 'math'] as const
const VALID_TIMEBOXES = ['30s', '2m', 'deep'] as const
const VALID_COGNITIVE_LOADS = [
  'overwhelmed',
  'balanced',
  'speed',
  'mastery',
] as const

/**
 * Validate Timebox enum
 */
export function validateTimebox(val: unknown): ValidationResult<Timebox> {
  if (isOneOf(val, VALID_TIMEBOXES)) {
    return { valid: true, data: val }
  }
  return { valid: false, reason: `Invalid timebox: ${val}` }
}

/**
 * Validate Perspective enum
 */
export function validatePerspective(val: unknown): ValidationResult<Perspective> {
  if (isOneOf(val, VALID_PERSPECTIVES)) {
    return { valid: true, data: val }
  }
  return { valid: false, reason: `Invalid perspective: ${val}` }
}

/**
 * Validate trace object (nested)
 */
export function validateTrace(
  val: unknown
): ValidationResult<ResponseMetadata['trace']> {
  if (!isRecord(val)) {
    return { valid: false, reason: 'Trace is not an object' }
  }

  // Validate required fields
  if (
    !isOneOf(val.intent, VALID_INTENTS) ||
    !isOneOf(val.pedagogy, VALID_PERSPECTIVES) ||
    !isOneOf(val.timebox, VALID_TIMEBOXES) ||
    !isOneOf(val.cognitiveLoad, VALID_COGNITIVE_LOADS) ||
    !isBoolean(val.futureYou) ||
    !isArray(val.omitted) ||
    !isRecord(val.uncertainty) ||
    !isBoolean(val.uncertainty.isUncertain) ||
    !isArray(val.clarifyingQuestionsAsked)
  ) {
    return { valid: false, reason: 'Trace fields are invalid or missing' }
  }

  return {
    valid: true,
    data: {
      intent: val.intent as ResponseMetadata['trace']['intent'],
      pedagogy: val.pedagogy,
      timebox: val.timebox,
      cognitiveLoad: val.cognitiveLoad as ResponseMetadata['trace']['cognitiveLoad'],
      futureYou: val.futureYou,
      omitted: val.omitted as string[],
      uncertainty: {
        isUncertain: val.uncertainty.isUncertain,
        why: val.uncertainty.why,
        verifySteps: val.uncertainty.verifySteps,
      },
      clarifyingQuestionsAsked: val.clarifyingQuestionsAsked as string[],
      stuckInterventionApplied: val.stuckInterventionApplied || false,
    },
  }
}

/**
 * Validate full metadata
 */
export function validateMetadata(val: unknown): ValidationResult<ResponseMetadata> {
  if (!isRecord(val)) {
    return { valid: false, reason: 'Metadata is not an object' }
  }

  if (!isString(val.responseId) || !val.responseId) {
    return { valid: false, reason: 'Invalid responseId' }
  }

  if (!isNumber(val.timestamp)) {
    return { valid: false, reason: 'Invalid timestamp' }
  }

  if (!isString(val.topic) || !val.topic) {
    return { valid: false, reason: 'Invalid topic' }
  }

  const traceResult = validateTrace(val.trace)
  if (!traceResult.valid) {
    return traceResult as ValidationResult<ResponseMetadata>
  }

  return {
    valid: true,
    data: {
      responseId: val.responseId,
      timestamp: val.timestamp,
      topic: val.topic,
      trace: traceResult.data,
      practice: val.practice || undefined,
      quiz: val.quiz || undefined,
    },
  }
}

/**
 * Safe metadata validator: returns data or null
 */
export function safeParseMeta(
  data: unknown
): ResponseMetadata | null {
  const result = validateMetadata(data)
  if (!result.valid) {
    console.warn('Meta validation failed:', result.reason)
    return null
  }
  return result.data
}
