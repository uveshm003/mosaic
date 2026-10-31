'use client'

import Link from 'next/link'
import { useStack } from './StackContext'

export interface ProjectRow {
  slug: string
  title: string
  summary: string | null
  kind: string
  tech: string[]
  status: string
  live: boolean
  diagram: boolean
}

// The projects table; rows that don't use the technology picked in the explorer fade.
export function ProjectRows({ rows }: { rows: ProjectRow[] }) {
  const { tech } = useStack()
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="font-mono text-[11px] text-muted uppercase">
          <tr className="border-b border-line">
            <th className="py-2 pr-4 font-normal">Project</th>
            <th className="py-2 pr-4 font-normal">Kind</th>
            <th className="py-2 pr-4 font-normal">Stack</th>
            <th className="py-2 font-normal">Demo status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const dim = tech !== null && !r.tech.includes(tech)
            return (
              <tr
                key={r.slug}
                className={`border-b border-line transition-opacity ${dim ? 'opacity-30' : ''}`}
              >
                <td className="py-3 pr-4">
                  <Link href={`/fullstack/${r.slug}`} className="font-semibold hover:text-accent">
                    {r.title}
                  </Link>
                  {r.diagram && (
                    <span className="ml-2 font-mono text-[10px] text-accent">◇ diagram</span>
                  )}
                  {r.summary && <p className="mt-0.5 max-w-md text-xs text-muted">{r.summary}</p>}
                </td>
                <td className="py-3 pr-4 font-mono text-xs text-muted">{r.kind}</td>
                <td className="py-3 pr-4">
                  <span className="flex flex-wrap gap-1">
                    {r.tech.map((t) => (
                      <span
                        key={t}
                        className={`rounded px-1.5 py-0.5 font-mono text-[11px] ${t === tech ? 'bg-accent text-accent-fg' : 'bg-bg'}`}
                      >
                        {t}
                      </span>
                    ))}
                  </span>
                </td>
                <td className="py-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2 py-0.5 font-mono text-[11px] whitespace-nowrap">
                    <span
                      className={`size-1.5 rounded-full ${r.live ? 'bg-[var(--ok)]' : 'bg-muted'}`}
                    />
                    {r.status}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
