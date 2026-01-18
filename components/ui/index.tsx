/**
 * UI Primitives
 * Reusable, accessible, responsive components
 * No Tailwind copy-paste; consistent patterns
 */

'use client'

import React, { ReactNode } from 'react'
export { Modal } from './Modal'
export { Drawer } from './Drawer'
export { ContextBar } from './ContextBar'
export { Chip } from './primitives'

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
