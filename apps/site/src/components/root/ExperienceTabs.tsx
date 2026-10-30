'use client'

import { useRef, useState, type KeyboardEvent } from 'react'

export interface ExperienceItem {
  id: string
  employer: string
  employerDetail: string | null
  title: string
  period: string
  location: string | null
  highlights: string[]
}

// WAI-ARIA tabs: arrow keys move between employers, the panel follows.
export function ExperienceTabs({ items }: { items: ExperienceItem[] }) {
  const [active, setActive] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const item = items[active]

  const onKeyDown = (event: KeyboardEvent) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key]
    if (!step) return
    event.preventDefault()
    const next = (active + step + items.length) % items.length
    setActive(next)
    tabs.current[next]?.focus()
  }

  if (!item) return null
  return (
    <div className="flex flex-col gap-6 sm:flex-row">
      <div
        role="tablist"
        aria-orientation="vertical"
        aria-label="Employers"
        className="flex overflow-x-auto sm:flex-col"
      >
        {items.map((entry, i) => (
          <button
            key={entry.id}
            ref={(el) => {
              tabs.current[i] = el
            }}
            role="tab"
            id={`tab-${entry.id}`}
            aria-selected={i === active}
            aria-controls={`panel-${entry.id}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={onKeyDown}
            className={`shrink-0 border-b-2 px-4 py-3 text-left font-mono text-xs whitespace-nowrap transition sm:border-b-0 sm:border-l-2 ${
              i === active
                ? 'border-accent bg-surface text-accent'
                : 'border-line text-muted hover:bg-surface hover:text-fg'
            } focus-visible:outline-2 focus-visible:outline-accent`}
          >
            {entry.employer}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`panel-${item.id}`}
        aria-labelledby={`tab-${item.id}`}
        className="min-h-56 flex-1"
      >
        <h3 className="font-display text-xl font-semibold">
          {item.title} <span className="text-accent">@ {item.employer}</span>
        </h3>
        {item.employerDetail && <p className="text-sm text-muted">{item.employerDetail}</p>}
        <p className="mt-1 font-mono text-xs text-muted">
          {item.period}
          {item.location ? ` · ${item.location}` : ''}
        </p>
        <ul className="mt-4 space-y-2.5">
          {item.highlights.map((text) => (
            <li key={text} className="flex gap-3 text-fg/85">
              <span className="mt-1 text-accent" aria-hidden>
                ▹
              </span>
              {text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
