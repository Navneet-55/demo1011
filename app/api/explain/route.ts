import Groq from 'groq-sdk'
import { NextRequest, NextResponse } from 'next/server'
import { toolRegistry } from '@/lib/tools'
import { guardrails } from '@/lib/guardrails'
import { extractConceptsFromText } from '@/lib/conceptExtractor'
import { ExplanationTrace, Mode, Intent, ResponseMetadata, Timebox, Perspective } from '@/types'
import { createResponseMetadata } from '@/types/api-contract'

// Initialize Groq (will be null if API key not provided)
const groq = process.env.GROQ_API_KEY 
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null

const systemPrompts: Record<Mode, string> = {
  Beginner: `You are GyaanForge, an expert AI mentor that forges deep understanding from code.

When explaining to a BEGINNER:
- Use simple, everyday language
- Explain concepts step-by-step
- Use real-world analogies and metaphors
- Avoid jargon, or explain it when unavoidable
- Break down complex ideas into digestible pieces
- Be encouraging and patient
- Focus on the "what" and "why" before the "how"

Structure your response as:
1. **What it does** - Simple explanation in plain language
2. **Why it matters** - Real-world relevance
3. **How it works** - Step-by-step breakdown with analogies`,

  Student: `You are GyaanForge, an expert AI mentor that forges deep understanding from code.

When explaining to a STUDENT:
- Balance theory with practical application
- Connect concepts to what they're learning
- Provide clear examples and use cases
- Explain the reasoning behind design decisions
- Include learning tips and best practices
- Use some technical terms but explain them clearly
- Show how concepts relate to each other

Structure your response as:
1. **What it does** - Clear technical description
2. **Why it matters** - Academic and practical importance
3. **How it works** - Detailed explanation with examples
4. **Key Concepts** - Important points to remember`,

  Pro: `You are GyaanForge, an expert AI mentor that forges deep understanding from code.

When explaining to a PRO:
- Be concise and technical
- Focus on architecture, patterns, and trade-offs
- Highlight performance implications
- Point out edge cases and potential issues
- Assume deep technical knowledge
- Provide optimization insights
- Reference advanced concepts directly

Structure your response as:
1. **Overview** - High-level technical summary
2. **Architecture** - Design patterns and structure
3. **Implementation Details** - Key technical points
4. **Considerations** - Performance, security, edge cases`,
}

