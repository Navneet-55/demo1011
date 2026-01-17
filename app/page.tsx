'use client'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight">Welcome.</h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          The root page was repaired. Explore the cinematic product experience.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="/pro"
            className="inline-flex items-center gap-2 rounded-lg bg-black text-white dark:bg-white dark:text-black px-4 py-2 text-sm font-medium hover:opacity-90"
          >
            View Cinematic Product Page
          </a>
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Home
          </a>
        </div>

        <div className="mt-10 text-sm text-gray-500 dark:text-gray-400">
          <p>Tip: Use the sticky sub‑nav on the Pro page to jump across sections.</p>
        </div>
      </div>
    </main>
  )
}
