"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { VideoModal } from './VideoModal'

const items = [
  { icon: '⚡', title: 'Blazing Performance', desc: 'Next-gen chip with efficiency and speed.' },
  { icon: '🎥', title: 'Pro Cameras', desc: 'Capture stunning detail in any light.' },
  { icon: '🛡️', title: 'Premium Design', desc: 'Strong materials and refined finish.' },
  { icon: '🔋', title: 'Battery Life', desc: 'All-day power with smart management.' },
  { icon: '🌈', title: 'True Colors', desc: 'Wide color support for creatives.' },
  { icon: '🔊', title: 'Spatial Audio', desc: 'Immersive listening experience.' },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}
const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function Highlights() {
  const [open, setOpen] = useState(false)
  return (
    <section id="highlights" className="py-16 sm:py-24 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight">Get the highlights.</h2>
          <button
            onClick={() => setOpen(true)}
            className="hidden sm:flex px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Watch the film
          </button>
        </div>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-10% 0% -10% 0%' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10"
        >
          {items.map((it) => (
            <motion.div
              key={it.title}
              variants={itemVariant}
              className="rounded-2xl border border-gray-200 dark:border-gray-800 p-6 bg-white/70 dark:bg-gray-900/70 hover:shadow-lg transition-shadow"
            >
              <div className="text-3xl">{it.icon}</div>
              <h3 className="mt-3 text-lg font-semibold">{it.title}</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{it.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <VideoModal isOpen={open} onClose={() => setOpen(false)} />
    </section>
  )
}
