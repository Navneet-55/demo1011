"use client"

import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'

type LenisContextValue = {
  lenis: Lenis | null
  offset: number
}

const LenisContext = createContext<LenisContextValue>({ lenis: null, offset: -64 })

export function LenisProvider({ 
  children, 
  offset, 
  headerSelector = '[data-header]' 
}: { 
  children: React.ReactNode
  offset?: number
  headerSelector?: string
}) {
  const lenisRef = useRef<Lenis | null>(null)
  const [computedOffset, setComputedOffset] = useState(offset ?? -64)

  useEffect(() => {
    // Dynamically compute offset from header if not explicitly provided
    if (offset === undefined && typeof window !== 'undefined') {
      const header = document.querySelector(headerSelector)
      if (header) {
        const height = header.getBoundingClientRect().height
        setComputedOffset(-height)
      }
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true })
    lenisRef.current = lenis

    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [offset, headerSelector])

  return <LenisContext.Provider value={{ lenis: lenisRef.current, offset: offset ?? computedOffset }}>{children}</LenisContext.Provider>
}

export function useLenis() {
  return useContext(LenisContext).lenis
}

export function useScroll() {
  return useContext(LenisContext)
}