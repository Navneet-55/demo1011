"use client"

import React, { useState } from 'react'
import { MarketingSubNav } from '@/components/marketing/MarketingSubNav'
import { Hero } from '@/components/marketing/Hero'
import { HighlightsGrid } from '@/components/marketing/HighlightsGrid'
import { CompareBlock } from '@/components/marketing/CompareBlock'
import { StickyMediaSection } from '@/components/marketing/StickyMediaSection'
import { VideoModal } from '@/components/marketing/VideoModal'
import { Container, Button, Card, typography } from '@/components/ui/primitives'

export const dynamic = 'force-dynamic'

export default function MarketingPage() {
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <MarketingSubNav />
      
      <Hero
        onPrimaryCTA={() => window.location.href = '/learn'}
        onSecondaryCTA={() => setIsVideoOpen(true)}
      />
      
      <HighlightsGrid />
      
      <CompareBlock />
      
      <StickyMediaSection
        id="hybrid"
        title="Hybrid intelligence."
        subtitle="The best of both worlds: online AI with offline resilience."
        chapters={[
          {
            title: 'Online AI First',
            description: 'Connect to Groq for blazing-fast inference with state-of-the-art models when online.',
          },
          {
            title: 'Offline Fallback',
            description: 'Automatic failover to cached responses and local processing when offline.',
          },
          {
            title: 'Seamless Transition',
            description: 'No interruption to your workflow. The system handles mode switching transparently.',
          },
        ]}
      />

      <StickyMediaSection
        id="architecture"
        title="Built to scale."
        subtitle="Enterprise-grade architecture with TypeScript, Next.js 14, and modern patterns."
        chapters={[
          {
            title: 'Type-Safe',
            description: 'Full TypeScript coverage with strict mode, Zod validation, and compile-time safety.',
          },
          {
            title: 'Performant',
            description: 'Streaming responses, optimistic UI, and intelligent caching for instant interactions.',
          },
          {
            title: 'Accessible',
            description: 'WCAG 2.1 AA compliant with keyboard navigation, screen reader support, and reduced motion respect.',
          },
        ]}
      />

      <section id="performance" className="py-16 sm:py-24 bg-gray-50 dark:bg-gray-900/50">
        <Container>
          <div className="text-center mb-12">
            <h2 className={typography.h2}>Performance that matters.</h2>
            <p className={`${typography.lead} mt-4`}>
              Built for speed, reliability, and scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { metric: '<100ms', label: 'UI Response Time', desc: 'Instant feedback on every interaction' },
              { metric: '99.9%', label: 'Uptime SLA', desc: 'Enterprise-grade reliability' },
              { metric: '24/7', label: 'Offline Ready', desc: 'Learn anywhere, anytime' },
            ].map((stat) => (
              <Card key={stat.label} variant="bordered" className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.metric}
                </div>
                <h3 className="font-semibold mb-2">{stat.label}</h3>
                <p className={typography.small}>{stat.desc}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section id="docs" className="py-16 sm:py-24">
        <Container className="text-center">
          <h2 className={typography.h2}>Ready to explore?</h2>
          <p className={`${typography.lead} mt-4 mb-8`}>
            Comprehensive documentation and guides to get you started.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button variant="secondary" size="lg">
              View Documentation
            </Button>
            <Button variant="ghost" size="lg">
              API Reference
            </Button>
          </div>
        </Container>
      </section>

      <section id="try" className="py-16 sm:py-24 bg-black text-white">
        <Container className="text-center">
          <h2 className={`${typography.h2} text-white mb-6`}>
            Start learning smarter today.
          </h2>
          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
            Join thousands of learners mastering new skills with GyaanForge&apos;s adaptive AI companion.
          </p>
          <Button
            variant="primary"
            size="lg"
            className="bg-white text-black hover:bg-gray-100"
            onClick={() => window.location.href = '/learn'}
          >
            Try GyaanForge Free
          </Button>
        </Container>
      </section>

      <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
    </div>
  )
}
