/**
 * Stuck Detector
 * Pure function: analyzes session history, detects stuck patterns, computes stuckScore
 * Feature #8
 */

import { StuckSignal } from '@/types/learning-features'
import { CognitiveLoadMode } from '@/types'
import { STUCK_DETECTION, DEBUG_CONFIG } from '@/lib/constants'
import { isValidSignalsArray, isValidCognitiveLoadArray, isValidStringArray, clampScore } from '@/lib/validators'

interface StuckAnalysis {
  score: number // 0-100
  signals: StuckSignal[]
  isStuck: boolean
  suggestions: string[]
}

// Debug logger
const debugLog = (message: string, data?: any) => {
  if (DEBUG_CONFIG.LOG_STATE_CHANGES) {
    console.log(`[StuckDetector] ${message}`, data || '')
  }
}

/**
 * Analyze session signals to detect if user is stuck
 */
export function analyzeStuckState(
  signals: unknown,
  cognitiveLoadHistory: unknown,
  questionHistory: unknown
): StuckAnalysis {
  try {
    // Validate and normalize inputs with type guards
    const validSignals = isValidSignalsArray(signals) ? signals : []
    const validLoadHistory = isValidCognitiveLoadArray(cognitiveLoadHistory) ? cognitiveLoadHistory : []
    const validQuestions = isValidStringArray(questionHistory) ? questionHistory : []

    debugLog('Analyzing stuck state', { 
      signalsCount: validSignals.length,
      loadHistoryCount: validLoadHistory.length,
      questionsCount: validQuestions.length
    })

    let score = 0
    const suggestions: string[] = []

    // Recent signals carry more weight
    const recentSignals = validSignals.slice(-STUCK_DETECTION.RECENT_SIGNALS_COUNT)

    // Calculate severity score with type-safe access
    recentSignals.forEach((signal, index) => {
      try {
        if (!signal || typeof signal !== 'object') return

        const severity = (signal as any).severity
        const weight = {
          low: STUCK_DETECTION.SIGNAL_WEIGHT_LOW,
          medium: STUCK_DETECTION.SIGNAL_WEIGHT_MEDIUM,
          high: STUCK_DETECTION.SIGNAL_WEIGHT_HIGH,
        }[severity as string] || STUCK_DETECTION.SIGNAL_WEIGHT_LOW

        score += weight
        debugLog(`Applied weight for signal ${index}`, { severity, weight, totalScore: score })
      } catch (signalError) {
        debugLog(`Malformed signal at index ${index}`, signalError)
      }
    })

    // Check for repeated similar questions
    const recentQuestions = validQuestions.slice(-STUCK_DETECTION.RECENT_QUESTIONS_COUNT)
    if (recentQuestions.length > 0) {
      try {
        const questionSimilarity = calculateQuestionSimilarity(recentQuestions)
        if (questionSimilarity > STUCK_DETECTION.QUESTION_SIMILARITY_THRESHOLD) {
          score += STUCK_DETECTION.SIMILARITY_WEIGHT
          suggestions.push('Try a different perspective on the same topic')
          debugLog('Detected similar questions', { similarity: questionSimilarity })
        }
      } catch (similarityError) {
        debugLog('Error calculating question similarity', similarityError)
      }
    }

    // Check for repeated overwhelmed mode
    try {
      const recentOverwhelmed = validLoadHistory
        .slice(-STUCK_DETECTION.RECENT_LOAD_COUNT)
        .filter(m => m === 'overwhelmed').length
      
      if (recentOverwhelmed >= STUCK_DETECTION.OVERWHELMED_THRESHOLD) {
        score += STUCK_DETECTION.OVERWHELMED_WEIGHT
        suggestions.push('Switch to 30s timebox for ultra-fast explanations')
        debugLog('Detected repeated overwhelmed mode', { count: recentOverwhelmed })
      }
    } catch (loadError) {
      debugLog('Error checking overwhelmed mode', loadError)
    }

    // Check for low confidence pattern (inferred from repeated reread)
    try {
      const rereadCount = recentSignals.filter(s => {
        if (!s || typeof s !== 'object') return false
        return (s as any).type === 'reread'
      }).length || 0
      
      if (rereadCount >= STUCK_DETECTION.REREAD_THRESHOLD) {
        score += STUCK_DETECTION.REREAD_WEIGHT
        suggestions.push('Try a concrete example to clarify')
        debugLog('Detected repeated reread pattern', { count: rereadCount })
      }
    } catch (rereadError) {
      debugLog('Error checking reread pattern', rereadError)
    }

    // Safely clamp score to valid range
    const clampedScore = clampScore(score)
    const isStuck = clampedScore >= STUCK_DETECTION.STUCK_THRESHOLD

    debugLog('Analysis complete', { 
      finalScore: clampedScore, 
      isStuck,
      suggestionsCount: suggestions.length 
    })

    return {
      score: clampedScore,
      signals: recentSignals,
      isStuck,
      suggestions: isStuck ? suggestions : [],
    }
  } catch (error) {
    console.error('Critical error in analyzeStuckState:', error)
    // Always return valid default state
    return {
      score: STUCK_DETECTION.MIN_SCORE,
      signals: [],
      isStuck: false,
      suggestions: [],
    }
  }
}

/**
 * Simple similarity checker for questions (checks for repeated keywords)
 */
function calculateQuestionSimilarity(questions: string[]): number {
  try {
    if (!Array.isArray(questions) || questions.length < 2) return 0

    const words = questions.map(q => {
      if (typeof q !== 'string') return []
      return q.toLowerCase().split(/\s+/).filter(w => w.length > 3)
    })

    let totalSimilarity = 0
    let comparisons = 0

    for (let i = 0; i < words.length - 1; i++) {
      for (let j = i + 1; j < words.length; j++) {
        try {
          const overlap = words[i].filter(w => words[j]?.includes(w)).length
          const union = new Set([...words[i], ...(words[j] || [])]).size
          const similarity = union > 0 ? overlap / union : 0
          totalSimilarity += similarity
          comparisons++
        } catch (comparisonError) {
          debugLog('Error comparing questions', comparisonError)
        }
      }
    }

    return comparisons > 0 ? totalSimilarity / comparisons : 0
  } catch (error) {
    debugLog('Error calculating question similarity', error)
    return 0
  }
}

/**
 * Detect stuck from single action with type safety
 */
export function detectStuckSignal(
  action: 'question' | 'overwhelmed-click' | 'reread' | 'low-confidence',
  context?: Record<string, any>
): StuckSignal | null {
  try {
    const actionSeverityMap = {
      'question': 'low' as const,
      'overwhelmed-click': 'medium' as const,
      'reread': 'medium' as const,
      'low-confidence': 'high' as const,
    }

    const severity = actionSeverityMap[action]

    if (action === 'question' && context?.isRepeat === true) {
      return {
        type: 'repeated-question' as const,
        timestamp: Date.now(),
        severity: 'high' as const,
      }
    }

    if (action === 'overwhelmed-click') {
      return {
        type: 'overwhelmed-click' as const,
        timestamp: Date.now(),
        severity,
      }
    }

    if (action === 'reread') {
      return {
        type: 'reread' as const,
        timestamp: Date.now(),
        severity,
      }
    }

    if (action === 'low-confidence' && context?.confidence !== undefined) {
      const confidence = typeof context.confidence === 'number' ? context.confidence : 0
      if (confidence < 40) {
        return {
          type: 'low-confidence' as const,
          timestamp: Date.now(),
          severity: 'high' as const,
        }
      }
    }

    return null
  } catch (error) {
    debugLog('Error detecting stuck signal', error)
    return null
  }
}
