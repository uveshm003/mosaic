'use client'

import { useEffect, useRef, useState } from 'react'
import type { EngagementStep } from '../../lib/content'

// How an engagement works, drawn as you scroll: the line fills, and each step lights up
// as it reaches the middle of the screen. Everything is visible without script.
export function ScrollTimeline({ steps }: { steps: EngagementStep[] }) {
  const list = useRef<HTMLOListElement>(null)
  const [progress, setProgress] = useState(1)
  const [reached, setReached] = useState(steps.length)

  useEffect(() => {
    const el = list.current
    if (!el) return
    const update = () => {
      const r = el.getBoundingClientRect()
      const mid = innerHeight * 0.55
      const p = Math.min(Math.max((mid - r.top) / r.height, 0), 1)
      setProgress(p)
      const items = [...el.querySelectorAll('li')]
      setReached(items.filter((li) => li.getBoundingClientRect().top < mid).length)
    }
    update()
    addEventListener('scroll', update, { passive: true })
    addEventListener('resize', update)
    return () => {
      removeEventListener('scroll', update)
      removeEventListener('resize', update)
    }
  }, [])

  return (
    <ol ref={list} className="relative space-y-14 pl-14 sm:pl-0">
      <span aria-hidden className="absolute top-0 bottom-0 left-5 w-0.5 bg-line sm:left-1/2">
        <span className="block w-full bg-accent" style={{ height: `${String(progress * 100)}%` }} />
      </span>
      {steps.map((s, i) => {
        const on = i < reached
        const right = i % 2 === 1
        return (
          <li key={s.title} className="relative sm:grid sm:grid-cols-2 sm:gap-16">
            <span
              aria-hidden
              className={`absolute top-1 -left-14 grid size-10 place-items-center rounded-full border-2 font-mono text-sm font-bold transition-colors duration-300 sm:left-1/2 sm:-translate-x-1/2 ${on ? 'border-accent bg-accent text-accent-fg' : 'border-line bg-bg text-muted'}`}
            >
              {i + 1}
            </span>
            <div
              className={`${right ? 'sm:col-start-2' : 'sm:text-right'} transition-opacity duration-500 ${on ? 'opacity-100' : 'opacity-50'}`}
            >
              <p className="font-mono text-xs tracking-widest text-muted uppercase">
                {right ? '' : '— '}
                {s.when}
                {right ? ' —' : ''}
              </p>
              <h3 className="mt-1 text-3xl font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-2 text-muted">{s.summary}</p>
              {s.youGet.length > 0 && (
                <>
                  <p className="mt-4 font-mono text-[11px] text-muted uppercase">You get</p>
                  <ul className={`mt-1.5 flex flex-wrap gap-2 ${right ? '' : 'sm:justify-end'}`}>
                    {s.youGet.map((g) => (
                      <li
                        key={g}
                        className="rounded-lg border border-line bg-surface px-3 py-1 text-sm"
                      >
                        {g}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {s.yourPart && (
                <p className="mt-3 text-sm">
                  <span className="font-mono text-[11px] text-accent-2 uppercase">
                    Your part ·{' '}
                  </span>
                  {s.yourPart}
                </p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
