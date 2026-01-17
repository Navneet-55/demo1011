import { ImpactMetrics, SessionSummary } from '@/types'

const METRICS_KEY = 'gyaanforge_metrics'
const SESSION_KEY = 'gyaanforge_session'

export const storageUtils = {
  saveMetric(metric: ImpactMetrics): void {
    if (typeof window === 'undefined') return
    
    try {
      const existing = this.getAllMetrics()
      existing.push(metric)
      // Limit to last 1000 metrics to prevent storage overflow
      const limited = existing.slice(-1000)
      localStorage.setItem(METRICS_KEY, JSON.stringify(limited))
    } catch (error) {
      console.error('Failed to save metric:', error)
      // If quota exceeded, try clearing old metrics
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        try {
          const existing = this.getAllMetrics()
          const recent = existing.slice(-100) // Keep only last 100
          recent.push(metric)
          localStorage.setItem(METRICS_KEY, JSON.stringify(recent))
        } catch (retryError) {
          console.error('Failed to save metric even after cleanup:', retryError)
        }
      }
    }
  },

  getAllMetrics(): ImpactMetrics[] {
    if (typeof window === 'undefined') return []
    
    try {
      const data = localStorage.getItem(METRICS_KEY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Failed to load metrics:', error)
      return []
    }
  },

  getSessionMetrics(): ImpactMetrics[] {
    if (typeof window === 'undefined') return []
    
    const sessionStart = this.getSessionStart()
    const allMetrics = this.getAllMetrics()
    return allMetrics.filter(m => m.timestamp >= sessionStart)
  },

  getSessionStart(): number {
    if (typeof window === 'undefined') return Date.now()
    
    try {
      const stored = localStorage.getItem(SESSION_KEY)
      if (stored) return parseInt(stored, 10)
      
      const now = Date.now()
      localStorage.setItem(SESSION_KEY, now.toString())
      return now
    } catch (error) {
      return Date.now()
    }
  },

  clearSession(): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.removeItem(SESSION_KEY)
      localStorage.setItem(SESSION_KEY, Date.now().toString())
    } catch (error) {
      console.error('Failed to clear session:', error)
    }
  },

  getSessionSummary(): SessionSummary {
    const metrics = this.getSessionMetrics()
    
    if (metrics.length === 0) {
      return {
        totalResponses: 0,
        avgConfidenceGain: 0,
        avgClarityRating: 0,
        totalTimeSaved: 0,
        modeBreakdown: { Beginner: 0, Student: 0, Pro: 0 },
        intentBreakdown: { learn: 0, debug: 0, docs: 0, summarize: 0, test: 0, general: 0 }
      }
    }

    const confidenceGains = metrics.map(m => m.confidenceAfter - m.confidenceBefore)
    const avgConfidenceGain = confidenceGains.reduce((a, b) => a + b, 0) / metrics.length
    
    const avgClarityRating = metrics.reduce((sum, m) => sum + m.clarityRating, 0) / metrics.length
    
    const totalTimeSaved = metrics.reduce((sum, m) => sum + m.timeSavedMinutes, 0)
    
    const modeBreakdown = metrics.reduce((acc, m) => {
      acc[m.mode] = (acc[m.mode] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const intentBreakdown = metrics.reduce((acc, m) => {
      acc[m.intent] = (acc[m.intent] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalResponses: metrics.length,
      avgConfidenceGain: Math.round(avgConfidenceGain),
      avgClarityRating: Math.round(avgClarityRating * 10) / 10,
      totalTimeSaved,
      modeBreakdown: {
        Beginner: modeBreakdown.Beginner || 0,
        Student: modeBreakdown.Student || 0,
        Pro: modeBreakdown.Pro || 0
      },
      intentBreakdown: {
        learn: intentBreakdown.learn || 0,
        debug: intentBreakdown.debug || 0,
        docs: intentBreakdown.docs || 0,
        summarize: intentBreakdown.summarize || 0,
        test: intentBreakdown.test || 0,
        general: intentBreakdown.general || 0
      }
    }
  }
}
