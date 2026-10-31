'use client'

import { useId, useState } from 'react'
import type { ProductCanvas } from '../../lib/content'

// Scrub through the user's journey: each stage shows what they do, where it hurts and
// the fix, as notes on a canvas.
export function JourneyMap({ journey }: { journey: ProductCanvas['journey'] }) {
  const [i, setI] = useState(0)
  const id = useId()
  const step = journey[i]
  if (!step) return null

  return (
    <div className="canvas overflow-hidden rounded-2xl border border-line">
      <ol
        className="relative grid gap-3 p-5 sm:p-8"
        style={{ gridTemplateColumns: `repeat(${String(journey.length)}, minmax(0, 1fr))` }}
      >
        <span
          aria-hidden
          className="absolute top-[3.1rem] right-[8%] left-[8%] border-t-2 border-dashed border-fg/25 sm:top-[3.6rem]"
        />
        {journey.map((s, n) => (
          <li key={s.stage} className="relative flex flex-col items-center text-center">
            <button
              type="button"
              onClick={() => setI(n)}
              aria-current={n === i ? 'step' : undefined}
              className={`relative z-10 grid size-10 place-items-center rounded-full border-2 font-mono text-sm font-semibold transition sm:size-12 ${n === i ? 'scale-110 border-accent bg-accent text-accent-fg' : n < i ? 'border-fg bg-fg text-bg' : 'border-fg/30 bg-bg text-muted hover:border-accent'}`}
            >
              {n + 1}
            </button>
            <span
              className={`mt-2 text-xs font-semibold sm:text-sm ${n === i ? 'text-fg' : 'text-muted'}`}
            >
              {s.stage}
            </span>
          </li>
        ))}
      </ol>
      <div className="px-5 pb-2 sm:px-8">
        <label htmlFor={id} className="sr-only">
          Journey stage
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={journey.length - 1}
          value={i}
          onChange={(e) => setI(Number(e.target.value))}
          aria-valuetext={`${String(i + 1)} of ${String(journey.length)}: ${step.stage}`}
          className="w-full accent-[var(--accent)]"
        />
      </div>
      <div
        key={i}
        className="grid gap-4 p-5 motion-safe:animate-[fadeUp_.35s_ease-out] sm:grid-cols-3 sm:p-8"
      >
        {[
          ['They', step.userDoes, 'bg-surface text-fg -rotate-1'],
          ['It hurts', step.pain, 'bg-accent text-accent-fg rotate-1'],
          ['The fix', step.fix, 'bg-accent-2 text-[var(--sticky-fg)] -rotate-[0.5deg]'],
        ].map(([label, text, tone]) =>
          text ? (
            <div
              key={label}
              className={`rounded-md p-4 shadow-[0_8px_18px_-10px_rgb(0_0_0/0.35)] ${tone ?? ''}`}
            >
              <p className="font-mono text-[11px] uppercase opacity-75">{label}</p>
              <p className="mt-1 text-lg leading-snug font-medium">{text}</p>
            </div>
          ) : null,
        )}
      </div>
    </div>
  )
}
