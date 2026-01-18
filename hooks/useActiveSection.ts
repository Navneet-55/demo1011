"use client"

import { useEffect, useState } from 'react'

export type UseActiveSectionOptions = {
  rootMargin?: string
  threshold?: number | number[]
  strategy?: 'ratio' | 'center'
}

export function useActiveSection(ids: string[], options?: UseActiveSectionOptions) {
  const [activeId, setActiveId] = useState<string>(ids[0] ?? '')

  useEffect(() => {
    const elements = ids
      .map((id) => (typeof document !== 'undefined' ? document.getElementById(id) : null))
      .filter(Boolean) as Element[]
    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (!visible.length) return

        let nextId = activeId
        if ((options?.strategy ?? 'center') === 'center') {
          const center = window.innerHeight / 2
          const best = visible
            .map((e) => ({ e, dist: Math.abs(e.boundingClientRect.top - center) }))
            .sort((a, b) => a.dist - b.dist)[0]
          nextId = best.e.target.id
        } else {
          const best = visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
          nextId = best.target.id
        }
        if (nextId !== activeId) setActiveId(nextId)
      },
      {
        rootMargin: options?.rootMargin ?? '-50% 0px -50% 0px',
        threshold: options?.threshold ?? [0, 0.25, 0.5, 0.75, 1],
      }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(','), options?.rootMargin, JSON.stringify(options?.threshold), options?.strategy])

  return activeId
}
