"use client"

import React from 'react'

export function Footer() {
  return (
    <footer className="mt-24 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 text-sm">
          {['Shop','Explore','Support','Company','Legal'].map((col) => (
            <div key={col}>
              <h4 className="font-semibold mb-3">{col}</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>Link one</li>
                <li>Link two</li>
                <li>Link three</li>
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 text-xs text-gray-500 dark:text-gray-400">© {new Date().getFullYear()} GyaanForge. All rights reserved.</div>
      </div>
    </footer>
  )
}
