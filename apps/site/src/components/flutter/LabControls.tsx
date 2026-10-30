'use client'

import { useState } from 'react'
import { oklchToHex } from '../../lib/color'
import { setFlutter, useFlutter } from './store'

const tabs = ['Counter', 'Theme', 'Shape'] as const

// Controls for the counter app on the stage, with the Flutter code for what is shown.
export function LabControls() {
  const { count, hue, radius, dark } = useFlutter((s) => s)
  const [tab, setTab] = useState<(typeof tabs)[number]>('Counter')
  const hex = `0xff${oklchToHex(0.6, 0.17, hue)}`

  return (
    <div className="space-y-8">
      <div
        role="tablist"
        aria-label="Lab controls"
        className="flex gap-6 text-[length:var(--step-lead)]"
      >
        {tabs.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`press lowercase focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fg ${tab === t ? 'text-fg' : 'text-muted'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div role="tabpanel" aria-label={tab} className="min-h-28">
        {tab === 'Counter' && (
          <p className="text-[length:var(--step-lead)]">
            Pushed <span className="tabular-nums">{count}</span> {count === 1 ? 'time' : 'times'}.
            Tap the button below, or restart to start over.
          </p>
        )}
        {tab === 'Theme' && (
          <div className="space-y-4">
            <label className="block">
              Seed colour
              <input
                type="range"
                min="0"
                max="360"
                value={hue}
                onChange={(e) => setFlutter({ hue: Number(e.target.value) })}
                className="mt-2 w-full accent-[var(--accent)]"
              />
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={dark}
                onChange={(e) => setFlutter({ dark: e.target.checked })}
                className="size-5 accent-[var(--accent)]"
              />
              Dark theme
            </label>
          </div>
        )}
        {tab === 'Shape' && (
          <label className="block">
            Button corner radius: {radius}px
            <input
              type="range"
              min="0"
              max="28"
              value={radius}
              onChange={(e) => setFlutter({ radius: Number(e.target.value) })}
              className="mt-2 w-full accent-[var(--accent)]"
            />
          </label>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setFlutter((s) => ({ count: s.count + 1, scene: 'lab' }))}
          className="press h-[72px] bg-fg text-bg hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg max-sm:h-[60px]"
        >
          Tap +
        </button>
        <button
          type="button"
          onClick={() => setFlutter({ count: 0, scene: 'lab' })}
          className="press h-[72px] bg-surface hover:bg-[var(--field-2)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg max-sm:h-[60px]"
        >
          Hot restart
        </button>
      </div>

      <pre className="overflow-x-auto bg-[#1d211b] p-5 font-mono text-[13px] leading-relaxed text-[#e3e2da]">
        <code>
          {'theme: ThemeData(\n  colorScheme: ColorScheme.fromSeed(\n    seedColor: '}
          <span className="text-[#9fd8b4]">{`Color(${hex})`}</span>
          {',\n    brightness: '}
          <span className="text-[#9fd8b4]">{dark ? 'Brightness.dark' : 'Brightness.light'}</span>
          {
            ',\n  ),\n),\n\nFloatingActionButton(\n  shape: RoundedRectangleBorder(\n    borderRadius: BorderRadius.circular('
          }
          <span className="text-[#9fd8b4]">{radius}</span>
          {'),\n  ),\n  onPressed: _incrementCounter, // count = '}
          <span className="text-[#9fd8b4]">{count}</span>
          {'\n)'}
        </code>
      </pre>
    </div>
  )
}
