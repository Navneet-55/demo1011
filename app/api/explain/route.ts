import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

// Initialize Gemini (will be null if API key not provided)
const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null

type Mode = 'Beginner' | 'Student' | 'Pro'

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

// Local fallback responses for offline mode
const generateLocalResponse = (input: string, mode: Mode): string => {
  const responses: Record<Mode, string> = {
    Beginner: `## 🌱 Understanding Your Code

**What it does:**
I'm analyzing your code in offline mode. This appears to be ${input.includes('function') ? 'a function' : input.includes('class') ? 'a class' : input.includes('const') || input.includes('let') ? 'a variable declaration' : 'code'}.

**Why it matters:**
Understanding code is like reading a recipe - each line tells the computer what to do, step by step.

**How it works:**
1. The code is processed line by line
2. Each instruction is executed in order
3. The result depends on the input you provide

**💡 Tip:** When you're back online, I can give you a much more detailed explanation using AI!

---
*Currently running in offline mode. Connect to the internet for AI-powered explanations.*`,

    Student: `## 📚 Code Analysis (Offline Mode)

**What it does:**
Your code snippet appears to involve ${input.includes('async') ? 'asynchronous operations' : input.includes('function') ? 'function declarations' : input.includes('import') ? 'module imports' : 'programming logic'}.

**Key Concepts:**
- **Structure**: The code follows standard syntax patterns
- **Purpose**: It performs specific operations based on its implementation
- **Best Practices**: Code should be readable, maintainable, and efficient

**How it works:**
The execution flow depends on the specific constructs used. Without AI analysis, I can provide general observations about the code structure.

**Learning Resources:**
- Consider MDN Web Docs for JavaScript references
- Official documentation for the language you're using
- Online coding platforms for practice

---
*Offline mode active. For detailed AI-powered explanations, please connect to the internet.*`,

    Pro: `## ⚡ Technical Analysis (Offline Mode)

**Overview:**
Static analysis indicates ${input.includes('async') ? 'async/await patterns' : input.includes('class') ? 'OOP implementation' : input.includes('function') ? 'functional programming constructs' : 'code logic'}.

**Architecture:**
- **Pattern**: Standard implementation approach detected
- **Dependencies**: ${input.includes('import') ? 'External module dependencies present' : 'Self-contained logic'}
- **Complexity**: O(n) time complexity (approximate)

**Implementation Notes:**
Without AI processing, detailed analysis is limited. Key observations:
- Code structure follows conventional patterns
- Standard syntax compliance
- Potential optimization points require runtime analysis

**Considerations:**
- **Performance**: Requires profiling for accurate metrics
- **Security**: Static analysis recommended for production code
- **Scalability**: Architecture review needed for large-scale deployment

---
*Running in offline mode. Connect for advanced AI-powered analysis including pattern recognition, optimization suggestions, and security insights.*`,
  }

  return responses[mode]
}

// Try Gemini API, fallback to local if unavailable
const getExplanation = async (input: string, mode: Mode, forceOffline: boolean = false): Promise<ReadableStream<Uint8Array>> => {
  const encoder = new TextEncoder()

  // Try Gemini if API key is available and not forcing offline
  if (!forceOffline && genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
      const prompt = `${systemPrompts[mode]}\n\nUser question:\n${input}`
      
      const result = await model.generateContentStream(prompt)
      
      return new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of result.stream) {
              const text = chunk.text()
              if (text) {
                controller.enqueue(encoder.encode(text))
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
      console.log('Gemini API unavailable, using local mode:', error)
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
    const { input, mode, forceOffline } = await req.json()

    if (!input || !mode) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    const stream = await getExplanation(input, mode as Mode, forceOffline === true)

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('API Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
