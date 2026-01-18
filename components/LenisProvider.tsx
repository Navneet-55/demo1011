"use client"

import React, { createContext, useContext, useEffect, useRef } from 'react'
import Lenis from 'lenis'

type LenisContextValue = {
  lenis: Lenis | null
  offset: number
}

const LenisContext = createContext<LenisContextValue>({ lenis: null, offset: -64 })

export function LenisProvider({ children, offset = -64 }: { children: React.ReactNode; offset?: number }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
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
  }, [])

  return <LenisContext.Provider value={{ lenis: lenisRef.current, offset }}>{children}</LenisContext.Provider>
}

export function useLenis() {
  return useContext(LenisContext).lenis
}

export function useScroll() {
  return useContext(LenisContext)
}