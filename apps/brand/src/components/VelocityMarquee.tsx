'use client'

import { useEffect, useRef, type ReactNode } from 'react'

// A ticker that drifts on its own and speeds up with the scroll. Static under
// reduced motion.
export function VelocityMarquee({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const track = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = track.current
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let x = 0
    let boost = 0
    let lastY = scrollY
    let frame = 0
    const onScroll = () => {
      boost = Math.min(boost + Math.abs(scrollY - lastY) * 0.4, 40)
      lastY = scrollY
    }
    const tick = () => {
      const half = el.scrollWidth / 2
      x = (x + 0.6 + boost) % half
      boost *= 0.92
      el.style.transform = `translateX(${String(-x)}px)`
      frame = requestAnimationFrame(tick)
    }
    addEventListener('scroll', onScroll, { passive: true })
    frame = requestAnimationFrame(tick)
    return () => {
      removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className={`overflow-hidden ${className ?? ''}`}>
      <div ref={track} className="flex w-max will-change-transform">
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  )
}
