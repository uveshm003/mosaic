'use client'

import { useState } from 'react'
import type { ProductCanvas } from '../../lib/content'

// The calls made along the way: open one to see what was on the table, what was chosen,
// and why.
export function DecisionLog({
  decisions,
  source,
}: {
  decisions: (ProductCanvas['decisions'][number] & { from?: { title: string; href: string } })[]
  source?: boolean
}) {
  const [open, setOpen] = useState(0)
  return (
    <ol className="divide-y divide-line rounded-2xl border border-line bg-surface">
      {decisions.map((d, n) => {
        const on = n === open
        return (
          <li key={`${d.question}-${String(n)}`}>
            <button
              type="button"
              aria-expanded={on}
              onClick={() => setOpen(on ? -1 : n)}
              className="flex w-full items-start gap-4 p-5 text-left"
            >
              <span className="font-mono text-xs text-muted">
                D{String(n + 1).padStart(2, '0')}
              </span>
              <span className="flex-1 font-display text-2xl leading-tight">{d.question}</span>
              <span aria-hidden className={`text-accent transition ${on ? 'rotate-45' : ''}`}>
                +
              </span>
            </button>
            {on && (
              <div className="grid gap-5 px-5 pb-6 motion-safe:animate-[fadeUp_.3s_ease-out] sm:pl-14 md:grid-cols-[1fr_1.2fr]">
                <ul className="space-y-2">
                  {d.options.map((o) => {
                    const chosen = o === d.chosen
                    return (
                      <li
                        key={o}
                        className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-sm ${chosen ? 'border-accent bg-accent/10 font-semibold' : 'border-line text-muted line-through decoration-muted/50'}`}
                      >
                        <span aria-hidden>{chosen ? '✓' : '·'}</span>
                        {o}
                        {chosen && <span className="sr-only">(chosen)</span>}
                      </li>
                    )
                  })}
                </ul>
                <div>
                  {d.why && (
                    <p className="text-lg leading-relaxed">
                      <span className="marker font-semibold">Why:</span> {d.why}
                    </p>
                  )}
                  {source && d.from && (
                    <a
                      href={d.from.href}
                      className="mt-3 inline-block font-mono text-xs text-accent hover:underline"
                    >
                      from {d.from.title} →
                    </a>
                  )}
                </div>
              </div>
            )}
          </li>
        )
      })}
    </ol>
  )
}
