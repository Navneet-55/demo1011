'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { InputPanel } from '@/components/InputPanel'
import { OutputPanel } from '@/components/OutputPanel'
import DevCopilot from '@/components/DevCopilot'
import WhyThisAnswer from '@/components/WhyThisAnswer'
import ImpactWidget from '@/components/ImpactWidget'
import { KnowledgeGraphVisualizer } from '@/components/KnowledgeGraphVisualizer'
import { ConceptExplorer } from '@/components/ConceptExplorer'
import { ErrorDebugger } from '@/components/ErrorDebugger'
import { ErrorInput } from '@/components/ErrorInput'
import { TimeboxControl } from '@/components/TimeboxControl'
import { PerspectiveControl } from '@/components/PerspectiveControl'
import { FutureYouToggle } from '@/components/FutureYouToggle'
import { TracePanel } from '@/components/TracePanel'
import { PracticePanel } from '@/components/PracticePanel'
import { QuizFlow } from '@/components/QuizFlow'
import { StuckInterventionBanner } from '@/components/StuckInterventionBanner'
import { CommandPalette } from '@/components/CommandPalette'
import { Tabs } from '@/components/ui/index'
import { useMode } from '@/components/ModeProvider'
import { useOnlineOffline } from '@/contexts/OnlineOfflineContext'
import { useKnowledgeGraph } from '@/contexts/KnowledgeGraphContext'
import { useLearningSession } from '@/contexts/LearningSessionContext'
import { ExplanationTrace, ImpactMetrics, Intent, CognitiveLoadMode, ResponseMetadata } from '@/types'
import { storageUtils } from '@/lib/localStorage'
import { parseStreamedResponse } from '@/lib/meta-parsing'
import { safeParseMeta } from '@/lib/meta-validation'
import { generateFallbackMetadata } from '@/lib/meta-fallback'
import { analyzeStuckState } from '@/lib/stuckDetector'
import { COGNITIVE_LOAD_CONFIG, STORAGE_KEYS, DEBUG_CONFIG } from '@/lib/constants'
import { sanitizeString } from '@/lib/validators'
import { useCommandPaletteShortcut } from '@/lib/keyboard-shortcuts'

export const dynamic = 'force-dynamic'

// Debug logger utility
const debugLog = (message: string, data?: any) => {
  if (DEBUG_CONFIG.LOG_STATE_CHANGES) {
    console.log(`[GyaanForge] ${message}`, data || '')
  }
}

