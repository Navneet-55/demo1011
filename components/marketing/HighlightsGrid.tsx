"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Container, Card, typography } from '@/components/ui/primitives'

const highlights = [
  { icon: '🎯', title: 'Beginner Mode', desc: 'Chunked delivery for easy cognitive load management.' },
  { icon: '🎓', title: 'Student Mode', desc: 'Balanced depth with optional expansion for deeper dives.' },
  { icon: '⚡', title: 'Mastery Mode', desc: 'Full complexity, instant delivery for advanced learners.' },
  { icon: '🌐', title: 'Hybrid Intelligence', desc: 'Online AI + offline fallback for uninterrupted learning.' },
  { icon: '📊', title: 'Knowledge Graph', desc: 'Visual concept mapping and relationship tracking.' },
  { icon: '🔍', title: 'Stuck Detection', desc: 'Proactive interventions when progress stalls.' },
  { icon: '💾', title: 'Offline First', desc: 'Core features work without internet connectivity.' },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45 },
  },
}

export function HighlightsGrid() {
  return (
    <section id="highlights" className="py-16 sm:py-24 bg-gray-50 dark:bg-gray-900/50">
      <Container>
        <div className="text-center mb-12">
          <h2 className={typography.h2}>Built for how you learn.</h2>
          <p className={`${typography.lead} mt-4`}>
            Seven adaptive features that evolve with your mastery.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-20% 0% -20% 0%' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {highlights.map((h) => (
            <motion.div key={h.title} variants={item}>
              <Card variant="bordered" className="hover:shadow-lg transition-shadow h-full">
                <div className="text-3xl mb-3">{h.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{h.title}</h3>
                <p className={typography.small}>{h.desc}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}
