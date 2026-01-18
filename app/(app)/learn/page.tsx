'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { InputPanel } from '@/components/InputPanel'
import { OutputPanel } from '@/components/OutputPanel'
import { useMode } from '@/components/ModeProvider'
import { useOnlineOffline } from '@/contexts/OnlineOfflineContext'
import { Badge, Button } from '@/components/ui/primitives'
import type { CognitiveLoadMode } from '@/types'
import { COGNITIVE_LOAD_CONFIG } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export default function LearnPage() {
  const { mode } = useMode()
  const { effectiveMode } = useOnlineOffline()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [cognitiveLoad, setCognitiveLoad] = useState<CognitiveLoadMode>('student')

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return
    
    setIsLoading(true)
    setOutput('')
    
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

      let accumulated = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        accumulated += decoder.decode(value, { stream: true })
        setOutput(accumulated)
      }
    } catch (error) {
      console.error('Error:', error)
      setOutput(`**❌ Error:** ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearInput = () => setInput('')
  const handleExampleQuery = (query: string) => setInput(query)
  const handleExportNotes = () => {
    const blob = new Blob([output], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `gyaanforge-notes-${Date.now()}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

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
                  <button
                    key={loadMode}
                    onClick={() => setCognitiveLoad(loadMode)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      cognitiveLoad === loadMode
                        ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {COGNITIVE_LOAD_CONFIG[loadMode].label}
                  </button>
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
      <div className="flex-1 flex flex-col lg:flex-row gap-4 max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex-1 min-w-0">
          <InputPanel
            mode={mode}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>

        <div className="flex-1 min-w-0">
          <OutputPanel
            output={output}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}
