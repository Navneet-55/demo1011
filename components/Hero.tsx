"use client"

import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface HeroProps {
  onPrimary?: () => void
  onSecondary?: () => void
}

export function Hero({ onPrimary, onSecondary }: HeroProps) {
  const visualRef = useRef<HTMLDivElement>(null)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const setRM = () => setReduceMotion(mq.matches)
    setRM()
    mq.addEventListener('change', setRM)
    return () => mq.removeEventListener('change', setRM)
  }, [])

  useEffect(() => {
    if (reduceMotion) return
    const el = visualRef.current
    if (!el) return
    const onScroll = () => {
      const y = window.scrollY
      const translateY = Math.min(30, y * 0.06) // gentle parallax
      el.style.transform = `translateY(${translateY}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [reduceMotion])

  return (
    <section id="overview" className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0% -10% 0%' }}
          transition={{ ease: 'easeOut', duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight">
            Pro. Beyond.
          </h1>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A cinematic, premium product page experience inspired by Apple’s iPhone Pro.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={onPrimary}
              className="px-6 py-3 rounded-full bg-black text-white dark:bg-white dark:text-black font-medium hover:opacity-90 transition-opacity"
            >
              Buy
            </button>
            <button
              onClick={onSecondary}
              className="px-6 py-3 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Learn more
            </button>
          </div>
        </motion.div>

        <div ref={visualRef} className="mt-14 sm:mt-20">
          <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700" />
            <Image
              src="/placeholder.svg"
              alt="Product visual"
              fill
              className="object-cover opacity-0"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
