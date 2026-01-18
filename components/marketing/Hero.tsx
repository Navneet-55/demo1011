"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Container, Button, Badge, typography } from '@/components/ui/primitives'

type HeroProps = {
  onPrimaryCTA?: () => void
  onSecondaryCTA?: () => void
}

export function Hero({ onPrimaryCTA, onSecondaryCTA }: HeroProps) {
  return (
    <section
      id="overview"
      className="relative overflow-hidden bg-white dark:bg-gray-950"
      style={{ minHeight: '90vh' }}
    >
      {/* Background glow */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="absolute inset-0"
      >
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-blue-500/15 via-purple-500/10 to-transparent blur-3xl" />
      </motion.div>

      <Container className="relative pt-28 pb-20 sm:pt-32 sm:pb-28 lg:pt-40 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="space-y-6"
          >
            <Badge variant="gradient" className="w-fit px-4 py-2 text-sm">
              AI Learning Companion
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white">
              GyaanForge
              <br />
              Learn faster with adaptive intelligence.
            </h1>

            <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl">
              An intelligent learning platform that adapts to your skill level, streams answers in real time, and keeps working offline when you travel or lose connectivity.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Button
                variant="primary"
                size="lg"
                className="rounded-2xl shadow-lg shadow-blue-500/20"
                onClick={onPrimaryCTA || (() => (window.location.href = '/learn'))}
              >
                Try it now
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="rounded-2xl"
                onClick={onSecondaryCTA}
              >
                Watch demo
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          >
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-2xl bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950">
              {/* Play overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onSecondaryCTA}
                  className="h-16 w-16 rounded-full bg-white/90 dark:bg-gray-900/90 shadow-xl border border-gray-200 dark:border-gray-800 flex items-center justify-center"
                  aria-label="Play demo video"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5v14l11-7L8 5z" fill="currentColor" className="text-gray-900 dark:text-white" />
                  </svg>
                </motion.button>
              </div>

              {/* Subtle parallax layers */}
              <motion.div
                aria-hidden
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="absolute inset-0"
              >
                <div className="absolute right-10 top-10 h-28 w-28 rounded-2xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 blur-xl" />
                <div className="absolute left-10 bottom-10 h-24 w-24 rounded-full bg-gradient-to-br from-purple-500/25 to-pink-500/25 blur-2xl" />
              </motion.div>

              <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-500 text-sm">
                Demo preview
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
