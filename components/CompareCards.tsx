"use client"

import React from 'react'
import { motion } from 'framer-motion'

const tiers = [
  { name: 'Base', price: '$999', bullets: ['Great performance', 'Dual camera', 'Aluminum frame'] },
  { name: 'Pro', price: '$1199', bullets: ['Pro chip', 'Triple camera', 'Titanium frame'] },
  { name: 'Ultra', price: '$1499', bullets: ['Ultra chip', 'Periscope camera', 'Ceramic frame'] },
]

export function CompareCards() {
  return (
    <section id="shared" className="py-20 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ease: 'easeOut', duration: 0.5 }}
          className="text-3xl sm:text-5xl font-semibold tracking-tight"
        >
          Feature strip & comparison.
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {tiers.map((t) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ease: 'easeOut', duration: 0.5 }}
              className="rounded-2xl border border-gray-200 dark:border-gray-800 p-6 bg-white/70 dark:bg-gray-900/70 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-baseline justify-between">
                <h3 className="text-xl font-semibold">{t.name}</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">{t.price}</span>
              </div>
              <ul className="mt-4 space-y-2 text-sm">
                {t.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2">
                    <span className="text-green-600 dark:text-green-400">●</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
