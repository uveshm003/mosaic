'use client'

import { useEffect, useRef } from 'react'

// A soft light that follows the pointer. Off for touch and for reduced motion.
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)').matches) return
    const move = (event: PointerEvent) => {
      el.style.background = `radial-gradient(600px circle at ${String(event.clientX)}px ${String(event.clientY)}px, color-mix(in oklab, var(--accent) 7%, transparent), transparent 70%)`
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
    }
  }, [])
  return <div ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-0" />
}
