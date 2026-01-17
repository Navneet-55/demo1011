import { Mode, Intent } from '@/types'

export interface ClarifyingQuestion {
  questions: string[]
  reason: string
}

export interface UncertaintyCheck {
  isUncertain: boolean
  reason?: string
  verificationSteps?: string[]
}

// Cache for intent detection to improve performance
const intentCache = new Map<string, Intent>()

export const guardrails = {
  /**
   * Detects if input is ambiguous and generates clarifying questions
   */
  detectAmbiguity(input: string, intent: Intent): ClarifyingQuestion | null {
    const trimmed = input.trim().toLowerCase()
    
    // Too short or vague
    if (trimmed.length < 10) {
      return {
        questions: [
          'Could you provide more context or details?',
          'What specific aspect would you like me to explain?'
        ],
        reason: 'Input is too brief'
      }
    }

    // Vague language detection
    const vagueTerms = ['this', 'it', 'that', 'something', 'stuff', 'thing']
    const hasOnlyVagueTerms = vagueTerms.some(term => 
      trimmed === term || trimmed.startsWith(term + ' ')
    )
    
    if (hasOnlyVagueTerms) {
      return {
        questions: [
          'What specifically are you referring to?',
          'Can you paste the code or error message you\'re asking about?'
        ],
        reason: 'Input contains only vague references'
      }
    }

    // Debug intent without error message
    if (intent === 'debug' && !trimmed.includes('error') && !trimmed.includes('exception')) {
      const hasStackTrace = /at\s+\w+|line\s+\d+|:\d+:\d+/.test(trimmed)
      if (!hasStackTrace) {
        return {
          questions: [
            'What error message or unexpected behavior are you seeing?',
            'Can you share the full error stacktrace?'
          ],
          reason: 'Debug request without clear error information'
        }
      }
    }

    // Test generation without language
    if (intent === 'test') {
      const hasLanguageIndicator = /javascript|typescript|python|java|c\+\+|ruby|go|rust/i.test(input)
      if (!hasLanguageIndicator && input.length < 50) {
        return {
          questions: [
            'What programming language is this code in?',
            'What testing framework would you like to use?'
          ],
          reason: 'Test generation request without language context'
        }
      }
    }

    return null
  },

  /**
   * Checks if the AI should express uncertainty
   */
  checkUncertainty(input: string, intent: Intent): UncertaintyCheck {
    const trimmed = input.trim().toLowerCase()

    // Very domain-specific or obscure topics
    const obscurePatterns = [
      /proprietary|internal|custom framework|legacy system/i,
      /\b\w{20,}\b/, // Very long technical terms
      /version\s*[\d.]+\s*specific/i
    ]

    for (const pattern of obscurePatterns) {
      if (pattern.test(input)) {
        return {
          isUncertain: true,
          reason: 'Domain-specific or proprietary context detected',
          verificationSteps: [
            'Check official documentation for this specific framework/library',
            'Verify version-specific behavior',
            'Test in your actual environment'
          ]
        }
      }
    }

    // Incomplete code snippets
    if (intent === 'debug' || intent === 'test') {
      const hasEllipsis = /\.{3,}|\/\/\s*\.{3}|\/\*\s*\.{3}/.test(input)
      if (hasEllipsis) {
        return {
          isUncertain: true,
          reason: 'Code snippet appears incomplete',
          verificationSteps: [
            'Share the complete code context',
            'Include surrounding code that might affect behavior'
          ]
        }
      }
    }

    return { isUncertain: false }
  },

  /**
   * Structures the AI response with required sections
   */
  buildStructuredPrompt(basePrompt: string, mode: Mode, intent: Intent): string {
    const structure = `
You must structure your response with these sections:

**Summary** (2-3 sentences)
Brief overview of what you're explaining.

**Step-by-Step** (if applicable)
Numbered steps or detailed breakdown.

**Example** (if applicable)
Concrete code example or scenario.

**Common Mistakes**
Typical pitfalls or errors to avoid.

**Next Actions**
What the user should do next or further resources.

${basePrompt}
`
    return structure
  },

  /**
   * Detects intent from user input (with caching for performance)
   */
  detectIntent(input: string): Intent {
    // Check cache first
    const cached = intentCache.get(input)
    if (cached) return cached

    const trimmed = input.trim().toLowerCase()

    let detectedIntent: Intent

    // Debug patterns
    if (
      /error|exception|bug|crash|fail|broken|doesn't work|not working/i.test(input) ||
      /traceback|stacktrace|at\s+\w+\.\w+|line\s+\d+/i.test(input)
    ) {
      detectedIntent = 'debug'
    }
    // Test generation
    else if (
      /test|unit test|integration test|mock|stub|spec/i.test(input) ||
      trimmed.startsWith('generate test') ||
      trimmed.includes('write test')
    ) {
      detectedIntent = 'test'
    }
    // Documentation
    else if (
      /what is|what does|explain|how does|documentation|docs/i.test(input) ||
      /definition|meaning|purpose/i.test(input)
    ) {
      detectedIntent = 'learn'
    }
    // Summarization
    else if (/summarize|summary|tldr|brief|quick overview/i.test(input)) {
      detectedIntent = 'summarize'
    }
    // Documentation lookup
    else if (/api|method|function|class.*do|parameter|argument/i.test(input)) {
      detectedIntent = 'docs'
    }
    else {
      detectedIntent = 'general'
    }

    // Cache the result (with size limit to prevent memory leaks)
    if (intentCache.size > 1000) {
      const firstKey = intentCache.keys().next().value
      if (firstKey !== undefined) {
        intentCache.delete(firstKey)
      }
    }
    intentCache.set(input, detectedIntent)

    return detectedIntent
  }
}
