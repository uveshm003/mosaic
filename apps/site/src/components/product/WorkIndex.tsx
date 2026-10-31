'use client'

import Link from 'next/link'
import { useState } from 'react'

export interface WorkCard {
  kind: 'case-study' | 'teardown' | 'proposal'
  kindLabel: string
  href: string
  title: string
  summary: string | null
  date: string
  label: string | null
  canvas: string[]
}

const filters = [
  [null, 'Everything'],
  ['case-study', 'Case studies'],
  ['teardown', 'Teardowns'],
  ['proposal', 'Proposals'],
] as const

const stamp: Record<WorkCard['kind'], string> = {
  'case-study': 'border-fg',
  teardown: 'border-accent text-accent',
  proposal: 'border-accent-2 bg-accent-2 text-[var(--sticky-fg)]',
}

// Case studies, teardowns and proposals side by side; filter to one kind.
export function WorkIndex({ cards }: { cards: WorkCard[] }) {
  const [kind, setKind] = useState<WorkCard['kind'] | null>(null)
  const shown = kind ? cards.filter((c) => c.kind === kind) : cards
  return (
    <>
      <div role="group" aria-label="Filter by kind" className="mb-6 flex flex-wrap gap-2">
        {filters.map(([key, label]) => (
          <button
            key={label}
            type="button"
            aria-pressed={kind === key}
            onClick={() => setKind(key)}
            className={`rounded-full border px-3.5 py-1.5 text-sm transition ${kind === key ? 'border-fg bg-fg text-bg' : 'border-line hover:border-fg'}`}
          >
            {label}
            <span className="ml-1.5 font-mono text-xs opacity-60">
              {key ? cards.filter((c) => c.kind === key).length : cards.length}
            </span>
          </button>
        ))}
      </div>
      <ul className="grid gap-4 md:grid-cols-2">
        {shown.map((c) => (
          <li key={c.href}>
            <Link
              href={c.href}
              className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-6 transition hover:-translate-y-0.5 hover:border-fg"
            >
              <span className="flex items-center justify-between gap-3">
                <span
                  className={`rounded border-2 px-2 py-0.5 font-mono text-[11px] uppercase ${stamp[c.kind]}`}
                >
                  {c.kindLabel}
                </span>
                <span className="font-mono text-xs text-muted">{c.date}</span>
              </span>
              <span className="mt-4 font-display text-[1.75rem] leading-tight group-hover:underline group-hover:decoration-accent group-hover:underline-offset-4">
                {c.title}
              </span>
              {c.summary && <span className="mt-2 text-muted">{c.summary}</span>}
              <span className="mt-auto flex flex-wrap items-center gap-2 pt-5">
                {c.canvas.map((part) => (
                  <span
                    key={part}
                    className="rounded-sm bg-accent-2/60 px-1.5 py-0.5 font-mono text-[10px] text-[var(--sticky-fg)] uppercase"
                  >
                    {part}
                  </span>
                ))}
              </span>
              {c.label && <span className="mt-3 text-xs text-muted italic">{c.label}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
