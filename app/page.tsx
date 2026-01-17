'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { InputPanel } from '@/components/InputPanel'
import { OutputPanel } from '@/components/OutputPanel'
import { ModeProvider, useMode } from '@/components/ModeProvider'

function HomeContent() {
  const { mode } = useMode()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return

    setIsLoading(true)
    setOutput('')

    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: input.trim(),
          mode,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get explanation')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        let accumulatedText = ''
        
        while (true) {
          const { done, value } = await reader.read()
          
          if (done) break
          
          const chunk = decoder.decode(value, { stream: true })
          accumulatedText += chunk
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

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Header />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-12rem)]">
          {/* Left Panel - Input */}
          <div className="flex flex-col">
            <InputPanel
              mode={mode}
              value={input}
              onChange={setInput}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>

          {/* Right Panel - Output */}
          <div className="flex flex-col">
            <OutputPanel content={output} isLoading={isLoading} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default function Home() {
  return (
    <ModeProvider>
      <HomeContent />
    </ModeProvider>
  )
}