// Local fallback responses for offline mode with smart code analysis
const generateLocalResponse = (input: string, mode: Mode): string => {
  // Analyze input to detect code type
  const codeType = input.includes('function ') || input.includes('const ') && input.includes('=>') 
    ? 'function'
    : input.includes('class ')
    ? 'class'
    : input.includes('interface ')
    ? 'interface'
    : input.includes('import ')
    ? 'module imports'
    : input.includes('for ') || input.includes('while ')
    ? 'loop'
    : input.includes('if ') || input.includes('else')
    ? 'conditional'
    : input.includes('async ') || input.includes('await ')
    ? 'async code'
    : input.includes('[') && input.includes(']')
    ? 'array operations'
    : input.includes('{') && input.includes('}')
    ? 'object/data structure'
    : 'code'

  // Extract function/class name if present
  const nameMatch = input.match(/(?:function|class|const)\s+(\w+)/)
  const name = nameMatch ? nameMatch[1] : 'your code'

  const responses: Record<Mode, string> = {
    Beginner: `## 🌱 Understanding Your Code

**What it does:**
This is ${codeType}. In simple terms, think of it as a set of instructions that tell the computer exactly what to do.

**Breaking it down:**
- **Lines**: Each line is one instruction
- **Keywords**: Words like \`function\`, \`if\`, \`for\` are special instructions
- **Logic**: The code runs from top to bottom

**Why it matters:**
Understanding code helps you see how programs think and solve problems.

**💡 Next step:** Connect to the internet for AI to explain exactly what "${name}" does!

---
*💻 Offline mode: AI-powered detailed analysis available when connected*`,

    Student: `## 📚 Code Analysis (Offline)

**What it does:**
This snippet contains ${codeType}. Based on the structure, it appears to handle ${input.includes('fetch') || input.includes('axios') ? 'API requests' : input.includes('map') || input.includes('filter') ? 'data transformation' : input.includes('async') ? 'asynchronous operations' : 'specific programming logic'}.

**Structure Analysis:**
- **Type**: ${codeType}
- **Pattern**: ${input.includes('export') ? 'Module export pattern' : input.includes('class') ? 'OOP pattern' : input.includes('=>') ? 'Arrow function pattern' : 'Standard implementation'}
- **Scale**: ${input.length > 500 ? 'Medium-to-large code block' : input.length > 200 ? 'Medium code block' : 'Compact code snippet'}

**Key Observations:**
- Contains ${input.match(/\/\//g) ? 'comments for documentation' : 'logic without explicit comments'}
- Uses ${input.includes('const') ? 'const declarations (immutable)' : input.includes('let') ? 'let declarations (mutable)' : 'var declarations'}
- ${input.includes('try') ? 'Has error handling with try/catch' : 'Error handling should be considered'}

---
*🌐 Online mode unlocked: AI can now provide detailed step-by-step analysis*`,

    Pro: `## ⚡ Technical Analysis (Offline)

**Code Profile:**
\`\`\`
Type: ${codeType}
Pattern: ${input.includes('async/await') ? 'Async/Promise-based' : input.includes('callback') ? 'Callback-based' : input.includes('class') ? 'Class-based OOP' : input.includes('=>') ? 'Functional/Arrow functions' : 'Imperative'}
LOC: ${input.split('\n').length} lines
Complexity: ${input.match(/function/g)?.length || 0} functions detected
\`\`\`

**Architecture Notes:**
- **Paradigm**: ${input.includes('class') ? 'Object-Oriented Programming' : input.includes('=>') || input.match(/return.*\w+/g) ? 'Functional Programming' : 'Procedural/Mixed'}
- **Dependencies**: ${(input.match(/import|require/g) || []).length} module dependencies
- **Error Handling**: ${input.includes('try') ? '✓ Present' : '⚠ Consider adding'}

**Performance Indicators:**
- **Time Complexity**: Requires runtime profiling
- **Space Complexity**: ${input.includes('map') || input.includes('filter') ? 'O(n) - Creates new arrays' : 'Requires analysis'}
- **Optimization Points**: ${input.includes('for') ? 'Loop optimization candidates' : input.includes('recursive') ? 'Consider iterative approach' : 'Review algorithm efficiency'}

**Recommendations:**
1. Use profiler for accurate metrics
2. Consider TypeScript for type safety
3. Add unit tests for coverage

---
*⚡ Connect to Groq API for real-time AI analysis with advanced pattern recognition*`,
  }

  return responses[mode]
}

// Try Groq API, fallback to local if unavailable
const getExplanation = async (input: string, mode: Mode, forceOffline: boolean = false): Promise<ReadableStream<Uint8Array>> => {
  const encoder = new TextEncoder()

  // Try Groq if API key is available and not forcing offline
  if (!forceOffline && groq) {
    try {
      const prompt = `${systemPrompts[mode]}\n\nUser question:\n${input}`
      
      const stream = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        stream: true,
        temperature: 0.7,
        max_tokens: 1024,
      })
      
      return new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              if (chunk.choices[0]?.delta?.content) {
                controller.enqueue(encoder.encode(chunk.choices[0].delta.content))
              }
            }
            controller.close()
          } catch (error) {
            console.error('Streaming error:', error)
            controller.close()
          }
        },
      })
    } catch (error) {
      console.log('Groq API unavailable, using local mode:', error)
      // Fall through to local mode
    }
  }

  // Local fallback mode
  const localResponse = generateLocalResponse(input, mode)
  return new ReadableStream({
    start(controller) {
      // Simulate streaming for consistent UX
      const words = localResponse.split(' ')
      let index = 0
      
      const interval = setInterval(() => {
        if (index < words.length) {
          controller.enqueue(encoder.encode(words[index] + ' '))
          index++
        } else {
          clearInterval(interval)
          controller.close()
        }
      }, 50) // Stream words every 50ms for natural feel
    },
  })
}

