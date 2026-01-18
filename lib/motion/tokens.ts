/**
 * Apple-style Motion Tokens
 * Centralized animation values for consistent, subtle interactions
 */

import type { Transition, Variants } from 'framer-motion'

/**
 * Duration tokens (in seconds)
 * Apple typically uses 120–280ms for UI micro-interactions
 */
export const duration = {
  instant: 0.12,     // 120ms - instant feedback (button press)
  fast: 0.16,        // 160ms - quick transitions (hover states)
  base: 0.22,        // 220ms - standard transitions (drawers, modals)
  slow: 0.28,        // 280ms - deliberate transitions (page changes)
} as const

/**
 * Easing functions
 * Apple favors ease-out for natural, responsive feel
 */
export const easing = {
  // Smooth deceleration - most common for UI interactions
  easeOut: [0.16, 1, 0.3, 1],
  
  // Gentle ease-out - for subtle micro-interactions
  easeOutSoft: [0.25, 0.46, 0.45, 0.94],
  
  // Sharp ease-out - for snappy actions
  easeOutQuart: [0.25, 1, 0.5, 1],
  
  // Two-way transitions
  easeInOut: [0.42, 0, 0.58, 1],
} as const

/**
 * Distance tokens for translations (in pixels)
 * Keep movements subtle - Apple uses small, purposeful distances
 */
export const distance = {
  xs: 4,   // Micro feedback
  sm: 6,   // Subtle entrance
  md: 10,  // Standard slide
  lg: 16,  // Pronounced movement
  xl: 32,  // Drawer/modal slides
} as const

/**
 * Scale tokens for zoom effects
 */
export const scale = {
  down: 0.98,   // Press feedback
  up: 1.02,     // Hover lift
  upLg: 1.05,   // Pronounced lift
} as const

/**
 * Default transition for most UI interactions
 */
export const defaultTransition: Transition = {
  duration: duration.fast,
  ease: easing.easeOutSoft,
}

/**
 * Transition presets for common patterns
 */
export const transitions = {
  // Micro-interaction (button press, chip toggle)
  micro: {
    duration: duration.instant,
    ease: easing.easeOut,
  },
  
  // Quick interaction (hover, focus)
  quick: {
    duration: duration.fast,
    ease: easing.easeOutSoft,
  },
  
  // Standard (drawer, modal)
  standard: {
    duration: duration.base,
    ease: easing.easeOut,
  },
  
  // Slow (page transition)
  slow: {
    duration: duration.slow,
    ease: easing.easeInOut,
  },
} as const

/**
 * Reusable animation variants
 */

// Fade up from below (entrance)
export const fadeUpSm: Variants = {
  initial: { opacity: 0, y: distance.sm },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: transitions.quick,
  },
  exit: { 
    opacity: 0, 
    y: distance.sm,
    transition: transitions.micro,
  },
}

// Scale + fade (popover, tooltip)
export const scaleFade: Variants = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: transitions.quick,
  },
  exit: { 
    opacity: 0, 
    scale: 0.96,
    transition: transitions.micro,
  },
}

// Right drawer slide
export const drawerRight: Variants = {
  initial: { x: distance.xl, opacity: 0 },
  animate: { 
    x: 0, 
    opacity: 1,
    transition: transitions.standard,
  },
  exit: { 
    x: distance.xl, 
    opacity: 0,
    transition: { duration: duration.fast, ease: easing.easeOut },
  },
}

// Left drawer slide
export const drawerLeft: Variants = {
  initial: { x: -distance.xl, opacity: 0 },
  animate: { 
    x: 0, 
    opacity: 1,
    transition: transitions.standard,
  },
  exit: { 
    x: -distance.xl, 
    opacity: 0,
    transition: { duration: duration.fast, ease: easing.easeOut },
  },
}

// Bottom sheet (mobile)
export const sheetBottom: Variants = {
  initial: { y: '100%', opacity: 0 },
  animate: { 
    y: 0, 
    opacity: 1,
    transition: transitions.standard,
  },
  exit: { 
    y: '100%', 
    opacity: 0,
    transition: { duration: duration.fast, ease: easing.easeOut },
  },
}

// Tab content swap (cross-fade with slight movement)
export const tabSwap: Variants = {
  initial: { opacity: 0, x: -distance.xs },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: transitions.quick,
  },
  exit: { 
    opacity: 0, 
    x: distance.xs,
    transition: { duration: duration.instant, ease: easing.easeOut },
  },
}

/**
 * Interaction gesture values for whileHover/whileTap
 */
export const gestures = {
  // Button/chip hover
  hoverLift: {
    scale: scale.up,
    transition: transitions.micro,
  },
  
  // Button/chip press
  press: {
    scale: scale.down,
    transition: transitions.micro,
  },
  
  // Card hover (subtle)
  cardHover: {
    y: -2,
    transition: transitions.quick,
  },
}

/**
 * Helper to disable animations when user prefers reduced motion
 */
export const getReducedMotionVariants = (variants: Variants, reduceMotion: boolean): Variants => {
  if (!reduceMotion) return variants
  
  // Return instant transitions with no movement
  return Object.keys(variants).reduce((acc, key) => {
    acc[key] = { opacity: key === 'initial' ? 0 : 1, transition: { duration: 0 } }
    return acc
  }, {} as Variants)
}
