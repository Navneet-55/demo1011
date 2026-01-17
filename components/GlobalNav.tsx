"use client"

import React from 'react'
import Link from 'next/link'

export function GlobalNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl" aria-hidden>⚒️</span>
          <span className="font-semibold tracking-tight">GyaanForge</span>
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link href="#overview" className="hover:text-gray-900 dark:hover:text-white transition-colors">Overview</Link>
          <Link href="#highlights" className="hover:text-gray-900 dark:hover:text-white transition-colors">Highlights</Link>
          <Link href="#buy" className="px-3 py-1.5 rounded-full bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity">Buy</Link>
        </div>
      </div>
    </nav>
  )
}
