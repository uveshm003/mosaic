'use client'

import Link from 'next/link'
import { useState, type PointerEvent } from 'react'

export interface Poster {
  id: number
  href: string
  draft: boolean
  title: string
  type: string
  typeLabel: string
  date: string
  excerpt: string
  label: string | null
  bg: string
  fg: string
  series: string | null
}

const spans = ['md:col-span-2 md:row-span-2', '', '', 'md:row-span-2', '', 'md:col-span-2', '']

function tilt(e: PointerEvent<HTMLElement>) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const r = e.currentTarget.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width - 0.5
  const y = (e.clientY - r.top) / r.height - 0.5
  e.currentTarget.style.transform = `perspective(900px) rotateY(${String(x * 10)}deg) rotateX(${String(-y * 10)}deg) translateY(-4px)`
}

function untilt(e: PointerEvent<HTMLElement>) {
  e.currentTarget.style.transform = ''
}

// Every post as a poster; filter by kind and the wall reflows.
export function PosterWall({
  posters,
  types,
}: {
  posters: Poster[]
  types: { key: string; label: string }[]
}) {
  const [filter, setFilter] = useState<string | null>(null)
  const shown = filter ? posters.filter((p) => p.type === filter) : posters

  return (
    <>
      {types.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter by kind">
          {[{ key: null, label: 'Everything' }, ...types].map((t) => (
            <button
              key={t.key ?? 'all'}
              type="button"
              aria-pressed={filter === t.key}
              onClick={() => setFilter(t.key)}
              className={`rounded-full border-2 border-fg px-4 py-1.5 text-sm font-semibold transition ${filter === t.key ? 'bg-fg text-bg' : 'hover:bg-fg/10'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
      <ul className="grid auto-rows-[16rem] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {shown.map((p, i) => (
          <li key={p.id} className={filter ? '' : (spans[i % spans.length] ?? '')}>
            <Link
              href={p.href}
              onPointerMove={tilt}
              onPointerLeave={untilt}
              className="relative flex h-full flex-col justify-between overflow-hidden rounded-[1.25rem] p-6 transition-transform duration-300 ease-out will-change-transform focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-fg"
              style={{ background: p.bg, color: p.fg }}
            >
              <span className="flex items-start justify-between gap-3 text-xs font-semibold tracking-wide uppercase">
                <span>
                  {p.typeLabel}
                  {p.draft && ' · Draft'}
                </span>
                <span className="opacity-70">{p.date}</span>
              </span>
              <span className="block">
                <span className="block font-serif text-[clamp(1.7rem,2.6vw,2.6rem)] leading-[0.98] italic">
                  {p.title}
                </span>
                {i % spans.length === 0 && !filter && (
                  <span className="mt-4 block max-w-md text-sm opacity-80">{p.excerpt}</span>
                )}
                {p.series && (
                  <span className="mt-3 block text-xs font-semibold uppercase opacity-80">
                    Series · {p.series}
                  </span>
                )}
                {p.label && (
                  <span className="mt-3 inline-block border border-current px-2 py-0.5 text-[11px] font-semibold">
                    {p.label}
                  </span>
                )}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
