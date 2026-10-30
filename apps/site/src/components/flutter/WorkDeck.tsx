'use client'

import { useRef, type ReactNode } from 'react'

// Horizontal deck you can drag with a mouse, swipe on touch, or scroll with the keyboard.
export function WorkDeck({ children, label }: { children: ReactNode; label: string }) {
  const track = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null)

  const scrollBy = (direction: 1 | -1) => {
    const el = track.current
    if (el) el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  return (
    <div>
      <div
        ref={track}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="-mx-6 flex cursor-grab snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-accent active:cursor-grabbing lg:mx-0 lg:px-0"
        onPointerDown={(e) => {
          if (e.pointerType !== 'mouse' || !track.current) return
          drag.current = { x: e.clientX, left: track.current.scrollLeft, moved: false }
          track.current.style.scrollSnapType = 'none'
        }}
        onPointerMove={(e) => {
          const d = drag.current
          if (!d || !track.current) return
          const dx = e.clientX - d.x
          if (Math.abs(dx) > 4) d.moved = true
          track.current.scrollLeft = d.left - dx
        }}
        onPointerUp={() => {
          if (track.current) track.current.style.scrollSnapType = ''
          setTimeout(() => (drag.current = null))
        }}
        onPointerLeave={() => {
          if (track.current) track.current.style.scrollSnapType = ''
          drag.current = null
        }}
        onClickCapture={(e) => {
          // A drag shouldn't also open the card it ended on.
          if (drag.current?.moved) e.preventDefault()
        }}
      >
        {children}
      </div>
      <div className="mt-3 flex items-center justify-between font-mono text-xs text-muted">
        <span aria-hidden>← drag →</span>
        <span className="flex gap-2">
          {([-1, 1] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={() => scrollBy(dir)}
              aria-label={dir < 0 ? 'Previous projects' : 'Next projects'}
              className="grid size-9 place-items-center rounded-full border border-line transition hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
            >
              {dir < 0 ? '←' : '→'}
            </button>
          ))}
        </span>
      </div>
    </div>
  )
}
