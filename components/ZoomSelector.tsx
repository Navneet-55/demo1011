"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'

const ZOOMS = [
  { id: '1x', label: '1×', desc: 'Standard wide angle' },
  { id: '3x', label: '3×', desc: 'Telephoto detail' },
  { id: '0.5x', label: '0.5×', desc: 'Ultra wide' },
]

export function ZoomSelector() {
  const [active, setActive] = useState(ZOOMS[0])
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {ZOOMS.map((z) => (
          <button
            key={z.id}
            onClick={() => setActive(z)}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
              active.id === z.id
                ? 'border-black bg-black text-white dark:bg-white dark:text-black dark:border-white'
                : 'border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {z.label}
          </button>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ ease: 'easeOut', duration: 0.5 }}
        className="h-64 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center"
      >
        <div className="text-center">
          <div className="text-5xl mb-3">📷</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{active.desc}</p>
        </div>
      </motion.div>
    </div>
  )
}
