import { Tool, Mode, Intent, ExplanationTrace } from '@/types'
import { guardrails } from './guardrails'

/**
 * Tool: Explain Code
 */
const explainCodeTool: Tool = {
  id: 'explain-code',
  label: 'Explain Code',
  description: 'Get detailed explanations of code snippets',
  icon: '📝',
  
  buildPrompt: (input: string, mode: Mode) => {
    const modeInstructions = {
      Beginner: 'Use simple language, analogies, and avoid jargon. Explain like teaching someone new to programming.',
      Student: 'Provide balanced explanations with technical terms, step-by-step breakdowns, and best practices.',
      Pro: 'Give concise, technical analysis with performance considerations, patterns, and optimization notes.'
    }

    return guardrails.buildStructuredPrompt(
      `Analyze and explain this code:\n\n\`\`\`\n${input}\n\`\`\`\n\n${modeInstructions[mode]}`,
      mode,
      'learn'
    )
  },

  requiresClarification: (input: string) => {
    const clarify = guardrails.detectAmbiguity(input, 'learn')
    return clarify ? clarify.questions : null
  }
}

/**
 * Tool: Debug Error
 */
const debugErrorTool: Tool = {
  id: 'debug-error',
  label: 'Debug Error',
  description: 'Analyze errors, stacktraces, and debugging issues',
  icon: '🐛',
  
  buildPrompt: (input: string, mode: Mode) => {
    const modeInstructions = {
      Beginner: 'Explain the error in simple terms, what caused it, and how to fix it step-by-step.',
      Student: 'Analyze the error, explain the root cause, provide solutions, and mention how to prevent it.',
      Pro: 'Root cause analysis, multiple solution approaches, performance implications, and debugging strategies.'
    }

    return guardrails.buildStructuredPrompt(
      `Debug this error/issue:\n\n${input}\n\n${modeInstructions[mode]}\n\nIdentify: 1) What went wrong, 2) Why it happened, 3) How to fix it, 4) How to prevent it.`,
      mode,
      'debug'
    )
  },

  requiresClarification: (input: string) => {
    const clarify = guardrails.detectAmbiguity(input, 'debug')
    return clarify ? clarify.questions : null
  }
}

/**
 * Tool: Generate Tests
 */
const generateTestsTool: Tool = {
  id: 'generate-tests',
  label: 'Generate Tests',
  description: 'Create unit tests for your code',
  icon: '🧪',
  
  buildPrompt: (input: string, mode: Mode, context?: { language?: string; framework?: string }) => {
    const language = context?.language || 'JavaScript'
    const framework = context?.framework || 'Jest'
    
    const modeInstructions = {
      Beginner: `Generate simple, well-commented ${framework} tests. Explain what each test does and why it's important.`,
      Student: `Generate comprehensive ${framework} tests covering happy paths, edge cases, and error scenarios. Include explanations.`,
      Pro: `Generate production-ready ${framework} tests with mocks, edge cases, performance tests, and integration scenarios.`
    }

    return guardrails.buildStructuredPrompt(
      `Generate ${framework} unit tests for this ${language} code:\n\n\`\`\`${language.toLowerCase()}\n${input}\n\`\`\`\n\n${modeInstructions[mode]}\n\nInclude: test setup, multiple test cases, assertions, and cleanup if needed.`,
      mode,
      'test'
    )
  },

  requiresClarification: (input: string) => {
    const clarify = guardrails.detectAmbiguity(input, 'test')
    return clarify ? clarify.questions : null
  }
}

/**
 * Tool: Summarize Documentation
 */
const summarizeDocsTool: Tool = {
  id: 'summarize-docs',
  label: 'Summarize Docs',
  description: 'Get quick summaries of documentation or concepts',
  icon: '📚',
  
  buildPrompt: (input: string, mode: Mode) => {
    const modeInstructions = {
      Beginner: 'Provide a simple summary with key takeaways in plain language.',
      Student: 'Summarize with technical details, key concepts, and practical applications.',
      Pro: 'Concise technical summary with API surface, patterns, and gotchas.'
    }

    return guardrails.buildStructuredPrompt(
      `Summarize this documentation or concept:\n\n${input}\n\n${modeInstructions[mode]}`,
      mode,
      'summarize'
    )
  }
}

/**
 * Tool Registry
 */
export const toolRegistry = {
  tools: [
    explainCodeTool,
    debugErrorTool,
    generateTestsTool,
    summarizeDocsTool
  ] as Tool[],

  getTool(id: string): Tool | undefined {
    return this.tools.find(t => t.id === id)
  },

  getAllTools(): Tool[] {
    return this.tools
  },

  buildPromptForTool(
    toolId: string,
    input: string,
    mode: Mode,
    context?: any
  ): { prompt: string; clarifyingQuestions: string[] | null } {
    const tool = this.getTool(toolId)
    if (!tool) {
      throw new Error(`Tool not found: ${toolId}`)
    }

    // Check if clarification needed
    const clarifyingQuestions = tool.requiresClarification?.(input) || null
    
    // Build the prompt
    const prompt = tool.buildPrompt(input, mode, context)

    return { prompt, clarifyingQuestions }
  },

  createTrace(
    toolId: string,
    mode: Mode,
    intent: Intent,
    clarifyingQuestions: string[] | null,
    uncertaintyCheck: { isUncertain: boolean; reason?: string }
  ): ExplanationTrace {
    return {
      mode,
      intent,
      responseFormat: 'structured',
      guardrails: {
        askedClarifyingQuestions: clarifyingQuestions !== null,
        questionsAsked: clarifyingQuestions || undefined,
        uncertaintyFlag: uncertaintyCheck.isUncertain,
        uncertaintyReason: uncertaintyCheck.reason,
        structuredOutputApplied: true
      },
      timestamp: Date.now()
    }
  }
}
