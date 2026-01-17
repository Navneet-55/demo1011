/**
 * Stuck Detector
 * Pure function: analyzes session history, detects stuck patterns, computes stuckScore
 * Feature #8
 */

import { StuckSignal } from '@/types/learning-features'
import { CognitiveLoadMode } from '@/types'

interface StuckAnalysis {
  score: number // 0-100
  signals: StuckSignal[]
  isStuck: boolean
  suggestions: string[]
}

/**
 * Analyze session signals to detect if user is stuck
 */
export function analyzeStuckState(
  signals: StuckSignal[],
  cognitiveLoadHistory: CognitiveLoadMode[],
  questionHistory: string[]
): StuckAnalysis {
  let score = 0
  const suggestions: string[] = []
  
  // Recent signals carry more weight
  const recentSignals = signals.slice(-10)
  
  // Calculate severity score
  recentSignals.forEach((signal) => {
    const weight = {
      low: 5,
      medium: 10,
      high: 20,
    }[signal.severity]
    
    score += weight
  })
  
  // Check for repeated similar questions
  const recentQuestions = questionHistory.slice(-5)
  const questionSimilarity = calculateQuestionSimilarity(recentQuestions)
  if (questionSimilarity > 0.7) {
    score += 25
    suggestions.push('Try a different perspective on the same topic')
  }
  
  // Check for repeated overwhelmed mode
  const recentOverwhelmed = cognitiveLoadHistory.slice(-5).filter(m => m === 'overwhelmed').length
  if (recentOverwhelmed >= 3) {
    score += 20
    suggestions.push('Switch to 30s timebox for ultra-fast explanations')
  }
  
  // Check for low confidence pattern (inferred from repeated reread)
  const rereadCount = recentSignals.filter(s => s.type === 'reread').length
  if (rereadCount >= 3) {
    score += 15
    suggestions.push('Try a concrete example to clarify')
  }
  
  // Cap at 100
  score = Math.min(score, 100)
  
  const isStuck = score >= 50
  
  return {
    score,
    signals: recentSignals,
    isStuck,
    suggestions: isStuck ? suggestions : [],
  }
}

/**
 * Simple similarity checker for questions (checks for repeated keywords)
 */
function calculateQuestionSimilarity(questions: string[]): number {
  if (questions.length < 2) return 0
  
  const words = questions.map(q => 
    q.toLowerCase().split(/\s+/).filter(w => w.length > 3)
  )
  
  let totalSimilarity = 0
  let comparisons = 0
  
  for (let i = 0; i < words.length - 1; i++) {
    for (let j = i + 1; j < words.length; j++) {
      const overlap = words[i].filter(w => words[j].includes(w)).length
      const union = new Set([...words[i], ...words[j]]).size
      const similarity = union > 0 ? overlap / union : 0
      totalSimilarity += similarity
      comparisons++
    }
  }
  
  return comparisons > 0 ? totalSimilarity / comparisons : 0
}

/**
 * Detect stuck from single action
 */
export function detectStuckSignal(
  action: 'question' | 'overwhelmed-click' | 'reread' | 'low-confidence',
  context?: any
): StuckSignal | null {
  const severity = {
    'question': 'low',
    'overwhelmed-click': 'medium',
    'reread': 'medium',
    'low-confidence': 'high',
  }[action] as 'low' | 'medium' | 'high'
  
  if (action === 'question' && context?.isRepeat) {
    return {
      type: 'repeated-question',
      timestamp: Date.now(),
      severity: 'high',
    }
  }
  
  if (action === 'overwhelmed-click') {
    return {
      type: 'overwhelmed-click',
      timestamp: Date.now(),
      severity,
    }
  }
  
  if (action === 'reread') {
    return {
      type: 'reread',
      timestamp: Date.now(),
      severity,
    }
  }
  
  if (action === 'low-confidence' && context?.confidence && context.confidence < 40) {
    return {
      type: 'low-confidence',
      timestamp: Date.now(),
      severity: 'high',
    }
  }
  
  return null
}