export default function Home() {
  const { mode } = useMode()
  const { effectiveMode } = useOnlineOffline()
  const { addGraph } = useKnowledgeGraph()
  const { state: sessionState } = useLearningSession()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [fullOutput, setFullOutput] = useState('')
  const [chunkIndex, setChunkIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [trace, setTrace] = useState<ExplanationTrace | null>(null)
  const [currentIntent, setCurrentIntent] = useState<Intent>('general')
  const [showDevCopilot, setShowDevCopilot] = useState(false)
  const [showKnowledgeGraph, setShowKnowledgeGraph] = useState(true)
  const [showErrorDebugger, setShowErrorDebugger] = useState(false)
  const [cognitiveLoad, setCognitiveLoad] = useState<CognitiveLoadMode>('balanced')
  const [currentMetadata, setCurrentMetadata] = useState<ResponseMetadata | null>(null)
  const [showRightPanel, setShowRightPanel] = useState(true)
  const [stuckDismissed, setStuckDismissed] = useState(false)
  const [isPaletteOpen, setIsPaletteOpen] = useState(false)

  // Setup Cmd/Ctrl+K shortcut for command palette
  useCommandPaletteShortcut(() => {
    setIsPaletteOpen(true)
  })

  // Load cognitive load preference from localStorage with validation
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COGNITIVE_LOAD)
      if (saved && ['overwhelmed', 'balanced', 'speed', 'mastery'].includes(saved)) {
        setCognitiveLoad(saved as CognitiveLoadMode)
        debugLog('Loaded cognitive load preference', { saved })
      }
    } catch (error) {
      debugLog('Error loading cognitive load preference', error)
    }
  }, [])

  // Save cognitive load preference to localStorage with error handling
  const handleCognitiveLoadChange = (mode: CognitiveLoadMode) => {
    try {
      setCognitiveLoad(mode)
      localStorage.setItem(STORAGE_KEYS.COGNITIVE_LOAD, mode)
      debugLog('Saved cognitive load preference', { mode })
    } catch (error) {
      debugLog('Error saving cognitive load preference', error)
      // Silently fail - still update state even if storage fails
      setCognitiveLoad(mode)
    }
  }

  const handleSubmit = async (
    inputText?: string,
    toolId?: string,
    context?: any
  ) => {
    const finalInput = inputText || input
    if (!finalInput.trim() || isLoading) return

    setIsLoading(true)
    setOutput('')
    setTrace(null)

    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: finalInput.trim(),
          mode,
          forceOffline: effectiveMode === 'offline',
          toolId,
          context,
          timebox: sessionState.timebox,
          perspective: sessionState.perspective,
          futureYou: sessionState.futureYou,
          stuckScore: sessionState.stuckState.score,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error')
        throw new Error(`API Error: ${response.status} - ${errorText}`)
      }

      // Check if it's a clarification response
      const contentType = response.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        try {
          const data = await response.json()
          if (data.type === 'clarification') {
            setOutput(
              `**🤔 I need some clarification:**\n\n${Array.isArray(data.questions)
                ? data.questions
                    .map((q: string, i: number) => `${i + 1}. ${q}`)
                    .join('\n')
                : 'Please provide more details.'}\n\n*Please provide more details so I can help you better.*`
            )
            if (data.trace) {
              setTrace(data.trace)
              setCurrentIntent(data.trace.intent)
            }
            setIsLoading(false)
            return
          }
        } catch (parseError) {
          console.error('Error parsing clarification response:', parseError)
        }
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('Response body not readable')
      }

      let accumulatedText = ''
      let traceExtracted = false
      let metaExtracted = false

      while (true) {
        try {
          const { done, value } = await reader.read()

          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          accumulatedText += chunk

          // Extract new metadata format __META__
          if (!metaExtracted && accumulatedText.includes('__META__')) {
            try {
              const parsed = parseStreamedResponse(accumulatedText)
              if (parsed.metadata) {
                const validated = safeParseMeta(parsed.metadata)
                if (validated) {
                  setCurrentMetadata(validated)
                  setTrace(validated.trace as any) // For backwards compat
                  setCurrentIntent(validated.trace.intent)
                  metaExtracted = true
                }
              }
              accumulatedText = parsed.content
            } catch (metaError) {
              console.error('Error parsing metadata:', metaError)
            }
          }

          // Extract legacy trace if present (backwards compatibility)
          if (!traceExtracted && !metaExtracted && accumulatedText.includes('__TRACE__')) {
            const traceMatch = accumulatedText.match(
              /__TRACE__(.+?)__TRACE__/
            )
            if (traceMatch) {
              try {
                const extractedTrace = JSON.parse(traceMatch[1])
                setTrace(extractedTrace)
                setCurrentIntent(extractedTrace.intent)
                traceExtracted = true
                // Remove trace from output
                accumulatedText = accumulatedText.replace(
                  /__TRACE__.+?__TRACE__/,
                  ''
                )
              } catch (e) {
                console.error('Failed to parse trace:', e)
              }
            }
          }

          // Extract knowledge graph if present
          if (accumulatedText.includes('__GRAPH__')) {
            const graphMatch = accumulatedText.match(
              /__GRAPH__(.+?)__GRAPH__/
            )
            if (graphMatch) {
              try {
                const extractedGraph = JSON.parse(graphMatch[1])
                addGraph(extractedGraph)
                // Remove graph from output
                accumulatedText = accumulatedText.replace(
                  /__GRAPH__.+?__GRAPH__/,
                  ''
                )
              } catch (e) {
                console.error('Failed to parse knowledge graph:', e)
              }
            }
          }

          // Apply chunked rendering based on cognitive load
          const config = COGNITIVE_LOAD_CONFIG[cognitiveLoad]
          if (config.chunkSize > 0 && accumulatedText.length > config.chunkSize) {
            // Store full output but only show first chunk
            setFullOutput(accumulatedText)
            setChunkIndex(1)
            setOutput(accumulatedText.slice(0, config.chunkSize))
          } else {
            // Show all immediately (mastery mode or text is short)
            setOutput(accumulatedText)
            setFullOutput('')
            setChunkIndex(0)
          }
        } catch (readerError) {
          console.error('Error reading stream:', readerError)
          throw readerError
        }
      }

      // Scroll to output panel after response completes
      if (typeof window !== 'undefined') {
        const outputPanel = document.querySelector('[data-output-panel]')
        outputPanel?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setOutput(
        `**❌ Oops! Something went wrong.**\n\n${errorMessage}\n\n*Please try again or check your connection.*`
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleImpactSave = (metrics: Omit<ImpactMetrics, 'id' | 'timestamp'>) => {
    const fullMetrics: ImpactMetrics = {
      ...metrics,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    }
    storageUtils.saveMetric(fullMetrics)
  }

  const handleContinue = () => {
    if (!fullOutput) return
    
    const config = COGNITIVE_LOAD_CONFIG[cognitiveLoad]
    const nextChunk = (chunkIndex + 1) * config.chunkSize
    
    if (nextChunk >= fullOutput.length) {
      // Show all
      setOutput(fullOutput)
      setChunkIndex(0)
      setFullOutput('')
    } else {
      // Show next chunk
      setOutput(fullOutput.slice(0, nextChunk))
      setChunkIndex(chunkIndex + 1)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Header />

      {/* Mode Toggle */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            GyaanForge
          </h1>
          <div className="flex gap-3 items-center">
            {/* Cognitive Load Selector */}
            <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {(Object.keys(COGNITIVE_LOAD_CONFIG) as CognitiveLoadMode[]).map((loadMode) => (
                <button
                  key={loadMode}
                  onClick={() => handleCognitiveLoadChange(loadMode)}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                    cognitiveLoad === loadMode
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  title={COGNITIVE_LOAD_CONFIG[loadMode].label}
                >
                  {COGNITIVE_LOAD_CONFIG[loadMode].label}
                </button>
              ))}
            </div>

            {/* Knowledge Graph Toggle */}
            <button
              onClick={() => setShowKnowledgeGraph(!showKnowledgeGraph)}
              className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                showKnowledgeGraph
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {showKnowledgeGraph ? '🌐 Graph On' : '🌐 Graph Off'}
            </button>

            {/* Error Debugger Toggle */}
            <button
              onClick={() => setShowErrorDebugger(!showErrorDebugger)}
              className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                showErrorDebugger
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {showErrorDebugger ? '🐛 Debugger On' : '🐛 Debugger Off'}
            </button>
            
            <button
              onClick={() => setShowDevCopilot(!showDevCopilot)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                showDevCopilot
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {showDevCopilot ? '📝 Standard Mode' : '🚀 Dev Copilot Mode'}
            </button>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {showDevCopilot ? (
          /* Dev Copilot View */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-16rem)]">
            <div className="flex flex-col">
              <DevCopilot
                mode={mode}
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </div>
            <div className="flex flex-col space-y-4" data-output-panel>
              <OutputPanel content={output} isLoading={isLoading} />
              {trace && !isLoading && <WhyThisAnswer trace={trace} />}
              {!output && !isLoading && (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-600">
                  <div className="text-6xl mb-4">🚀</div>
                  <p className="text-lg font-medium">Choose a tool and start coding!</p>
                  <p className="text-sm mt-2">Dev Copilot is ready to assist</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Standard View with Learning Features */
          <div className={`grid gap-6 h-[calc(100vh-16rem)]`} style={{
            gridTemplateColumns: showRightPanel 
              ? '1fr 1fr 1fr' 
              : showKnowledgeGraph || showErrorDebugger
              ? '1fr 1fr'
              : '1fr 1fr'
          }}>
            <div className="flex flex-col">
              <InputPanel
                mode={mode}
                value={input}
                onChange={setInput}
                onSubmit={() => handleSubmit()}
                isLoading={isLoading}
              />
              
              {/* Feature #4: Timebox Control */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <TimeboxControl />
              </div>
              
              {/* Feature #5: Perspective Control */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <PerspectiveControl />
              </div>
              
              {/* Feature #10: Future-You Toggle */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <FutureYouToggle />
              </div>
              
              {/* Error Input Section */}
              {showErrorDebugger && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <ErrorInput />
                </div>
              )}
            </div>
            
            <div className="flex flex-col space-y-4" data-output-panel>
              <OutputPanel content={output} isLoading={isLoading} />
              
              {/* Continue Button for Chunked Content */}
              {fullOutput && !isLoading && (
                <div className="flex justify-center">
                  <button
                    onClick={handleContinue}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg"
                  >
                    Continue Reading →
                  </button>
                </div>
              )}
              
              {!output && !isLoading && (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-600">
                  <div className="text-6xl mb-4">💡</div>
                  <p className="text-lg font-medium">Ready to learn something new?</p>
                  <p className="text-sm mt-2">Paste code or ask a question to get started</p>
                </div>
              )}
            </div>
            
            {/* Right Panel - Learning Features Tabs */}
            {showRightPanel && (
              <div className="flex flex-col h-full overflow-hidden">
                <Tabs
                  defaultTab="trace"
                  tabs={[
                    {
                      id: 'trace',
                      label: 'Trace',
                      icon: '🔍',
                      content: <TracePanel metadata={currentMetadata} />,
                    },
                    {
                      id: 'practice',
                      label: 'Practice',
                      icon: '🎯',
                      content: <PracticePanel metadata={currentMetadata} />,
                    },
                    {
                      id: 'quiz',
                      label: 'Quiz',
                      icon: '🎓',
                      content: (
                        <QuizFlow
                          metadata={currentMetadata}
                          onGenerateQuiz={() => {
                            // TODO: Trigger quiz generation
                          }}
                        />
                      ),
                    },
                    {
                      id: 'graph',
                      label: 'Graph',
                      icon: '🌐',
                      content: (
                        <>
                          <div className="flex-1 min-h-0 mb-4">
                            <KnowledgeGraphVisualizer />
                          </div>
                          <div className="h-64 min-h-0">
                            <ConceptExplorer />
                          </div>
                        </>
                      ),
                    },
                    {
                      id: 'debug',
                      label: 'Debug',
                      icon: '🐛',
                      content: <ErrorDebugger />,
                    },
                  ]}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Impact Widget */}
      {output && !isLoading && (
        <ImpactWidget
          onSave={handleImpactSave}
          mode={mode}
          intent={currentIntent}
        />
      )}

      {/* Feature #8: Stuck Intervention Banner */}
      {!stuckDismissed && sessionState.stuckState.score >= 50 && (
        <StuckInterventionBanner
          score={sessionState.stuckState.score}
          suggestions={analyzeStuckState(
            sessionState.stuckState.signals,
            [],
            []
          ).suggestions}
          onDismiss={() => setStuckDismissed(true)}
        />
      )}

      {/* Command Palette */}
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        context={{
          input,
          currentMode: mode,
          currentIntent,
        }}
      />
    </div>
  )
}
