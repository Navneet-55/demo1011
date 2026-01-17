/**
 * UI Primitives
 * Reusable, accessible, responsive components
 * No Tailwind copy-paste; consistent patterns
 */

'use client'

import React, { ReactNode } from 'react'
export { Modal } from './Modal'
export type { } from './Modal'
export { Drawer } from './Drawer'
export type { } from './Drawer'

// ============ SEGMENTED CONTROL ============

export interface SegmentedControlProps<T extends string> {
  options: Array<{ label: string; value: T; icon?: ReactNode }>
  value: T
  onChange: (value: T) => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className = '',
  size = 'md',
}: SegmentedControlProps<T>) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2 text-base',
  }

  return (
    <div
      className={`inline-flex gap-1 bg-slate-200 dark:bg-slate-700 rounded-lg p-1 ${className}`}
      role="radiogroup"
    >
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`
            ${sizeClasses[size]}
            rounded-md font-medium transition-all duration-200 flex items-center gap-1
            ${
              value === option.value
                ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
            }
          `}
          role="radio"
          aria-checked={value === option.value}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  )
}

// ============ TABS ============

export interface TabsProps {
  tabs: Array<{ id: string; label: string; icon?: ReactNode; content: ReactNode }>
  defaultTab?: string
  onChange?: (tabId: string) => void
  className?: string
}

export function Tabs({
  tabs,
  defaultTab,
  onChange,
  className = '',
}: TabsProps) {
  const [active, setActive] = React.useState(defaultTab || tabs[0]?.id || '')

  const handleChange = (tabId: string) => {
    setActive(tabId)
    onChange?.(tabId)
  }

  return (
    <div className={`flex flex-col ${className}`}>
      <div
        className="flex gap-2 border-b border-slate-200 dark:border-slate-700 overflow-x-auto"
        role="tablist"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleChange(tab.id)}
            className={`
              px-4 py-2 font-medium text-sm transition-all duration-200 flex items-center gap-2
              whitespace-nowrap border-b-2 -mb-px
              ${
                active === tab.id
                  ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }
            `}
            role="tab"
            aria-selected={active === tab.id}
            aria-controls={`${tab.id}-panel`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex-1">
        {tabs.map((tab) =>
          active === tab.id ? (
            <div key={tab.id} id={`${tab.id}-panel`} role="tabpanel">
              {tab.content}
            </div>
          ) : null
        )}
      </div>
    </div>
  )
}

// ============ DRAWER ============

export interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  side?: 'left' | 'right'
  size?: 'sm' | 'md' | 'lg'
}

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  side = 'right',
  size = 'md',
}: DrawerProps) {
  const sizeClasses = {
    sm: 'w-64',
    md: 'w-96',
    lg: 'w-[32rem]',
  }

  const sideClasses = {
    left: 'left-0 rounded-r-lg',
    right: 'right-0 rounded-l-lg',
  }

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-200"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        className={`
          fixed top-0 bottom-0 ${sideClasses[side]} ${sizeClasses[size]}
          bg-white dark:bg-slate-900 shadow-xl z-50
          transform transition-transform duration-200 flex flex-col
          ${isOpen ? 'translate-x-0' : side === 'left' ? '-translate-x-full' : 'translate-x-full'}
        `}
        role="dialog"
        aria-labelledby="drawer-title"
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 id="drawer-title" className="text-lg font-semibold">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Close drawer"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>

      {/* Mobile drawer overlay adjustment */}
      <style>{`
        @media (max-width: 768px) {
          .fixed {
            width: 100% !important;
            ${side === 'left' ? 'right: auto;' : 'left: auto;'}
          }
        }
      `}</style>
    </>
  )
}

// ============ BADGE ============

export interface BadgeProps {
  label: string
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'neutral'
  icon?: ReactNode
}

export function Badge({ label, variant = 'neutral', icon }: BadgeProps) {
  const variantClasses = {
    primary: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    success: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    warning: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    error: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
    neutral: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200',
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${variantClasses[variant]}`}>
      {icon}
      {label}
    </span>
  )
}
