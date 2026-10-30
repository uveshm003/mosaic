'use client'

import { useState } from 'react'
import { wordWidthEm } from './erode-metrics'

export interface Slice {
  key: string
  label: string
  description: string
  href: string | null
}

/** Splits a word into `count` contiguous pieces, as even as the letters allow. */
export function splitWord(word: string, count: number): string[] {
  const letters = Array.from(word)
  const pieces: string[] = []
  let start = 0
  for (let i = 0; i < count; i++) {
    const end = Math.round(((i + 1) * letters.length) / count)
    pieces.push(letters.slice(start, end).join(''))
    start = end
  }
  return pieces
}

// The surname as a monument, cut into one slice per portfolio. Hovering or focusing a slice
// colours it and names the portfolio it opens in the caption.
export function NameMosaic({
  surname,
  fullName,
  role,
  slices,
  idleCaption,
  headingClassName,
  captionClassName,
}: {
  surname: string
  fullName: string
  role: string
  slices: Slice[]
  idleCaption: string
  headingClassName?: string
  captionClassName?: string
}) {
  const [active, setActive] = useState<Slice | null>(null)
  const pieces = splitWord(surname, slices.length)
  // Sized from measured advance widths so the word spans the container exactly (container units).
  const widthEm = Math.max(wordWidthEm(surname), 1)

  return (
    <>
      <div className={`w-full [container-type:inline-size] ${headingClassName ?? ''}`}>
        <h1
          aria-label={`${fullName}, ${role}`}
          className="monument block font-medium leading-[0.92] tracking-[-0.04em] whitespace-nowrap"
          style={{ fontSize: `calc(100cqi / ${widthEm.toFixed(4)})` }}
        >
          {pieces.map((piece, i) => {
            const slice = slices[i]
            if (!slice || !piece) return null
            const on = active?.key === slice.key
            const events = {
              onMouseEnter: () => setActive(slice),
              onMouseLeave: () => setActive(null),
              onFocus: () => setActive(slice),
              onBlur: () => setActive(null),
            }
            // With one slice active the others step back, so the seams of the mosaic show.
            const className = `transition-colors duration-200 ${on ? 'text-accent' : active ? 'text-muted' : ''} ${slice.href ? 'cursor-pointer' : ''}`
            return slice.href ? (
              <a
                key={slice.key}
                href={slice.href}
                aria-label={`${slice.label} portfolio`}
                className={`${className} focus-visible:underline focus-visible:decoration-[0.04em] focus-visible:underline-offset-[0.08em] focus-visible:outline-none`}
                {...events}
              >
                {piece}
              </a>
            ) : (
              <span key={slice.key} className={className} {...events}>
                {piece}
              </span>
            )
          })}
        </h1>
      </div>
      <p aria-live="polite" className={captionClassName}>
        {active ? (
          <>
            <span className="text-accent">{active.label}</span> · {active.description}
            {!active.href && ' (coming later)'}
          </>
        ) : (
          idleCaption
        )}
      </p>
    </>
  )
}
