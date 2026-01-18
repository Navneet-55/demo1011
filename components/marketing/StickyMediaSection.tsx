"use client"

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Container, typography } from '@/components/ui/primitives'

type Chapter = {
  title: string
  description: string
}

type StickyMediaSectionProps = {
  id: string
  title: string
  subtitle?: string
  chapters: Chapter[]
  mediaPlaceholder?: React.ReactNode
}

export function StickyMediaSection({
  id,
  title,
  subtitle,
  chapters,
  mediaPlaceholder,
}: StickyMediaSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  return (
    <section id={id} ref={sectionRef} className="py-16 sm:py-24">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Sticky Media */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <motion.div style={{ opacity }} className="rounded-2xl overflow-hidden">
              {mediaPlaceholder || (
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                  <span className="text-gray-400 dark:text-gray-600 text-sm">Media Visual</span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Scrolling Content */}
          <div className="space-y-12">
            <div>
              <h2 className={typography.h2}>{title}</h2>
              {subtitle && <p className={`${typography.lead} mt-4`}>{subtitle}</p>}
            </div>

            <div className="space-y-10">
              {chapters.map((chapter, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="space-y-3"
                >
                  <h3 className={typography.h4}>{chapter.title}</h3>
                  <p className={typography.body}>{chapter.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