export async function POST(req: NextRequest) {
  try {
    const { 
      input, 
      mode, 
      forceOffline, 
      toolId, 
      context,
      timebox = '2m',
      perspective = 'story',
      futureYou = false,
      stuckScore = 0,
    } = await req.json()

    if (!input || !mode) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    const startTime = Date.now()
    const detectedIntent = guardrails.detectIntent(input)
    const responseId = `resp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Build perspective modifier
    const perspectiveModifiers: Record<Perspective, string> = {
      story: 'Use a narrative style with context, flow, and storytelling.',
      diagram: 'Describe visual structure, diagrams, and spatial relationships.',
      code: 'Start with code examples and implementation details first.',
      analogy: 'Use real-world analogies, metaphors, and comparisons.',
      math: 'Use mathematical notation, formulas, and formal definitions.',
    }
    
    // Build timebox modifier
    const timeboxModifiers: Record<Timebox, string> = {
      '30s': 'ULTRA-CONCISE: Keep response under 100 words. Only essential points.',
      '2m': 'BALANCED: Keep response focused, around 200-300 words.',
      'deep': 'COMPREHENSIVE: Provide deep analysis with examples, edge cases, and nuances.',
    }
    
    // Build futureYou modifier
    const futureYouModifier = futureYou
      ? '\n\nIMPORTANT: Speak as "you in 6 months" explaining to your past self. Be empathetic, concise, and encouraging. Use phrases like "Hey past-me" or "Trust me, you\'ll get this".'
      : ''
    
    // Build stuck intervention modifier
    const stuckModifier = stuckScore > 50
      ? '\n\nUSER IS STUCK: Use simpler language, concrete examples, and shorter sentences. Break down into tiny steps.'
      : ''
    
    // Use tool if specified, otherwise use default explanation
    let finalPrompt: string
    let clarifyingQuestions: string[] | null = null
    let trace: ExplanationTrace

    if (toolId) {
      // Using Dev Copilot tool
      const result = toolRegistry.buildPromptForTool(toolId, input, mode as Mode, context)
      finalPrompt = result.prompt
      clarifyingQuestions = result.clarifyingQuestions

      // Check for uncertainty
      const uncertaintyCheck = guardrails.checkUncertainty(input, detectedIntent)

      // Build trace
      trace = toolRegistry.createTrace(
        toolId,
        mode as Mode,
        detectedIntent,
        clarifyingQuestions,
        uncertaintyCheck
      )

      // If we have clarifying questions, return them first
      if (clarifyingQuestions && clarifyingQuestions.length > 0) {
        const clarifyResponse = `**Before I proceed, I need to clarify a few things:**\n\n${clarifyingQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}\n\n*Please provide more details so I can give you a better answer.*`
        
        trace.processingTimeMs = Date.now() - startTime

        return NextResponse.json({
          type: 'clarification',
          questions: clarifyingQuestions,
          trace
        })
      }

      // Add uncertainty warning if needed
      if (trace.guardrails.uncertaintyFlag) {
        finalPrompt = `**⚠️ Note:** ${trace.guardrails.uncertaintyReason}\n\n${finalPrompt}\n\n**Verification Steps:**\n${guardrails.checkUncertainty(input, detectedIntent).verificationSteps?.map(step => `- ${step}`).join('\n') || ''}`
      }
    } else {
      // Standard explanation (original flow)
      const uncertaintyCheck = guardrails.checkUncertainty(input, detectedIntent)
      const ambiguityCheck = guardrails.detectAmbiguity(input, detectedIntent)

      // Build enhanced prompt with modifiers
      finalPrompt = `${systemPrompts[mode as Mode]}

RESPONSE CONSTRAINTS:
- ${timeboxModifiers[timebox as Timebox]}
- ${perspectiveModifiers[perspective as Perspective]}${futureYouModifier}${stuckModifier}

User question:
${input}`

      if (ambiguityCheck) {
        clarifyingQuestions = ambiguityCheck.questions
      }

      trace = {
        mode: mode as Mode,
        intent: detectedIntent,
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

      if (clarifyingQuestions && clarifyingQuestions.length > 0) {
        const clarifyResponse = `**I'd like to understand better:**\n\n${clarifyingQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}\n\n*This will help me provide a more accurate explanation.*`
        
        trace.processingTimeMs = Date.now() - startTime

        return NextResponse.json({
          type: 'clarification',
          questions: clarifyingQuestions,
          trace
        })
      }

      if (trace.guardrails.uncertaintyFlag && uncertaintyCheck.verificationSteps) {
        finalPrompt = `⚠️ **I might be uncertain about some aspects.** ${uncertaintyCheck.reason}\n\n${finalPrompt}\n\n**Please verify:**\n${uncertaintyCheck.verificationSteps.map(step => `- ${step}`).join('\n')}`
      }
    }

    const stream = await getExplanation(finalPrompt, mode as Mode, forceOffline === true)
    
    trace.processingTimeMs = Date.now() - startTime

    // Create a new stream that includes both content, trace, knowledge graph, and metadata
    const encoder = new TextEncoder()
    const reader = stream.getReader()
    
    return new NextResponse(
      new ReadableStream({
        async start(controller) {
          // First, send the trace as a special message (backwards compatibility)
          controller.enqueue(encoder.encode(`__TRACE__${JSON.stringify(trace)}__TRACE__`))
          
          // Collect full text for concept extraction and practice generation
          let fullText = ''
          
          // Then stream the content
          try {
            while (true) {
              const { done, value } = await reader.read()
              if (done) break
              
              // Decode and accumulate text
              const chunk = new TextDecoder().decode(value)
              fullText += chunk
              
              controller.enqueue(value)
            }
            
            // After streaming is complete, extract concepts and send knowledge graph
            try {
              const knowledgeGraph = extractConceptsFromText(fullText, input)
              controller.enqueue(encoder.encode(`__GRAPH__${JSON.stringify(knowledgeGraph)}__GRAPH__`))
            } catch (error) {
              console.error('Failed to extract knowledge graph:', error)
            }
            
            // Generate comprehensive metadata
            try {
              const metadata: ResponseMetadata = createResponseMetadata(
                responseId,
                input.slice(0, 50), // Use input as topic
                {
                  trace: {
                    intent: detectedIntent,
                    pedagogy: perspective as Perspective,
                    timebox: timebox as Timebox,
                    cognitiveLoad: 'balanced', // TODO: Get from session
                    futureYou,
                    omitted: [],
                    uncertainty: trace.guardrails.uncertaintyFlag ? {
                      isUncertain: true,
                      why: trace.guardrails.uncertaintyReason,
                      verifySteps: [],
                    } : {
                      isUncertain: false,
                    },
                    clarifyingQuestionsAsked: trace.guardrails.questionsAsked || [],
                    stuckInterventionApplied: stuckScore > 50,
                  },
                  practice: detectedIntent === 'learn' ? {
                    quickQuestions: [
                      { q: `What is the main concept in "${input.slice(0, 30)}..."?`, a: 'Review the explanation above' },
                      { q: 'How would you explain this to a friend?', a: 'Use simple terms and real-world examples' },
                      { q: 'What are potential use cases?', a: 'Consider practical applications' },
                    ],
                    miniTask: {
                      title: 'Quick Practice',
                      steps: [
                        'Read the explanation carefully',
                        'Try to explain it in your own words',
                        'Think of a real-world example',
                      ],
                    },
                  } : undefined,
                  quiz: detectedIntent === 'learn' ? {
                    questions: [
                      { q: `Explain the key concept from "${input.slice(0, 30)}..."`, expectedKeywords: ['concept', 'understand', 'explain'] },
                      { q: 'What problem does this solve?', expectedKeywords: ['problem', 'solution', 'purpose'] },
                      { q: 'How is this used in practice?', expectedKeywords: ['practice', 'use', 'application'] },
                    ],
                  } : undefined,
                }
              )
              
              controller.enqueue(encoder.encode(`__META__${JSON.stringify(metadata)}__META__`))
            } catch (error) {
              console.error('Failed to generate metadata:', error)
            }
            
            controller.close()
          } catch (error) {
            console.error('Streaming error:', error)
            controller.close()
          }
        }
      }),
      {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      }
    )
  } catch (error) {
    console.error('API Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
