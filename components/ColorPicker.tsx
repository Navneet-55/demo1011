"use client"

import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'

const COLORS = [
  { id: 'graphite', label: 'Graphite', from: 'from-gray-800', to: 'to-gray-600' },
  { id: 'desert', label: 'Desert', from: 'from-amber-700', to: 'to-orange-500' },
  { id: 'titanium', label: 'Titanium', from: 'from-slate-700', to: 'to-slate-500' },
]

export function ColorPicker() {
  const [active, setActive] = useState(COLORS[0])

  const gradientClass = useMemo(
    () => `bg-gradient-to-br ${active.from} ${active.to}`,
    [active]
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {COLORS.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c)}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
              active.id === c.id
                ? 'border-black bg-black text-white dark:bg-white dark:text-black dark:border-white'
                : 'border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ ease: 'easeOut', duration: 0.5 }}
        className={`h-64 rounded-2xl ${gradientClass}`}
      />
      <p className="text-sm text-gray-500 dark:text-gray-400">Selected color: {active.label}</p>
    </div>
  )
}
