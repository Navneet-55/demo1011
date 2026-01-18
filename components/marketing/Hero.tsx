"use client"

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

type HeroProps = {
  onPlayClick?: () => void
  onPrimaryCTA?: () => void
  onSecondaryCTA?: () => void
}

export function Hero({ onPlayClick, onPrimaryCTA, onSecondaryCTA }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-gray-950 min-h-screen flex items-center">
      {/* Liquid Glass background elements */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        {/* Gradient orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-purple-400/15 dark:bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-600/5 rounded-full blur-3xl" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-block"
            >
              <span className="liquid-glass px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 rounded-full">
                ✨ AI-Powered Learning
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
                Learn smarter with{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  GyaanForge
                </span>
              </h1>
            </motion.div>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl"
            >
              Adaptive explanations that match your skill level. Stream responses in real-time. Learn anywhere, anytime.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Link href="/learn">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-shadow duration-300"
                >
                  Start Learning
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={onPlayClick}
                className="px-8 py-4 rounded-full liquid-glass font-semibold text-gray-900 dark:text-white hover:shadow-lg transition-shadow duration-300 flex items-center justify-center gap-2"
              >
                <span>Watch Demo</span>
                <span>▶</span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-square">
              {/* Liquid Glass Card */}
              <div className="absolute inset-0 liquid-glass-lg rounded-3xl p-8 overflow-hidden">
                {/* Inner glow */}
                <motion.div
                  animate={{ 
                    background: [
                      'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
                      'radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
                      'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
                    ]
                  }}
                  transition={{ duration: 8, repeat: Infinity }}
                  className="absolute inset-0"
                />
                
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-center items-center space-y-6">
                  <div className="text-6xl">🧠</div>
                  <div className="text-center space-y-2">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Adaptive Intelligence</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">Your Personal Tutor</p>
                  </div>
                  <div className="pt-4 space-y-2 w-full">
                    {['📚 Student Mode', '⚙️ Pro Mode', '🌱 Beginner Mode'].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                        className="text-center text-sm text-gray-700 dark:text-gray-300 bg-white/30 dark:bg-gray-900/30 rounded-lg py-2"
                      >
                        {item}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
