"use client"

import React from 'react'
import { motion } from 'framer-motion'

interface SectionLayoutProps {
  id: string
  title: string
  description: string
  media: React.ReactNode
  children?: React.ReactNode
}

export function SectionLayout({ id, title, description, media, children }: SectionLayoutProps) {
  return (
    <section id={id} className="py-20 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Sticky Media on desktop */}
          <div className="lg:sticky lg:top-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0% -10% 0%' }}
              transition={{ ease: 'easeOut', duration: 0.5 }}
              className="rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg"
            >
              {media}
            </motion.div>
          </div>
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ease: 'easeOut', duration: 0.5 }}
              className="text-3xl sm:text-5xl font-semibold tracking-tight"
            >
              {title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ease: 'easeOut', duration: 0.5, delay: 0.1 }}
              className="mt-4 text-lg text-gray-600 dark:text-gray-400"
            >
              {description}
            </motion.p>
            <div className="mt-8 space-y-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
