"use client"

import React from 'react'
import { Container, Card, typography } from '@/components/ui/primitives'
import { MarketingSubNav } from '@/components/marketing/MarketingSubNav'

export const dynamic = 'force-dynamic'

const features = [
  {
    category: 'Learning Modes',
    items: [
      { name: 'Beginner Mode', desc: 'Chunked delivery with extended timeboxes for gentle learning curves.' },
      { name: 'Student Mode', desc: 'Balanced complexity with optional depth expansion.' },
      { name: 'Mastery Mode', desc: 'Full complexity with instant delivery for experts.' },
    ],
  },
  {
    category: 'Intelligence',
    items: [
      { name: 'Hybrid AI', desc: 'Online Groq + offline fallback for uninterrupted learning.' },
      { name: 'Knowledge Graph', desc: 'Visual concept mapping with relationship tracking.' },
      { name: 'Stuck Detection', desc: 'Proactive interventions when progress stalls.' },
    ],
  },
  {
    category: 'Developer Experience',
    items: [
      { name: 'TypeScript', desc: 'Full type safety with strict mode and Zod validation.' },
      { name: 'Streaming', desc: 'Real-time response streaming for instant feedback.' },
      { name: 'Accessibility', desc: 'WCAG 2.1 AA compliant with keyboard and screen reader support.' },
    ],
  },
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <MarketingSubNav />
      
      <section className="pt-24 pb-16 sm:pt-32 sm:pb-24">
        <Container>
          <div className="text-center mb-16">
            <h1 className={typography.h1}>Everything you need to learn smarter.</h1>
            <p className={`${typography.lead} mt-6 max-w-3xl mx-auto`}>
              GyaanForge combines adaptive learning modes, hybrid intelligence, and enterprise-grade architecture to create the ultimate AI learning companion.
            </p>
          </div>

          <div className="space-y-16">
            {features.map((section) => (
              <div key={section.category}>
                <h2 className={`${typography.h3} mb-8`}>{section.category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {section.items.map((item) => (
                    <Card key={item.name} variant="bordered">
                      <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                      <p className={typography.small}>{item.desc}</p>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  )
}
