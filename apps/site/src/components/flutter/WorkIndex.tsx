'use client'

import Link from 'next/link'
import { setFlutter, useFlutter } from './store'

export interface WorkItem {
  id: number
  slug: string
  title: string
  role: string | null
  year: string
}

/** Long names shortened at a word boundary for the index; the full name stays the link's label. */
export function shortName(title: string, max = 28): string {
  const name = title.replace(/^Sample:\s*/, '')
  if (name.length <= max) return name
  const cut = name.slice(0, max)
  return `${cut.slice(0, cut.lastIndexOf(' ') > 0 ? cut.lastIndexOf(' ') : max).trimEnd()}…`
}

// Project names as the index: hovering or focusing one puts that app on the stage.
export function WorkIndex({ items }: { items: WorkItem[] }) {
  const activeId = useFlutter((s) => s.project) ?? items[0]?.id
  return (
    <ol className="space-y-1">
      {items.map((item) => {
        const on = item.id === activeId
        return (
          <li key={item.id}>
            <Link
              href={`/flutter/${item.slug}`}
              aria-label={item.title.replace(/^Sample:\s*/, '')}
              onMouseEnter={() => setFlutter({ project: item.id, scene: 'work' })}
              onFocus={() => setFlutter({ project: item.id, scene: 'work' })}
              className={`press group flex items-baseline justify-between gap-x-6 py-2.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fg ${on ? 'text-fg' : 'text-muted'}`}
            >
              <span className="min-w-0 text-[length:var(--step-head)] leading-[0.95] font-bold tracking-[-0.05em] lowercase transition-colors">
                {shortName(item.title)}
              </span>
              <span className="shrink-0 text-right text-[length:var(--step-small)] max-sm:hidden">
                {[item.role, item.year].filter(Boolean).join(' · ')}
              </span>
            </Link>
          </li>
        )
      })}
    </ol>
  )
}
