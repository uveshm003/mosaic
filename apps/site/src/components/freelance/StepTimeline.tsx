'use client'

import { useState, type KeyboardEvent } from 'react'
import type { EngagementStep } from '../../lib/content'

// How an engagement works as a stepper: pick a step (or use the arrow keys) and the
// progress bar and panel follow.
export function StepTimeline({ steps }: { steps: EngagementStep[] }) {
  const [active, setActive] = useState(0)
  const step = steps[active]
  if (!step) return null

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') setActive((i) => Math.min(i + 1, steps.length - 1))
    if (e.key === 'ArrowLeft') setActive((i) => Math.max(i - 1, 0))
  }

  return (
    <div>
      <div className="relative">
        <div
          aria-hidden
          className="absolute top-5 right-[10%] left-[10%] h-1 rounded-full bg-line max-md:hidden"
        >
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out"
            style={{ width: `${String((active / Math.max(steps.length - 1, 1)) * 100)}%` }}
          />
        </div>
        <div
          role="tablist"
          aria-label="How an engagement works"
          onKeyDown={onKey}
          className="relative grid gap-2 md:grid-cols-5"
        >
          {steps.map((s, i) => (
            <button
              key={s.title}
              role="tab"
              id={`step-${String(i)}`}
              aria-selected={i === active}
              aria-controls="step-panel"
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              className="group flex items-center gap-3 rounded-2xl p-2 text-left md:flex-col md:text-center"
            >
              <span
                className={`grid size-11 shrink-0 place-items-center rounded-full border-2 font-mono text-sm font-semibold transition ${i <= active ? 'border-accent bg-accent text-accent-fg' : 'border-line bg-bg text-muted group-hover:border-accent'}`}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span>
                <span className="block font-semibold">{s.title}</span>
                <span className="block font-mono text-xs text-muted">{s.when}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
      <div
        id="step-panel"
        role="tabpanel"
        aria-labelledby={`step-${String(active)}`}
        className="mt-8 grid gap-6 rounded-3xl border border-line bg-surface p-6 sm:p-10 md:grid-cols-[1.4fr_1fr]"
      >
        <div key={active} className="animate-[fadeUp_.4s_ease-out] motion-reduce:animate-none">
          <p className="font-mono text-xs text-accent uppercase">
            Step {active + 1} of {steps.length} · {step.when}
          </p>
          <h3 className="mt-2 text-3xl font-semibold tracking-tight">{step.title}</h3>
          <p className="mt-3 text-lg text-muted">{step.summary}</p>
        </div>
        <div>
          <p className="text-sm font-semibold">You get</p>
          <ul className="mt-3 space-y-2">
            {step.youGet.map((g) => (
              <li key={g} className="flex gap-3">
                <span aria-hidden className="mt-2 size-2 shrink-0 rounded-full bg-accent-2" />
                {g}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex gap-2">
            <button
              type="button"
              onClick={() => setActive((i) => Math.max(i - 1, 0))}
              disabled={active === 0}
              className="rounded-full border border-line px-4 py-2 text-sm disabled:opacity-40"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => setActive((i) => Math.min(i + 1, steps.length - 1))}
              disabled={active === steps.length - 1}
              className="rounded-full bg-fg px-4 py-2 text-sm text-bg disabled:opacity-40"
            >
              Next step →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
