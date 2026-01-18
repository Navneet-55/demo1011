"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Container, Card, Button, typography } from '@/components/ui/primitives'

const modes = [
  {
    name: 'Beginner',
    icon: '🎯',
    tagline: 'Gentle learning curve',
    features: ['Chunked content delivery', 'Extended timebox defaults', 'Simple explanations', 'Frequent check-ins'],
    ideal: 'New to the topic',
  },
  {
    name: 'Student',
    icon: '🎓',
    tagline: 'Balanced approach',
    features: ['Moderate complexity', 'Optional deep dives', 'Contextual hints', 'Progress tracking'],
    ideal: 'Building knowledge',
  },
  {
    name: 'Mastery',
    icon: '⚡',
    tagline: 'Maximum efficiency',
    features: ['Full complexity', 'Instant delivery', 'Advanced insights', 'Performance optimized'],
    ideal: 'Expert learners',
  },
]

export function CompareBlock() {
  return (
    <section id="modes" className="py-16 sm:py-24">
      <Container>
        <div className="text-center mb-12">
          <h2 className={typography.h2}>Choose your mode.</h2>
          <p className={`${typography.lead} mt-4`}>
            GyaanForge adapts to your current skill level and learning goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modes.map((mode, idx) => (
            <motion.div
              key={mode.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Card variant="bordered" className="h-full flex flex-col">
                <div className="text-4xl mb-4">{mode.icon}</div>
                <h3 className={`${typography.h3} mb-2`}>{mode.name}</h3>
                <p className={`${typography.body} mb-6`}>{mode.tagline}</p>
                
                <ul className="space-y-2 mb-6 flex-grow">
                  {mode.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <p className="text-xs text-gray-500 dark:text-gray-500">Ideal for: {mode.ideal}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
