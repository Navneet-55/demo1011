"use client"

import React from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Chip } from './primitives'
import { duration, easing, distance, scale } from '@/lib/motion/tokens'

export type ContextBarItem = {
  id: string
  label: string
  icon?: React.ReactNode
  active?: boolean
  dropdown?: boolean
  badge?: string
  disabled?: boolean
  onClick?: () => void
}

interface ContextBarProps {
  items: ContextBarItem[]
  visible?: boolean
  className?: string
  actionSlot?: React.ReactNode
}

/**
 * Floating glass context bar used to surface adaptive controls without clutter.
 * Animates in/out and keeps pointer events scoped to the bar.
 */
export function ContextBar({ items, visible = true, className = '', actionSlot }: ContextBarProps) {
  const reduceMotion = useReducedMotion()
  
  const animDuration = reduceMotion ? 0 : duration.base
  const exitDuration = reduceMotion ? 0 : duration.fast

  return (
    <AnimatePresence>
      {visible && items.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: distance.sm, scale: 0.99 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            transition: { duration: animDuration, ease: easing.easeOut } 
          }}
          exit={{ 
            opacity: 0, 
            y: distance.sm, 
            scale: 0.98, 
            transition: { duration: exitDuration, ease: easing.easeOut } 
          }}
          className={`pointer-events-none flex justify-center ${className}`}
        >
          <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-2xl border border-white/50 dark:border-gray-800/70 shadow-[0_20px_60px_-24px_rgba(0,0,0,0.45)] px-3 py-2">
            {items.map((item) => (
              <Chip
                key={item.id}
                size="sm"
                variant="glass"
                active={item.active}
                onClick={item.onClick}
                disabled={item.disabled}
                leading={item.icon}
                trailing={item.dropdown ? '▾' : item.badge}
                className="min-w-[64px]"
              >
                {item.label}
              </Chip>
            ))}
            {actionSlot}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
