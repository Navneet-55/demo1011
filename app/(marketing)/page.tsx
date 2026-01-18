'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MarketingSubNav } from '@/components/marketing/MarketingSubNav'
import { VideoModal } from '@/components/marketing/VideoModal'
import { Container, Section, Card, Button, Badge, typography } from '@/components/ui/primitives'
import type { Mode } from '@/components/ModeProvider'
import Link from 'next/link'
import { Hero } from '@/components/marketing/Hero'

export const dynamic = 'force-dynamic'

// Interactive demo components
function ModeDemoSection() {
  const [selectedMode, setSelectedMode] = useState<Mode>('Student')
  
  const modeDescriptions: Record<Mode, { title: string; description: string; icon: string }> = {
    Beginner: {
      title: 'Explain Like I\'m 5',
      description: 'Simple analogies, everyday language, step-by-step guidance. Perfect for learning new concepts from scratch.',
      icon: '🌱'
    },
    Student: {
      title: 'Balanced Learning',
      description: 'Clear explanations with moderate detail. Ideal for students wanting to understand the "why" behind concepts.',
      icon: '📚'
    },
    Pro: {
      title: 'Deep Technical Dive',
      description: 'In-depth technical analysis, edge cases, optimization tips. For mastery and production expertise.',
      icon: '⚙️'
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Mode Selector */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={`${typography.h2} mb-6`}>Adaptive Learning Modes</h2>
            <p className={`${typography.lead} mb-8`}>
              Choose how you want to learn. GyaanForge adapts its explanations to match your skill level.
            </p>

            {/* Mode Toggle */}
            <div className="flex gap-2 mb-8 bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700 w-fit">
              {(Object.keys(modeDescriptions) as Mode[]).map((mode) => (
                <motion.button
                  key={mode}
                  onClick={() => setSelectedMode(mode)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    selectedMode === mode
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {mode}
                </motion.button>
              ))}
            </div>

            {/* Mode Description */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedMode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{modeDescriptions[selectedMode].icon}</span>
                  <div>
                    <h3 className={`${typography.h4} mb-2`}>{modeDescriptions[selectedMode].title}</h3>
                    <p className={typography.body}>{modeDescriptions[selectedMode].description}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Sample Explanation Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
              <Card variant="glass" className="p-6 min-h-96">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="default">Sample Response</Badge>
                <Badge variant="success">Live Preview</Badge>
              </div>
              
              <AnimatePresence mode="wait">
                {selectedMode === 'Beginner' && (
                  <motion.div
                    key="beginner"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    <h4 className={`${typography.h4}`}>What is async/await?</h4>
                    <p className={typography.body}>
                      Think of it like ordering pizza. You place the order (async) and continue watching TV while waiting. When the pizza arrives (await), you get it. You don&apos;t have to stare at the door! 🍕
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border-l-4 border-blue-500">
                      <p className={`${typography.small}`}><strong>Key idea:</strong> Let JavaScript keep working while waiting for results.</p>
                    </div>
                  </motion.div>
                )}
                
                {selectedMode === 'Student' && (
                  <motion.div
                    key="student"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    <h4 className={`${typography.h4}`}>What is async/await?</h4>
                    <p className={typography.body}>
                      Async/await is syntactic sugar over Promises that lets you write asynchronous code that looks synchronous. It makes handling concurrent operations cleaner and more readable.
                    </p>
                    <code className="text-xs bg-gray-900 text-gray-100 p-2 rounded block whitespace-pre-wrap">
{`const data = await fetchData();
// Code waits here until Promise resolves`}
                    </code>
                    <p className={`${typography.small}`}><strong>Why use it?</strong> Better readability than promise chains; easier error handling with try/catch.</p>
                  </motion.div>
                )}
                
                {selectedMode === 'Pro' && (
                  <motion.div
                    key="pro"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    <h4 className={`${typography.h4}`}>What is async/await?</h4>
                    <p className={typography.body}>
                      Async/await is a syntactic abstraction over Promises that uses generator-like semantics. When you await a Promise, control is suspended until resolution, enabling sequential composition of concurrent operations.
                    </p>
                    <code className="text-xs bg-gray-900 text-gray-100 p-2 rounded block whitespace-pre-wrap">
{`async fn() => {
  const [a, b] = await Promise.all([fetch1(), fetch2()]);
  // Parallel execution with sequential syntax
}`}
                    </code>
                    <div className="space-y-1 text-xs">
                      <p><strong>Performance:</strong> Zero overhead vs Promise.then(); compiled to identical bytecode.</p>
                      <p><strong>Gotcha:</strong> Sequential awaits don&apos;t parallelize. Use Promise.all() for concurrent ops.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </div>
    </div>
  )
}

// Hybrid Intelligence Demo
function HybridDemoSection() {
  const [isOnline, setIsOnline] = useState(true)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center border-t border-gray-200 dark:border-gray-800 pt-12">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={`${typography.h2} mb-6`}>Online/Offline Hybrid</h2>
            <p className={`${typography.lead} mb-8`}>
              Never lose access. GyaanForge works online with streaming AI, and offline with smart local patterns.
            </p>

            <div className="space-y-4 mb-8">
              <Card>
                <Badge variant="success" className="mb-3">🌐 Online Mode</Badge>
                <h4 className={`${typography.h4} mb-2`}>Streaming AI Explanations</h4>
                <p className={typography.body}>Connected to Groq for real-time, token-by-token streaming explanations.</p>
              </Card>

              <Card>
                <Badge variant="warning" className="mb-3">📡 Offline Mode</Badge>
                <h4 className={`${typography.h4} mb-2`}>Local Pattern Matching</h4>
                <p className={typography.body}>Use built-in knowledge for common errors, concepts, and questions.</p>
              </Card>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOnline(!isOnline)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  isOnline
                    ? 'bg-blue-600 text-white'
                    : 'bg-amber-600 text-white'
                }`}
              >
                {isOnline ? '🌐 Switch to Offline' : '📡 Switch to Online'}
              </motion.button>
              <span className={typography.small}>
                Currently: {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </motion.div>

          {/* Demo Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card variant={isOnline ? 'glass' : 'default'} className="p-8 min-h-96 flex flex-col justify-between border-l-4 border-amber-600">
              <div>
                <Badge variant={isOnline ? 'success' : 'warning'} className="mb-4">
                  {isOnline ? '🌐 Online' : '📡 Offline'}
                </Badge>
                <h3 className={`${typography.h3} mb-4`}>
                  {isOnline ? 'AI-Powered' : 'Local Pattern'}
                </h3>
                <p className={typography.body}>
                  {isOnline
                    ? 'Real-time streaming from advanced LLMs. Intelligent routing based on query complexity. Fallback to local when offline.'
                    : 'Lightning-fast local inference. Pattern-based responses for common questions. Zero latency, no API calls needed.'}
                </p>
              </div>
              
              <motion.div
                animate={{ y: isOnline ? 0 : 10 }}
                className="mt-8 p-4 bg-gray-900/10 dark:bg-white/5 rounded-lg border border-gray-200/50 dark:border-white/10"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{isOnline ? '✨' : '⚡'}</span>
                  <span className={typography.small}>
                    {isOnline ? 'Streaming response...' : 'Instant response'}
                  </span>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {isOnline ? 'Token-by-token delivery' : 'Cached pattern match'}
                </div>
              </motion.div>
            </Card>
          </motion.div>
        </div>
    </div>
  )
}
export default function LandingPage() {
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 overflow-hidden">
      <MarketingSubNav />
      
      <Hero
        onPrimaryCTA={() => (window.location.href = '/learn')}
        onSecondaryCTA={() => setIsVideoOpen(true)}
      />

      {/* FEATURES - Simplified to 4 key ones */}
      <Section id="highlights" className="py-28 sm:py-32">
        <Container size="lg">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24"
          >
            <div>
              <div className="text-6xl md:text-7xl font-black mb-8 text-gray-900 dark:text-white">
                Adapts to You
              </div>
              <p className={`${typography.h4} text-gray-700 dark:text-gray-300 leading-relaxed`}>
                Whether you&apos;re learning your first concept or mastering advanced topics, GyaanForge adjusts in real-time. Beginner mode? Complex technical deep-dive? We&apos;ve got you.
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-3xl flex items-center justify-center text-8xl"
            >
              🎯
            </motion.div>
          </motion.div>
        </Container>
      </Section>

      {/* SPACER */}
      <section className="h-32 md:h-48" />

      {/* MODES - Interactive */}
      <Section id="modes" className="py-32 bg-gray-50 dark:bg-gray-900/50">
        <Container size="lg">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-6xl md:text-7xl font-black mb-16 text-gray-900 dark:text-white">
              Choose Your Path
            </div>
          </motion.div>

          <ModeDemoSection />
        </Container>
      </Section>

      {/* SPACER */}
      <section className="h-32 md:h-48" />

      {/* HYBRID - Interactive */}
      <Section id="hybrid" className="py-32">
        <Container size="lg">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-6xl md:text-7xl font-black mb-16 text-gray-900 dark:text-white">
              Always Connected
            </div>
          </motion.div>

          <HybridDemoSection />
        </Container>
      </Section>

      {/* SPACER */}
      <section className="h-32 md:h-48" />

      {/* STATS - Bold display */}
      <Section id="performance" className="py-32 bg-gray-900 dark:bg-black">
        <Container size="lg">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl md:text-7xl font-black text-white mb-6">Built for You</h2>
            <p className="text-2xl text-gray-300 max-w-2xl mx-auto">Enterprise-grade performance, simplified.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { label: 'Response Time', value: '<500ms', icon: '⚡' },
              { label: 'Learning Modes', value: '3', icon: '🎯' },
              { label: 'Offline Ready', value: '100%', icon: '📡' },
              { label: 'WCAG AA', value: 'Certified', icon: '♿' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-8"
              >
                <div className="text-6xl mb-4">{stat.icon}</div>
                <div className="text-5xl font-black text-white mb-2">{stat.value}</div>
                <div className="text-xl text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* SPACER */}
      <section className="h-32 md:h-48" />

      {/* FINAL CTA */}
      <Section className="py-32">
        <Container size="lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-900 dark:to-purple-900 rounded-3xl p-16 md:p-24"
          >
            <h2 className="text-5xl md:text-6xl font-black text-white mb-8">
              Ready?
            </h2>
            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
              Experience adaptive learning that works for your brain, not against it.
            </p>
            <Link href="/learn">
              <Button 
                variant="primary" 
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 dark:bg-white dark:text-blue-900 px-12 py-4 text-lg"
              >
                Start Learning Now
              </Button>
            </Link>
          </motion.div>
        </Container>
      </Section>

      {/* SPACER */}
      <section className="h-16 md:h-32" />

      {/* Footer - Minimal */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-16 bg-white dark:bg-gray-950">
        <Container size="lg">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                © 2024 GyaanForge. Learning reimagined.
              </p>
            </div>
            <div className="flex gap-8 text-sm">
              <a href="#" className="text-blue-600 hover:underline">Docs</a>
              <a href="#" className="text-blue-600 hover:underline">Community</a>
              <a href="#" className="text-blue-600 hover:underline">Twitter</a>
            </div>
          </div>
        </Container>
      </footer>

      {/* Video Modal */}
      <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
    </div>
  )
}
