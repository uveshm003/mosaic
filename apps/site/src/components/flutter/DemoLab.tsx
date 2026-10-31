'use client'

import Image from 'next/image'
import { useState } from 'react'
import { demoPoster, demoSrc, type FlutterDemo } from '../../lib/demos'

// Real Flutter web builds. Nothing loads until the visitor presses Run: the poster is a
// screenshot, and the iframe (engine and app, a few MB) only mounts on click.
export function DemoLab({ demos }: { demos: FlutterDemo[] }) {
  const [selected, setSelected] = useState(demos[0]?.slug)
  const [running, setRunning] = useState<string | null>(null)
  const demo = demos.find((d) => d.slug === selected)
  if (!demo) return null

  return (
    <div className="grid gap-5">
      <ul className="grid gap-3 sm:grid-cols-2" aria-label="Demos">
        {demos.map((d) => {
          const active = d.slug === demo.slug
          return (
            <li key={d.slug}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => setSelected(d.slug)}
                className={`card h-full w-full px-5 py-4 text-left transition focus-visible:outline-2 focus-visible:outline-accent ${active ? 'border-accent/60' : 'hover:border-accent/40'}`}
              >
                <span className="block font-display text-lg font-semibold">{d.title}</span>
                <span className="mt-1 block text-sm text-muted">{d.blurb}</span>
              </button>
            </li>
          )
        })}
      </ul>

      <figure className="min-w-0">
        <div className="card relative h-[min(36rem,80svh)] overflow-hidden">
          {running === demo.slug ? (
            <iframe
              src={demoSrc(demo.slug)}
              title={`${demo.title}, a Flutter web demo`}
              className="absolute inset-0 size-full border-0"
            />
          ) : (
            <>
              <Image
                src={demoPoster(demo.slug)}
                alt=""
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover object-top opacity-60"
              />
              <div className="absolute inset-0 grid place-items-center bg-gradient-to-t from-bg via-bg/40 to-transparent">
                <button
                  type="button"
                  onClick={() => setRunning(demo.slug)}
                  className="rounded-full bg-accent px-6 py-3 font-medium text-accent-fg shadow-lg transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  ▶ Run {demo.title}
                </button>
              </div>
            </>
          )}
        </div>
        <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-muted">
          <span className="flex flex-wrap gap-2">
            {demo.shows.map((s) => (
              <span key={s} className="rounded-full border border-line px-2 py-0.5">
                {s}
              </span>
            ))}
          </span>
          <a
            href={demoSrc(demo.slug)}
            target="_blank"
            rel="noreferrer"
            className="hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
          >
            Open full screen ↗
          </a>
        </figcaption>
      </figure>
    </div>
  )
}
