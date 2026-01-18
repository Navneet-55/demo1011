"use client"

import React from 'react'
import { useScroll } from './LenisProvider'
import { useActiveSection } from '@/hooks/useActiveSection'

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'highlights', label: 'Highlights' },
  { id: 'design', label: 'Design' },
  { id: 'cameras', label: 'Cameras' },
  { id: 'performance', label: 'Performance' },
  { id: 'shared', label: 'Shared Features' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'specs', label: 'Tech Specs' },
]

export function ProductSubNav() {
  const { lenis, offset } = useScroll()
  const activeId = useActiveSection(SECTIONS.map((s) => s.id), {
    rootMargin: '-50% 0px -50% 0px',
    threshold: [0, 0.25, 0.5, 0.75, 1],
    strategy: 'center',
  })

  const handleClick = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (lenis && !prefersReduced) {
      lenis.scrollTo(el, {
        offset,
        duration: 1.0,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
      })
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="sticky top-14 z-40 bg-white/90 dark:bg-gray-950/90 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 h-12">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => handleClick(s.id)}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors whitespace-nowrap ${
                  activeId === s.id
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <a
            id="buy"
            href="#specs"
            onClick={(e) => {
              e.preventDefault()
              handleClick('specs')
            }}
            className="px-4 py-2 rounded-full bg-black text-white dark:bg-white dark:text-black text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Buy
          </a>
        </div>
      </div>
    </div>
  )
}
