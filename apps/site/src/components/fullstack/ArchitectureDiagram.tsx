'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { Architecture, NodeKind } from '../../lib/content'
import { useStack } from './StackContext'

const kindStyle: Record<NodeKind, string> = {
  client: 'border-accent text-accent',
  service: 'border-fg',
  data: 'border-[var(--ok)] text-[var(--ok)]',
  queue: 'border-accent-2 text-accent-2',
  external: 'border-dashed border-muted text-muted',
}

const kindLabel: Record<NodeKind, string> = {
  client: 'client',
  service: 'service',
  data: 'data',
  queue: 'queue',
  external: 'external',
}

const HOP_MS = 900

// A system diagram you can send a request through. The diagram is plain HTML and SVG, so
// it reads without script; the tracer adds the moving packet and the code for each hop.
export function ArchitectureDiagram({
  architecture,
  title,
}: {
  architecture: Architecture
  title: string
}) {
  const { tech } = useStack()
  const [hop, setHop] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { nodes, edges, trace } = architecture

  const positions = useMemo(() => {
    const cols = Math.max(...nodes.map((n) => n.column)) + 1
    const rows = Math.max(...nodes.map((n) => n.row)) + 1
    return new Map(
      nodes.map((n) => [
        n.key,
        { x: ((n.column + 0.5) / cols) * 100, y: ((n.row + 0.5) / rows) * 100 },
      ]),
    )
  }, [nodes])
  const at = (key: string) => positions.get(key) ?? { x: 0, y: 0 }
  const [packet, setPacket] = useState<{ x: number; y: number; moving: boolean } | null>(null)

  useEffect(() => {
    if (!playing) return
    if (hop >= trace.length - 1) {
      setPlaying(false)
      return
    }
    timer.current = setTimeout(() => setHop((h) => h + 1), hop < 0 ? 50 : HOP_MS)
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [playing, hop, trace.length])

  const current = hop >= 0 ? trace[hop] : undefined
  const busy = new Set(current ? [current.from, current.to] : [])

  // Each hop starts the packet on the sending node, then lets it glide to the receiver.
  useEffect(() => {
    const step = hop >= 0 ? trace[hop] : undefined
    const a = step && positions.get(step.from)
    const b = step && positions.get(step.to)
    if (!a || !b) {
      setPacket(null)
      return
    }
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPacket({ ...b, moving: false })
      return
    }
    setPacket({ ...a, moving: false })
    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setPacket({ ...b, moving: true }))
    })
    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [hop, trace, positions])

  return (
    <figure className="overflow-hidden rounded-xl border border-line bg-surface">
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-2.5">
        <span className="font-mono text-xs">
          <span className="text-muted">architecture/</span>
          {title}
        </span>
        {trace.length > 0 && (
          <span className="flex gap-1.5">
            <button
              type="button"
              onClick={() => {
                setHop(-1)
                setPlaying(true)
              }}
              className="rounded-md bg-accent px-3 py-1 font-mono text-xs text-accent-fg hover:brightness-110"
            >
              ▶ Send request
            </button>
            <button
              type="button"
              aria-label="Step through the request"
              onClick={() => {
                setPlaying(false)
                setHop((h) => (h + 1) % trace.length)
              }}
              className="rounded-md border border-line px-2.5 py-1 font-mono text-xs hover:border-accent"
            >
              Step ⏭
            </button>
          </span>
        )}
      </figcaption>

      <div className="dots overflow-x-auto">
        <div className="relative mx-auto aspect-[16/8] min-w-[560px]">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 size-full"
            aria-hidden
          >
            {edges.map((e) => {
              const a = at(e.from)
              const b = at(e.to)
              const live =
                current &&
                ((current.from === e.from && current.to === e.to) ||
                  (current.from === e.to && current.to === e.from))
              return (
                <line
                  key={`${e.from}-${e.to}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  vectorEffect="non-scaling-stroke"
                  stroke={live ? 'var(--accent-2)' : 'var(--line)'}
                  strokeWidth={live ? 2.5 : 1.5}
                  strokeDasharray={live ? '6 4' : undefined}
                />
              )
            })}
          </svg>
          {edges.map(
            (e) =>
              e.label && (
                <span
                  key={`label-${e.from}-${e.to}`}
                  aria-hidden
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded bg-surface px-1 font-mono text-[10px] text-muted"
                  style={{
                    left: `${String((at(e.from).x + at(e.to).x) / 2)}%`,
                    top: `${String((at(e.from).y + at(e.to).y) / 2)}%`,
                  }}
                >
                  {e.label}
                </span>
              ),
          )}
          <ul aria-label={`${title}: components`}>
            {nodes.map((n) => {
              const p = at(n.key)
              const dim = tech !== null && n.tech !== tech
              const lit = tech !== null && n.tech === tech
              return (
                <li
                  key={n.key}
                  className={`absolute w-[9.5rem] -translate-x-1/2 -translate-y-1/2 rounded-lg border-2 bg-surface px-3 py-2 transition duration-300 ${kindStyle[n.kind]} ${dim ? 'opacity-30' : ''} ${lit || busy.has(n.key) ? 'shadow-[0_0_0_4px_color-mix(in_oklab,var(--accent-2)_35%,transparent)]' : ''}`}
                  style={{ left: `${String(p.x)}%`, top: `${String(p.y)}%` }}
                >
                  <span className="block font-mono text-[10px] uppercase opacity-80">
                    {kindLabel[n.kind]}
                  </span>
                  <span className="block text-sm font-semibold text-fg">{n.label}</span>
                  {n.tech && (
                    <span className="block font-mono text-[11px] text-muted">{n.tech}</span>
                  )}
                </li>
              )
            })}
          </ul>
          {packet && (
            <span
              aria-hidden
              className="pointer-events-none absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-2 shadow-[0_0_0_6px_color-mix(in_oklab,var(--accent-2)_30%,transparent)]"
              style={{
                left: `${String(packet.x)}%`,
                top: `${String(packet.y)}%`,
                transition: packet.moving
                  ? `left ${String(HOP_MS - 200)}ms ease-in-out, top ${String(HOP_MS - 200)}ms ease-in-out`
                  : 'none',
              }}
            />
          )}
        </div>
      </div>

      {trace.length > 0 && (
        <div className="grid border-t border-line md:grid-cols-[1fr_1.2fr]">
          <ol className="border-line p-3 font-mono text-xs md:border-r" aria-label="Request trace">
            {trace.map((t, i) => (
              <li key={`${t.from}-${t.to}-${String(i)}`}>
                <button
                  type="button"
                  onClick={() => {
                    setPlaying(false)
                    setHop(i)
                  }}
                  aria-current={i === hop ? 'step' : undefined}
                  className={`flex w-full gap-3 rounded-md px-2 py-1.5 text-left ${i === hop ? 'bg-accent-2/15 text-fg' : i < hop ? 'text-fg' : 'text-muted'} hover:bg-line/60`}
                >
                  <span className="tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  <span className="shrink-0">
                    {t.from} → {t.to}
                  </span>
                  <span className="truncate">{t.label}</span>
                </button>
              </li>
            ))}
          </ol>
          <div className="min-h-32 p-4" aria-live="polite">
            {current ? (
              <>
                <p className="font-mono text-[11px] text-muted">
                  hop {hop + 1}/{trace.length} · {current.from} → {current.to}
                </p>
                <p className="mt-1 text-sm font-semibold">{current.label}</p>
                {current.code && (
                  <pre className="mt-3 overflow-x-auto rounded-md bg-bg p-3 font-mono text-xs leading-relaxed">
                    <code>{current.code}</code>
                  </pre>
                )}
              </>
            ) : (
              <p className="font-mono text-xs text-muted">
                Press “Send request” to trace one request through the system.
              </p>
            )}
          </div>
        </div>
      )}
    </figure>
  )
}
