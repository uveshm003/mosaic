'use client'

import { useEffect, useRef } from 'react'

// Soft light that follows the pointer. Off for touch and for reduced motion.
export function Spotlight({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = ref.current
    if (!element || matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)').matches)
      return
    const move = (event: PointerEvent) => {
      element.style.setProperty('--x', `${String(event.clientX)}px`)
      element.style.setProperty('--y', `${String(event.clientY)}px`)
      element.style.opacity = '1'
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
    }
  }, [])
  return (
    <div
      ref={ref}
      aria-hidden
      className={className}
      style={{
        opacity: 0,
        background:
          'radial-gradient(600px circle at var(--x, 50%) var(--y, 30%), color-mix(in oklab, var(--accent) 18%, transparent), transparent 60%)',
      }}
    />
  )
}
