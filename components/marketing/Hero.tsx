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
    <section id="overview" className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Badge variant="gradient" className="mb-6">
            AI Learning Companion
          </Badge>
          
          <h1 className={`${typography.h1} mb-6`}>
            Learn smarter,
            <br />
            not harder.
          </h1>
          
          <p className={`${typography.lead} max-w-2xl mx-auto mb-10`}>
            GyaanForge adapts to your learning style with intelligent modes, offline support, and enterprise-grade architecture.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={onPrimaryCTA || (() => window.location.href = '/learn')}
            >
              Try GyaanForge
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={onSecondaryCTA}
            >
              Watch demo
            </Button>
          </div>
        </motion.div>

        {/* Subtle parallax background */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 relative"
        >
          <div className="aspect-[16/9] rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
              <span className="text-sm">Product Screenshot</span>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
