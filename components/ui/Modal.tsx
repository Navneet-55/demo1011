/**
 * Modal Component
 * Reusable modal base with focus trap and smooth animations
 */

'use client'

import React, { useEffect, useRef, useCallback } from 'react'
import { useEscapeKey } from '@/lib/keyboard-shortcuts'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'fullscreen'
  closeOnBackdrop?: boolean
  closeOnEsc?: boolean
  focusTrap?: boolean
  className?: string
  overlayClassName?: string
}

const sizeClasses: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  fullscreen: 'inset-0',
}

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      children,
      size = 'md',
      closeOnBackdrop = true,
      closeOnEsc = true,
      focusTrap = true,
      className = '',
      overlayClassName = '',
    },
    ref
  ) => {
    const modalRef = useRef<HTMLDivElement>(null)
    const previouslyFocusedElement = useRef<HTMLElement | null>(null)

    // Trap focus inside modal
    useEffect(() => {
      if (!isOpen || !focusTrap) return

      previouslyFocusedElement.current = document.activeElement as HTMLElement

      const modal = modalRef.current
      if (!modal) return

      const focusableElements = modal.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )

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
      modal.addEventListener('keydown', handleKeyDown)

      return () => {
        modal.removeEventListener('keydown', handleKeyDown)
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

    // Prevent body scroll when modal is open
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden'
        return () => {
          document.body.style.overflow = 'auto'
        }
      }
    }, [isOpen])

    if (!isOpen) return null

    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-150 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        } ${overlayClassName}`}
        onClick={(e) => {
          if (closeOnBackdrop && e.target === e.currentTarget) {
            onClose()
          }
        }}
        role="presentation"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
          aria-hidden="true"
        />

        {/* Modal Container */}
        <div
          ref={ref || modalRef}
          className={`
            relative z-10 mx-4 max-h-[90vh] overflow-hidden rounded-xl
            bg-white dark:bg-gray-900 shadow-lg dark:shadow-2xl
            transition-all duration-200
            ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}
            ${size === 'fullscreen' ? 'inset-4 h-auto' : sizeClasses[size] || sizeClasses.md}
            ${className}
          `}
          role="dialog"
          aria-modal="true"
        >
          {children}
        </div>
      </div>
    )
  }
)

Modal.displayName = 'Modal'
