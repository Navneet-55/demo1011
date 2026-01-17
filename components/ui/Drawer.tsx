/**
 * Drawer Component
 * Reusable drawer/sidebar for secondary content
 */

'use client'

import React, { useEffect, useRef } from 'react'
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
      width = 'md',
    },
    ref
  ) => {
    const drawerRef = useRef<HTMLDivElement>(null)
    const previouslyFocusedElement = useRef<HTMLElement | null>(null)

    // Trap focus inside drawer
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

    // Restore previous focus on close
    useEffect(() => {
      if (isOpen) return

      const element = previouslyFocusedElement.current
      if (element && 'focus' in element) {
        ;(element as HTMLElement).focus()
      }
    }, [isOpen])

    // Handle escape key
    useEscapeKey(() => {
      if (isOpen && closeOnEsc) {
        onClose()
      }
    })

    // Prevent body scroll when drawer is open
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden'
        return () => {
          document.body.style.overflow = 'auto'
        }
      }
    }, [isOpen])

    const slideDirection = side === 'right' ? 'translate-x-full' : '-translate-x-full'
    const slideActive = side === 'right' ? 'translate-x-0' : 'translate-x-0'

    return (
      <>
        {/* Backdrop */}
        {isOpen && (
          <div
            className={`fixed inset-0 z-40 bg-black/50 dark:bg-black/70 backdrop-blur-sm transition-opacity duration-200 ${
              isOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => {
              if (closeOnBackdrop) {
                onClose()
              }
            }}
            role="presentation"
            aria-hidden="true"
          />
        )}

        {/* Drawer */}
        <div
          ref={ref || drawerRef}
          className={`
            fixed top-0 ${side === 'right' ? 'right-0' : 'left-0'} z-50
            h-full max-h-screen flex flex-col
            bg-white dark:bg-gray-900 shadow-xl
            transition-transform duration-250 ease-out
            ${isOpen ? slideActive : slideDirection}
            ${widthClasses[width] || widthClasses.md}
            ${className}
          `}
          role="complementary"
          aria-hidden={!isOpen}
        >
          {/* Header */}
          {(title || description) && (
            <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-800 p-4 sm:px-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {title && (
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
                  )}
                  {description && (
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="ml-2 inline-flex rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300 transition-colors"
                  aria-label="Close drawer"
                >
                  <svg
                    className="h-6 w-6"
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

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:px-6">{children}</div>
        </div>
      </>
    )
  }
)

Drawer.displayName = 'Drawer'
