'use client'

import { useId, useState } from 'react'
import type { ProductCanvas } from '../../lib/content'

type Comparison = NonNullable<ProductCanvas['comparison']>

function Frame({
  title,
  points,
  image,
  tone,
}: {
  title: string | null
  points: string[]
  image: string | null
  tone: 'before' | 'after'
}) {
  const after = tone === 'after'
  return (
    <div
      className={`absolute inset-0 flex p-6 sm:p-10 ${after ? 'justify-end bg-accent-2 text-[var(--sticky-fg)]' : 'bg-surface'}`}
    >
      {/* Each side keeps to its own half, so both read at the default split. */}
      <div
        className={`flex flex-col ${image ? 'w-full' : 'w-[44%]'} ${after && !image ? 'items-end text-right' : ''}`}
      >
        <p className="font-mono text-[11px] uppercase">{tone}</p>
        {title && <p className="mt-1 font-display text-2xl leading-tight sm:text-4xl">{title}</p>}
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element -- static export, no optimizer
          <img
            src={image}
            alt={title ?? tone}
            className="mt-5 min-h-0 flex-1 rounded-lg object-contain"
          />
        ) : (
          <ul className="mt-6 space-y-3">
            {points.map((p) => (
              <li
                key={p}
                className={`flex gap-3 text-base sm:text-lg ${after ? 'flex-row-reverse' : ''}`}
              >
                <span aria-hidden>{after ? '✓' : '✕'}</span>
                {p}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

// Drag to compare the product as it is with the proposed version.
export function BeforeAfter({ comparison }: { comparison: Comparison }) {
  const [split, setSplit] = useState(50)
  const id = useId()
  return (
    <figure>
      <div className="relative h-[24rem] overflow-hidden rounded-2xl border border-line sm:h-[22rem]">
        <Frame
          title={comparison.beforeTitle}
          points={comparison.before}
          image={comparison.beforeImage}
          tone="before"
        />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${String(split)}%)` }}>
          <Frame
            title={comparison.afterTitle}
            points={comparison.after}
            image={comparison.afterImage}
            tone="after"
          />
        </div>
        <span
          aria-hidden
          className="absolute inset-y-0 w-0.5 bg-fg"
          style={{ left: `${String(split)}%` }}
        >
          <span className="absolute top-1/2 left-1/2 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-fg font-mono text-xs text-bg">
            ⇆
          </span>
        </span>
      </div>
      <label htmlFor={id} className="sr-only">
        Compare before and after
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        value={split}
        onChange={(e) => setSplit(Number(e.target.value))}
        aria-valuetext={`${String(100 - split)}% after shown`}
        className="mt-3 w-full accent-[var(--accent)]"
      />
      <figcaption className="flex justify-between font-mono text-[11px] text-muted">
        <span>← before</span>
        <span>after →</span>
      </figcaption>
    </figure>
  )
}
