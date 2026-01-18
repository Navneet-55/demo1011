'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Header } from '@/components/Header'
import { InputPanel } from '@/components/InputPanel'
import { OutputPanel } from '@/components/OutputPanel'
import { useMode } from '@/components/ModeProvider'
import { useOnlineOffline } from '@/contexts/OnlineOfflineContext'
import { Badge } from '@/components/ui/primitives'
import { ContextBar } from '@/components/ui'
import type { ContextBarItem } from '@/components/ui/ContextBar'
import { Drawer } from '@/components/ui'
import { Chip } from '@/components/ui/primitives'
import { KnowledgeGraphVisualizer } from '@/components/KnowledgeGraphVisualizer'
import { PracticePanel } from '@/components/PracticePanel'
import { TracePanel } from '@/components/TracePanel'
import { QuizFlow } from '@/components/QuizFlow'
import type { CognitiveLoadMode } from '@/types'
import { COGNITIVE_LOAD_CONFIG } from '@/lib/constants'
import { useLearningSession } from '@/contexts/LearningSessionContext'
import { useKnowledgeGraph } from '@/contexts/KnowledgeGraphContext'
import type { ResponseMetadata } from '@/types/api-contract'

export const dynamic = 'force-dynamic'

export default function LearnPage() {
  const { mode } = useMode()
  const { effectiveMode } = useOnlineOffline()
  const { state, setTimebox, setPerspective, setFutureYou } = useLearningSession()
  const { getCurrentGraph, addGraph } = useKnowledgeGraph()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [cognitiveLoad, setCognitiveLoad] = useState<CognitiveLoadMode>('balanced')
  const [showContextBar, setShowContextBar] = useState(false)
  const [contextBarHidden, setContextBarHidden] = useState(false)
  const scrollHideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isInsightsOpen, setIsInsightsOpen] = useState(false)
  const [activeInsightTab, setActiveInsightTab] = useState<string>('')
  const [metadata, setMetadata] = useState<ResponseMetadata | null>(null)

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return
    
    setIsLoading(true)
    setOutput('')
    setMetadata(null)
    // Note: knowledge graph is managed by context; no explicit reset here to preserve history
    
    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: input.trim(),
          mode,
          forceOffline: effectiveMode === 'offline',
        }),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error('Response body not readable')

      let textBuffer = ''

      const consumeMarker = (
        buffer: string,
        startToken: string,
        endToken: string,
        onPayload: (payload: string) => void
      ) => {
        let startIdx = buffer.indexOf(startToken)
        let working = buffer

        while (startIdx !== -1) {
          const endIdx = working.indexOf(endToken, startIdx + startToken.length)
          if (endIdx === -1) break
          const payload = working.slice(startIdx + startToken.length, endIdx)
          onPayload(payload)
          working = working.slice(0, startIdx) + working.slice(endIdx + endToken.length)
          startIdx = working.indexOf(startToken)
        }

        return working
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        let chunk = decoder.decode(value, { stream: true })

        // Extract trace (unused for now), graph, and metadata markers from stream
        chunk = consumeMarker(chunk, '__TRACE__', '__TRACE__', () => {})

        chunk = consumeMarker(chunk, '__GRAPH__', '__GRAPH__', (payload) => {
          try {
            const graph = JSON.parse(payload)
            if (graph && addGraph) {
              addGraph(graph)
            }
          } catch (err) {
            console.error('Failed to parse knowledge graph payload', err)
          }
        })

        chunk = consumeMarker(chunk, '__META__', '__META__', (payload) => {
          try {
            const meta = JSON.parse(payload) as ResponseMetadata
            setMetadata(meta)
          } catch (err) {
            console.error('Failed to parse metadata payload', err)
          }
        })

        textBuffer += chunk
        setOutput(textBuffer)
      }
    } catch (error) {
      console.error('Error:', error)
      setOutput(`**❌ Error:** ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearInput = () => setInput('')
  const handleExampleQuery = () => {
    setInput('Explain how async/await works in JavaScript with a practical example.')
  }
  const handleExportNotes = () => {
    const blob = new Blob([output], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `gyaanforge-notes-${Date.now()}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Floating context bar visibility based on content/streaming
  useEffect(() => {
    const hasContent = output.trim().length > 0
    setShowContextBar(hasContent && !isLoading)
  }, [output, isLoading])

  // Reset insights when there is no supporting data
  useEffect(() => {
    if (!metadata && !getCurrentGraph()) {
      setIsInsightsOpen(false)
    }
  }, [metadata, getCurrentGraph])

  // Auto-hide on scroll with gentle return
  const handleOutputScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (scrollHideTimer.current) {
      clearTimeout(scrollHideTimer.current)
    }
    setContextBarHidden(true)
    scrollHideTimer.current = setTimeout(() => {
      setContextBarHidden(false)
    }, 900)
  }

  const cycleTimebox = () => {
    const order: Array<typeof state.timebox> = ['30s', '2m', 'deep']
    const idx = order.indexOf(state.timebox)
    const next = order[(idx + 1) % order.length]
    setTimebox(next)
  }

  const cyclePerspective = () => {
    const order: Array<typeof state.perspective> = ['story', 'diagram', 'code', 'analogy', 'math']
    const idx = order.indexOf(state.perspective)
    const next = order[(idx + 1) % order.length]
    setPerspective(next)
  }

  const contextItems: ContextBarItem[] = [
    {
      id: 'timebox',
      label: state.timebox === '30s' ? '30s' : state.timebox === '2m' ? '2m' : 'Deep',
      icon: '⏱️',
      dropdown: true,
      onClick: cycleTimebox,
    },
    {
      id: 'perspective',
      label: state.perspective.charAt(0).toUpperCase() + state.perspective.slice(1),
      icon: '🎛️',
      dropdown: true,
      onClick: cyclePerspective,
    },
    {
      id: 'future',
      label: 'Future-You',
      icon: state.futureYou ? '🚀' : '⏳',
      active: state.futureYou,
      onClick: () => setFutureYou(!state.futureYou),
    },
    {
      id: 'practice',
      label: 'Practice',
      icon: '🎯',
      onClick: () => {},
    },
    {
      id: 'quiz',
      label: 'Quiz',
      icon: '🧠',
      onClick: () => {},
    },
  ]

  const currentGraph = getCurrentGraph()

  const insightTabs = useMemo(() => {
    const tabs: Array<{ id: string; label: string; content: React.ReactNode }> = []

    if (currentGraph) {
      tabs.push({ id: 'graph', label: 'Graph', content: <div className="h-[70vh] min-h-[480px]"><KnowledgeGraphVisualizer /></div> })
    }

    if (metadata?.practice) {
      tabs.push({ id: 'practice', label: 'Practice', content: <PracticePanel metadata={metadata} /> })
    }

    if (metadata?.trace) {
      tabs.push({ id: 'why', label: 'Why', content: <TracePanel metadata={metadata} /> })
    }

    if (metadata?.quiz) {
      tabs.push({ id: 'quiz', label: 'Quiz', content: <QuizFlow metadata={metadata} onGenerateQuiz={() => {}} /> })
    }

    return tabs
  }, [currentGraph, metadata])

  useEffect(() => {
    if (insightTabs.length > 0 && !activeInsightTab) {
      setActiveInsightTab(insightTabs[0].id)
    }
    if (insightTabs.length === 0) {
      setActiveInsightTab('')
      setIsInsightsOpen(false)
    }
  }, [insightTabs, activeInsightTab])

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Header 
        onClearInput={handleClearInput}
        onExampleQuery={handleExampleQuery}
        onExportNotes={handleExportNotes}
      />

      {/* Control Bar */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center sm:justify-between">
            {/* Cognitive Load Selector */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Learning Mode
              </p>
              <div className="flex gap-1 bg-white dark:bg-gray-800 rounded-lg p-0.5 border border-gray-200 dark:border-gray-700">
                {(Object.keys(COGNITIVE_LOAD_CONFIG) as CognitiveLoadMode[]).map((loadMode) => (
                  <motion.button
                    key={loadMode}
                    onClick={() => setCognitiveLoad(loadMode)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      cognitiveLoad === loadMode
                        ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {COGNITIVE_LOAD_CONFIG[loadMode].label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Status Badge */}
            <Badge variant={effectiveMode === 'online' ? 'success' : 'warning'}>
              {effectiveMode === 'online' ? '🌐 Online' : '📡 Offline Mode'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 min-w-0"
        >
          <InputPanel
            mode={mode}
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex-1 min-w-0 relative"
        >
          {/* Floating Context Bar */}
          <div className="absolute -top-6 left-0 right-0 flex justify-center z-20">
            <ContextBar
              items={contextItems}
              visible={showContextBar && !contextBarHidden}
            />
          </div>

          <OutputPanel
            content={output}
            isLoading={isLoading}
            onScroll={handleOutputScroll}
          />

          {/* Insights Drawer affordance */}
          <AnimatePresence>
            {insightTabs.length > 0 && output.trim().length > 0 && (
              <motion.button
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0, transition: { duration: 0.2 } }}
                exit={{ opacity: 0, x: 12, transition: { duration: 0.15 } }}
                onClick={() => setIsInsightsOpen(true)}
                className="hidden lg:flex items-center gap-2 absolute right-[-14px] top-1/2 -translate-y-1/2 px-3 py-2 rounded-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border border-white/50 dark:border-gray-800/70 shadow-lg hover:shadow-xl transition-all"
                aria-label="Open insights drawer"
              >
                <span className="text-sm">✦</span>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-200">Insights</span>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Mobile/Tablet affordance */}
      <AnimatePresence>
        {insightTabs.length > 0 && output.trim().length > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.2 } }}
            exit={{ opacity: 0, y: 8, transition: { duration: 0.15 } }}
            onClick={() => setIsInsightsOpen(true)}
            className="lg:hidden fixed bottom-4 right-4 px-4 py-2 rounded-full bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border border-white/60 dark:border-gray-800/70 shadow-lg flex items-center gap-2 z-30"
            aria-label="Open insights drawer"
          >
            <span className="text-sm">✦</span>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-200">Insights</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Insights Drawer */}
      <Drawer
        isOpen={isInsightsOpen}
        onClose={() => setIsInsightsOpen(false)}
        side="right"
        width="lg"
        title="Insights"
        description="Contextual depth when you need it"
      >
        {insightTabs.length > 0 ? (
          <div className="flex flex-col gap-4 h-full">
            <div className="flex items-center gap-2 flex-wrap">
              {insightTabs.map((tab) => (
                <Chip
                  key={tab.id}
                  size="sm"
                  variant={activeInsightTab === tab.id ? 'solid' : 'glass'}
                  active={activeInsightTab === tab.id}
                  onClick={() => setActiveInsightTab(tab.id)}
                >
                  {tab.label}
                </Chip>
              ))}
            </div>

            <div className="flex-1 min-h-[400px] overflow-hidden rounded-2xl border border-white/40 dark:border-gray-800/70 bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl p-4 shadow-inner">
              {insightTabs.map((tab) => (
                tab.id === activeInsightTab ? (
                  <div key={tab.id} className="h-full overflow-y-auto custom-scrollbar">
                    {tab.content}
                  </div>
                ) : null
              ))}
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400">No insights available.</div>
        )}
      </Drawer>
    </div>
  )
}
