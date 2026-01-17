"use client"

import React, { useEffect } from 'react'
import { GlobalNav } from '@/components/GlobalNav'
import { ProductSubNav } from '@/components/ProductSubNav'
import { Hero } from '@/components/Hero'
import { Highlights } from '@/components/Highlights'
import { SectionLayout } from '@/components/SectionLayout'
import { ColorPicker } from '@/components/ColorPicker'
import { ZoomSelector } from '@/components/ZoomSelector'
import { CompareCards } from '@/components/CompareCards'
import { Footer } from '@/components/Footer'
import Lenis from 'lenis'

export const dynamic = 'force-dynamic'

export default function Page() {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true })
    let rafId: number
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <GlobalNav />
      <ProductSubNav />

      <Hero onPrimary={() => document.getElementById('specs')?.scrollIntoView({ behavior: 'smooth' })} />
      <Highlights />

      {/* Design */}
      <SectionLayout
        id="design"
        title="Design"
        description="Refined materials, precision machining, and a finish that feels premium."
        media={<div className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700" />}
      >
        <ColorPicker />
      </SectionLayout>

      {/* Cameras */}
      <SectionLayout
        id="cameras"
        title="Cameras"
        description="Versatile focal lengths and computational photography for stunning shots."
        media={<div className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700" />}
      >
        <ZoomSelector />
      </SectionLayout>

      {/* Performance */}
      <SectionLayout
        id="performance"
        title="Performance"
        description="Pro-class chip, cool under pressure, with battery optimized for your day."
        media={<div className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700" />}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">CPU</p>
            <p className="text-2xl font-semibold">+30%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">year-over-year performance</p>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">GPU</p>
            <p className="text-2xl font-semibold">+40%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">graphics uplift</p>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">Cooling</p>
            <p className="text-sm">Vapor chamber design</p>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">Battery</p>
            <p className="text-sm">All‑day battery life</p>
          </div>
        </div>
      </SectionLayout>

      {/* Feature strip + comparison */}
      <CompareCards />

      {/* Accessories */}
      <section id="accessories" className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight">Accessories.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {[1,2,3].map((i) => (
              <div key={i} className="rounded-2xl border border-gray-200 dark:border-gray-800 p-6 bg-white/70 dark:bg-gray-900/70 hover:shadow-lg transition-shadow">
                <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700" />
                <h3 className="mt-4 font-semibold">Accessory {i}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Premium add‑ons designed to complement your device.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specs */}
      <section id="specs" className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight">Tech Specs.</h2>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            {['Chip','Display','Camera','Battery','Storage','Connectivity'].map((spec) => (
              <div key={spec} className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                <h4 className="font-semibold">{spec}</h4>
                <ul className="mt-3 space-y-2 text-gray-600 dark:text-gray-400">
                  <li>Detail one</li>
                  <li>Detail two</li>
                  <li>Detail three</li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}