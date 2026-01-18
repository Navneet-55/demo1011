'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MarketingSubNav } from '@/components/marketing/MarketingSubNav'
import { VideoModal } from '@/components/marketing/VideoModal'
import Link from 'next/link'
import { Hero } from '@/components/marketing/Hero'

export const dynamic = 'force-dynamic'

// Apple-style section wrapper
const Section = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <section className={`py-20 px-4 sm:px-6 lg:px-8 ${className}`}>
    <div className="max-w-7xl mx-auto">
      {children}
    </div>
  </section>
)

// Feature card with liquid glass
const FeatureCard = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="liquid-glass p-8 group hover:scale-105 transition-transform duration-300"
  >
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
  </motion.div>
)

// Interactive demo component
function ModeDemoSection() {
  const [selectedMode, setSelectedMode] = useState<'Beginner' | 'Student' | 'Pro'>('Student')
  
  const modes = {
    Beginner: {
      title: 'Explain Like I\'m 5',
      description: 'Simple analogies and everyday language to understand any concept from scratch.',
      icon: '🌱',
      demo: 'async/await is like ordering pizza. You place the order and continue your day. When it arrives, you get it. No need to stare at the door! 🍕'
    },
    Student: {
      title: 'Balanced Learning',
      description: 'Clear explanations with essential details. Perfect for understanding the "why" behind concepts.',
      icon: '📚',
      demo: 'async/await is syntactic sugar over Promises. It lets you write asynchronous code that reads synchronously, making concurrent operations cleaner and more readable.'
    },
    Pro: {
      title: 'Deep Technical Dive',
      description: 'In-depth analysis, edge cases, and optimization tips for production expertise.',
      icon: '⚙️',
      demo: 'async/await uses generator semantics. When you await a Promise, control suspends until resolution. Sequential composition of concurrent operations with zero overhead vs Promise.then().'
    }
  }

  return (
    <Section className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Mode Selection */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-apple-headline mb-6">Adaptive Learning Modes</h2>
          <p className="text-apple-subheadline mb-12">
            GyaanForge adapts to your skill level. Choose your learning style.
          </p>
          
          {/* Mode Selector Buttons */}
          <div className="space-y-3">
            {(Object.keys(modes) as Array<keyof typeof modes>).map((mode) => (
              <motion.button
                key={mode}
                onClick={() => setSelectedMode(mode)}
                className={`w-full p-4 text-left rounded-2xl transition-all duration-300 ${
                  selectedMode === mode
                    ? 'liquid-glass bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'
                    : 'liquid-glass hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{modes[mode].icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{mode}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{modes[mode].title}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Live Preview */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <div className="liquid-glass-lg p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedMode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-start gap-4">
                  <span className="text-5xl">{modes[selectedMode].icon}</span>
                  <div>
                    <h4 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                      {modes[selectedMode].title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                      {modes[selectedMode].description}
                    </p>
                    <div className="bg-white/50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                      <p className="text-gray-900 dark:text-white italic">{modes[selectedMode].demo}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </Section>
  )
}

// Features section
function FeaturesSection() {
  const features = [
    { icon: '🧠', title: 'AI-Powered Explanations', description: 'Get instant, adaptive explanations tailored to your learning level.' },
    { icon: '📊', title: 'Knowledge Graph', description: 'Visualize connections between concepts and build deeper understanding.' },
    { icon: '⚡', title: 'Real-time Streaming', description: 'See responses stream in real-time as they\'re being generated.' },
    { icon: '🎯', title: 'Cognitive Load Control', description: 'Choose your complexity level: beginner, student, or pro mode.' },
    { icon: '📱', title: 'Mobile Optimized', description: 'Learn anywhere with our beautifully designed mobile interface.' },
    { icon: '🔒', title: 'Privacy First', description: 'Your learning data stays private. No tracking, no ads.' },
  ]

  return (
    <Section className="bg-white dark:bg-gray-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-apple-headline mb-4">Why GyaanForge?</h2>
        <p className="text-apple-subheadline max-w-2xl mx-auto">
          Designed for learning. Built for mastery. Powered by AI.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, i) => (
          <FeatureCard key={i} {...feature} />
        ))}
      </div>
    </Section>
  )
}

// Performance section
function PerformanceSection() {
  const stats = [
    { label: 'Response Time', value: '<100ms' },
    { label: 'Accuracy', value: '98%' },
    { label: 'Uptime', value: '99.9%' },
  ]

  return (
    <Section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="text-center mb-16">
        <h2 className="text-apple-headline mb-4">Built for Performance</h2>
        <p className="text-apple-subheadline">Lightning-fast, reliable, and always available when you need it.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="liquid-glass p-8 text-center"
          >
            <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">{stat.value}</div>
            <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}

// CTA Section
function CTASection() {
  return (
    <Section className="bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center max-w-2xl mx-auto"
      >
        <h2 className="text-apple-headline mb-6 text-white">Ready to Learn?</h2>
        <p className="text-apple-subheadline mb-8 text-blue-100">
          Start your learning journey with GyaanForge today. Adaptive, intelligent, and always with you.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/learn">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-full bg-white text-blue-600 font-semibold hover:bg-blue-50 transition-colors duration-300"
            >
              Start Learning
            </motion.button>
          </Link>
          <button
            onClick={() => {}}
            className="px-8 py-3 rounded-full border-2 border-white text-white font-semibold hover:bg-white/10 transition-colors duration-300"
          >
            Learn More
          </button>
        </div>
      </motion.div>
    </Section>
  )
}

export default function LandingPage() {
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 overflow-hidden">
      <MarketingSubNav />
      
      {/* Hero Section */}
      <Hero onPlayClick={() => setIsVideoOpen(true)} />
      
      {/* Main Sections */}
      <ModeDemoSection />
      <FeaturesSection />
      <PerformanceSection />
      <CTASection />

      {/* Video Modal */}
      <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 GyaanForge. Designed with Apple-style elegance. Built for learning.</p>
        </div>
      </footer>
    </div>
  )
}
