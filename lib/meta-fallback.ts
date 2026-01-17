/**
 * Meta Fallback
 * Generate minimal valid metadata when parsing fails
 * UI always has data; no "undefined" crashes
 */

import { ResponseMetadata, DEFAULT_METADATA } from '@/types/api-contract'

/**
 * Generate a fallback metadata object with sensible defaults
 * Used when parsing fails or metadata is missing
 */
export function generateFallbackMetadata(
  responseId: string,
  topic: string = 'unknown'
): ResponseMetadata {
  return {
    ...DEFAULT_METADATA,
    responseId,
    topic,
    timestamp: Date.now(),
  }
}

/**
 * Merge partial metadata with defaults
 * Safe for incomplete objects from server
 */
export function mergeWithDefaults(
  partial: Partial<ResponseMetadata>,
  responseId: string
): ResponseMetadata {
  const fallback = generateFallbackMetadata(responseId)

  return {
    responseId: partial.responseId ?? fallback.responseId,
    timestamp: partial.timestamp ?? fallback.timestamp,
    topic: partial.topic ?? fallback.topic,
    trace: {
      intent: partial.trace?.intent ?? fallback.trace.intent,
      pedagogy: partial.trace?.pedagogy ?? fallback.trace.pedagogy,
      timebox: partial.trace?.timebox ?? fallback.trace.timebox,
      cognitiveLoad: partial.trace?.cognitiveLoad ?? fallback.trace.cognitiveLoad,
      futureYou: partial.trace?.futureYou ?? fallback.trace.futureYou,
      omitted: partial.trace?.omitted ?? fallback.trace.omitted,
      uncertainty: {
        isUncertain: partial.trace?.uncertainty?.isUncertain ?? false,
        why: partial.trace?.uncertainty?.why,
        verifySteps: partial.trace?.uncertainty?.verifySteps,
      },
      clarifyingQuestionsAsked:
        partial.trace?.clarifyingQuestionsAsked ?? fallback.trace.clarifyingQuestionsAsked,
      stuckInterventionApplied:
        partial.trace?.stuckInterventionApplied ?? fallback.trace.stuckInterventionApplied,
    },
    practice: partial.practice,
    quiz: partial.quiz,
  }
}
