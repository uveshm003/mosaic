'use client'

import { useEffect } from 'react'

// Reveals [data-reveal] elements once, as they enter. Hidden states only apply under
// html.js (set before paint), so the page reads fully without JavaScript.
export function Reveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            io.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    )
    els.forEach((el) => io.observe(el))
    return () => {
      io.disconnect()
    }
  }, [])
  return null
}
