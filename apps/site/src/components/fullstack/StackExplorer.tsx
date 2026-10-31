'use client'

import { useStack } from './StackContext'

const kindLabel: Record<string, string> = {
  language: 'Languages',
  framework: 'Frameworks',
  platform: 'Platforms',
  tool: 'Tools & data',
}

// Pick a technology and everything that uses it lights up; pick it again to clear.
export function StackExplorer({
  groups,
}: {
  groups: { kind: string; tech: { name: string; count: number }[] }[]
}) {
  const { tech, setTech } = useStack()
  return (
    <div className="space-y-4">
      {groups.map((g) => (
        <div key={g.kind}>
          <p className="mb-2 font-mono text-[11px] text-muted uppercase">
            {kindLabel[g.kind] ?? g.kind}
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {g.tech.map((t) => {
              const on = tech === t.name
              return (
                <li key={t.name}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => setTech(on ? null : t.name)}
                    className={`flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-xs transition ${on ? 'border-accent bg-accent text-accent-fg' : 'border-line bg-surface hover:border-accent'}`}
                  >
                    {t.name}
                    <span className={on ? 'opacity-80' : 'text-muted'}>{t.count}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
      <p aria-live="polite" className="font-mono text-[11px] text-muted">
        {tech ? `Showing where ${tech} is used.` : 'Pick a technology to see where it’s used.'}
      </p>
    </div>
  )
}
