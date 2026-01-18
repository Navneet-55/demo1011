import React from 'react'

export const Container = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { size?: 'sm' | 'md' | 'lg' | 'xl' }
>(({ className = '', size = 'xl', ...props }, ref) => {
  const sizes = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    xl: 'max-w-[1400px]',
  }
  return (
    <div
      ref={ref}
      className={`${sizes[size]} mx-auto px-4 sm:px-6 lg:px-8 ${className}`}
      {...props}
    />
  )
})
Container.displayName = 'Container'

export const Section = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & { id?: string }
>(({ className = '', ...props }, ref) => {
  return (
    <section
      ref={ref}
      className={`py-16 sm:py-24 ${className}`}
      {...props}
    />
  )
})
Section.displayName = 'Section'

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'bordered' | 'glass' }
>(({ className = '', variant = 'default', ...props }, ref) => {
  const variants = {
    default: 'bg-white dark:bg-gray-900 rounded-2xl p-6',
    bordered: 'bg-white/70 dark:bg-gray-900/70 rounded-2xl border border-gray-200 dark:border-gray-800 p-6',
    glass: 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-800/50 p-6',
  }
  return (
    <div
      ref={ref}
      className={`${variants[variant]} ${className}`}
      {...props}
    />
  )
})
Card.displayName = 'Card'

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { 
    variant?: 'primary' | 'secondary' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
  }
>(({ className = '', variant = 'primary', size = 'md', ...props }, ref) => {
  const variants = {
    primary: 'bg-black text-white dark:bg-white dark:text-black hover:opacity-90',
    secondary: 'border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800',
    ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800',
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  )
})
Button.displayName = 'Button'

export const Badge = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { variant?: 'default' | 'gradient' | 'success' | 'warning' }
>(({ className = '', variant = 'default', ...props }, ref) => {
  const variants = {
    default: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
    gradient: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  }
  return (
    <span
      ref={ref}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
      {...props}
    />
  )
})
Badge.displayName = 'Badge'

// Typography utilities
export const typography = {
  h1: 'text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight',
  h2: 'text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight',
  h3: 'text-2xl sm:text-3xl font-semibold tracking-tight',
  h4: 'text-xl sm:text-2xl font-semibold',
  lead: 'text-lg sm:text-xl text-gray-600 dark:text-gray-400',
  body: 'text-base text-gray-600 dark:text-gray-400',
  small: 'text-sm text-gray-500 dark:text-gray-500',
}
