/**
 * Drawer Component
 * Reusable drawer/sidebar for secondary content
 */

'use client'

import React, { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEscapeKey } from '@/lib/keyboard-shortcuts'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  side?: 'left' | 'right'
  children: React.ReactNode
  title?: string
  description?: string
  closeOnBackdrop?: boolean
  closeOnEsc?: boolean
  focusTrap?: boolean
  className?: string
  width?: 'sm' | 'md' | 'lg' | 'xl'
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const widthClasses: Record<string, string> = {
  sm: 'w-80',
  md: 'w-96',
  lg: 'w-[32rem]',
  xl: 'w-[36rem]',
}

export const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      isOpen,
      onClose,
      side = 'right',
      children,
      title,
      description,
      closeOnBackdrop = true,
      closeOnEsc = true,
      focusTrap = true,
      className = '',
      width,
      size,
    },
    ref
  ) => {
    const drawerRef = useRef<HTMLDivElement>(null)
    const previouslyFocusedElement = useRef<HTMLElement | null>(null)
    const reduceMotion = useReducedMotion()

    const resolvedWidth = widthClasses[width || size || 'md'] || widthClasses.md

    useEffect(() => {
      if (!isOpen || !focusTrap) return

      previouslyFocusedElement.current = document.activeElement as HTMLElement

      const drawer = drawerRef.current
      if (!drawer) return

      const focusableElements = drawer.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )

      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement?.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement?.focus()
          }
        }
      }

      firstElement?.focus()
      drawer.addEventListener('keydown', handleKeyDown)

      return () => {
        drawer.removeEventListener('keydown', handleKeyDown)
      }
    }, [isOpen, focusTrap])

    useEffect(() => {
      if (isOpen) return

      const element = previouslyFocusedElement.current
      if (element && 'focus' in element) {
        ;(element as HTMLElement).focus()
      }
    }, [isOpen])

    useEscapeKey(() => {
      if (isOpen && closeOnEsc) {
        onClose()
      }
    })

    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden'
        return () => {
          document.body.style.overflow = 'auto'
        }
      }
    }, [isOpen])

    const slideFrom = side === 'right' ? 32 : -32
    const radius = side === 'right' ? 'rounded-l-3xl' : 'rounded-r-3xl'

    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/50 dark:bg-black/70 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: reduceMotion ? 0 : 0.18 } }}
              exit={{ opacity: 0, transition: { duration: reduceMotion ? 0 : 0.18 } }}
              onClick={() => {
                if (closeOnBackdrop) {
                  onClose()
                }
              }}
              role="presentation"
              aria-hidden="true"
            />

            <motion.aside
              ref={ref || drawerRef}
              initial={{ x: slideFrom, opacity: 0 }}
              animate={{ x: 0, opacity: 1, transition: { duration: reduceMotion ? 0 : 0.22, ease: 'easeOut' } }}
              exit={{ x: slideFrom, opacity: 0, transition: { duration: reduceMotion ? 0 : 0.18, ease: 'easeIn' } }}
              className={`
                fixed top-0 ${side === 'right' ? 'right-0' : 'left-0'} z-50
                h-full max-h-screen flex flex-col
                bg-white/80 dark:bg-gray-950/80 backdrop-blur-2xl border border-white/50 dark:border-gray-800/70
                shadow-[0_20px_60px_-24px_rgba(0,0,0,0.4)]
                ${radius}
                ${resolvedWidth}
                ${className}
              `}
              role="dialog"
              aria-modal="true"
              aria-label={title || 'Drawer'}
            >
              {(title || description) && (
                <div className="flex-shrink-0 border-b border-white/40 dark:border-gray-800/70 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-1">
                      {title && (
                        <h2 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h2>
                      )}
                      {description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
                      )}
                    </div>
                    <button
                      onClick={onClose}
                      className="flex-shrink-0 inline-flex rounded-full p-2 text-gray-500 hover:bg-white/60 hover:text-gray-900 dark:hover:bg-gray-800/80 dark:hover:text-gray-100 transition-colors"
                      aria-label="Close drawer"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-5 sm:p-6 custom-scrollbar">
                {children}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    )
  }
)

Drawer.displayName = 'Drawer'
