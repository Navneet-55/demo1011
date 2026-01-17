'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { InputPanel } from '@/components/InputPanel'
import { OutputPanel } from '@/components/OutputPanel'
import DevCopilot from '@/components/DevCopilot'
import WhyThisAnswer from '@/components/WhyThisAnswer'
import ImpactWidget from '@/components/ImpactWidget'
import { useMode } from '@/components/ModeProvider'
import { useOnlineOffline } from '@/contexts/OnlineOfflineContext'
import { ExplanationTrace, ImpactMetrics, Intent } from '@/types'
import { storageUtils } from '@/lib/localStorage'

export const dynamic = 'force-dynamic'

export default function Home() {
  const { mode } = useMode()
  const { effectiveMode } = useOnlineOffline()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [trace, setTrace] = useState<ExplanationTrace | null>(null)
  const [currentIntent, setCurrentIntent] = useState<Intent>('general')
  const [showDevCopilot, setShowDevCopilot] = useState(false)

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
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get explanation')
      }

      // Check if it's a clarification response
      const contentType = response.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        const data = await response.json()
        if (data.type === 'clarification') {
          setOutput(
            `**🤔 I need some clarification:**\n\n${data.questions
              .map((q: string, i: number) => `${i + 1}. ${q}`)
              .join('\n')}\n\n*Please provide more details so I can help you better.*`
          )
          setTrace(data.trace)
          setCurrentIntent(data.trace.intent)
          setIsLoading(false)
          return
        }
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        let accumulatedText = ''
        let traceExtracted = false

        while (true) {
          const { done, value } = await reader.read()

          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          accumulatedText += chunk

          // Extract trace if present
          if (!traceExtracted && accumulatedText.includes('__TRACE__')) {
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

          setOutput(accumulatedText)
        }
      }
    } catch (error) {
      console.error('Error:', error)
      setOutput('Sorry, something went wrong. Please try again.')
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

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Header />

      {/* Mode Toggle */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            GyaanForge
          </h1>
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
            <div className="flex flex-col space-y-4">
              <OutputPanel content={output} isLoading={isLoading} />
              {trace && <WhyThisAnswer trace={trace} />}
            </div>
          </div>
        ) : (
          /* Standard View */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-16rem)]">
            <div className="flex flex-col">
              <InputPanel
                mode={mode}
                value={input}
                onChange={setInput}
                onSubmit={() => handleSubmit()}
                isLoading={isLoading}
              />
            </div>
            <div className="flex flex-col space-y-4">
              <OutputPanel content={output} isLoading={isLoading} />
              {trace && <WhyThisAnswer trace={trace} />}
            </div>
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
    </div>
  )
}
