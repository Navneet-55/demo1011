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

  // Quick Actions handlers
  const handleClearInput = () => {
    setInput('')
    setOutput('')
    setFullOutput('')
    setTrace(null)
  }

  const handleExampleQuery = () => {
    const examples = [
      'Explain how React hooks work',
      'What is the difference between let and const in JavaScript?',
      'How does async/await work in JavaScript?',
      'Explain the concept of closure in programming',
    ]
    const randomExample = examples[Math.floor(Math.random() * examples.length)]
    setInput(randomExample)
  }

  const handleExportNotes = () => {
    const notes = {
      timestamp: new Date().toISOString(),
      input,
      output,
      trace,
      mode,
      cognitiveLoad,
    }
    const blob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `gyaanforge-notes-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

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
      <Header 
        onClearInput={handleClearInput}
        onExampleQuery={handleExampleQuery}
        onExportNotes={handleExportNotes}
      />

      {/* Control Bar - Organized by Category */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center sm:justify-between">
            {/* Learning Mode */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Cognitive Load</p>
              <div className="flex gap-2 bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
                {(Object.keys(COGNITIVE_LOAD_CONFIG) as CognitiveLoadMode[]).map((loadMode) => (
                  <button
                    key={loadMode}
                    onClick={() => handleCognitiveLoadChange(loadMode)}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                      cognitiveLoad === loadMode
                        ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50'
                    }`}
                    title={COGNITIVE_LOAD_CONFIG[loadMode].label}
                  >
                    {COGNITIVE_LOAD_CONFIG[loadMode].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Features</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowKnowledgeGraph(!showKnowledgeGraph)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                    showKnowledgeGraph
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  🌐 Graph
                </button>

                <button
                  onClick={() => setShowErrorDebugger(!showErrorDebugger)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                    showErrorDebugger
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  🐛 Debug
                </button>
              </div>
            </div>

            {/* Views & Actions */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">View & Actions</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDevCopilot(!showDevCopilot)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                    showDevCopilot
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  {showDevCopilot ? '🚀 Dev' : '📚 Learn'}
                </button>
                
                <button
                  onClick={() => setShowRightPanel(!showRightPanel)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                    showRightPanel
                      ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  {showRightPanel ? '📊 Tools' : '📊 Show Tools'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {showDevCopilot ? (
          /* Dev Copilot View */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-16rem)]">
            {/* Left Panel - Dev Copilot Tools */}
            <div className="flex flex-col bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <span>🚀</span>
                  <span>Dev Copilot</span>
                </h2>
              </div>
              <div className="flex-1 overflow-y-auto">
                <DevCopilot
                  mode={mode}
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                />
              </div>
            </div>
            
            {/* Right Panel - Output */}
            <div className="flex flex-col bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden" data-output-panel>
              <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Output</h2>
              </div>
              <div className="flex-1 overflow-y-auto">
                <OutputPanel content={output} isLoading={isLoading} />
                {trace && !isLoading && <WhyThisAnswer trace={trace} />}
                {!output && !isLoading && (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-600 p-8">
                    <div className="text-6xl mb-4">🚀</div>
                    <p className="text-lg font-medium">Choose a tool and start coding!</p>
                    <p className="text-sm mt-2">Dev Copilot is ready to assist</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Standard View with Learning Features */
          <div className={`grid gap-6 h-[calc(100vh-16rem)]`} style={{
            gridTemplateColumns: showRightPanel 
              ? '400px 1fr 400px' 
              : showKnowledgeGraph || showErrorDebugger
              ? '1fr 1fr'
              : '1fr 1fr'
          }}>
            {/* Left Panel - Input & Controls */}
            <div className="flex flex-col bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
              {/* Input Section */}
              <div className="flex-shrink-0">
                <InputPanel
                  mode={mode}
                  value={input}
                  onChange={setInput}
                  onSubmit={() => handleSubmit()}
                  isLoading={isLoading}
                />
              </div>
              
              {/* Learning Controls Section */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-4">
                  {/* Section Header */}
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Learning Controls</span>
                  </div>
                  
                  {/* Timebox Control */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">⏱️ Time Management</h3>
                    <TimeboxControl />
                  </div>
                  
                  {/* Perspective Control */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">👁️ Perspective</h3>
                    <PerspectiveControl />
                  </div>
                  
                  {/* Future-You Toggle */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">🔮 Reflection</h3>
                    <FutureYouToggle />
                  </div>
                  
                  {/* Error Input Section */}
                  {showErrorDebugger && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">🐛 Debug Input</h3>
                      <ErrorInput />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Center Panel - Output & Explanation */}
            <div className="flex flex-col bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden" data-output-panel>
              {/* Output Content */}
              <div className="flex-1 overflow-y-auto">
                <OutputPanel content={output} isLoading={isLoading} />
              </div>
              
              {/* Continue Button for Chunked Content */}
              {fullOutput && !isLoading && (
                <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <button
                    onClick={handleContinue}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg"
                  >
                    Continue Reading →
                  </button>
                </div>
              )}
              
              {/* Empty State */}
              {!output && !isLoading && (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-600 p-8">
                  <div className="text-6xl mb-4">💡</div>
                  <p className="text-lg font-medium">Ready to learn something new?</p>
                  <p className="text-sm mt-2">Paste code or ask a question to get started</p>
                </div>
              )}
            </div>
            
            {/* Right Panel - Learning Features */}
            {showRightPanel && (
              <div className="flex flex-col bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                {/* Panel Header */}
                <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Learning Tools</h2>
                </div>
                
                {/* Tabs Content */}
                <div className="flex-1 overflow-hidden">
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
    </div>
  )
}
