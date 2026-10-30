'use client'

import { useState } from 'react'

// OKLCH → sRGB hex, so the Dart snippet shows the colour the preview uses.
// Same result on the server and in the browser, which keeps hydration stable.
export function oklchToHex(l: number, c: number, h: number): string {
  const rad = (h * Math.PI) / 180
  const a = c * Math.cos(rad)
  const b = c * Math.sin(rad)
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3
  const linear = [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ]
  return linear
    .map((v) => {
      const srgb = v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055
      return Math.round(Math.min(1, Math.max(0, srgb)) * 255)
        .toString(16)
        .padStart(2, '0')
    })
    .join('')
}

// Flutter's starter counter app, rebuilt in the browser to play with: a nod to the demo lab.
export function Playground() {
  const [count, setCount] = useState(0)
  const [hue, setHue] = useState(265)
  const [radius, setRadius] = useState(16)
  const [dark, setDark] = useState(false)

  const container = dark ? `oklch(0.3 0.06 ${String(hue)})` : `oklch(0.92 0.05 ${String(hue)})`
  const surface = dark ? `oklch(0.18 0.02 ${String(hue)})` : `oklch(0.98 0.01 ${String(hue)})`
  const onSurface = dark ? '#e9e9ef' : '#1c1b20'
  const hex = `0xff${oklchToHex(0.6, 0.17, hue)}`

  return (
    <div className="grid gap-6 md:grid-cols-[13rem_1fr]">
      <div
        className="relative mx-auto flex h-[25rem] w-52 flex-col overflow-hidden rounded-[2rem] border-4 border-[#1b1d24] shadow-2xl transition-colors"
        style={{ background: surface, color: onSurface }}
        role="group"
        aria-label="Flutter counter app preview"
      >
        <div
          className="px-4 pt-8 pb-3 text-sm font-medium transition-colors"
          style={{ background: container }}
        >
          Flutter Demo Home Page
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-1 text-center text-xs">
          <p>You have pushed the button this many times:</p>
          <p className="text-4xl font-semibold tabular-nums" aria-live="polite">
            {count}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCount((n) => n + 1)}
          aria-label="Increment"
          className="absolute right-4 bottom-4 grid size-12 place-items-center text-2xl shadow-lg transition-[border-radius,background-color] active:scale-95"
          style={{ background: container, borderRadius: radius, color: onSurface }}
        >
          +
        </button>
      </div>

      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block font-mono text-xs text-muted">
            Seed colour
            <input
              type="range"
              min="0"
              max="360"
              value={hue}
              onChange={(e) => setHue(Number(e.target.value))}
              className="mt-2 w-full accent-accent"
            />
          </label>
          <label className="block font-mono text-xs text-muted">
            Button corner radius: {radius}px
            <input
              type="range"
              min="0"
              max="24"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="mt-2 w-full accent-accent"
            />
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={dark}
            onClick={() => setDark((d) => !d)}
            className="rounded-full border border-line px-3 py-1.5 font-mono text-xs transition hover:border-accent focus-visible:outline-2 focus-visible:outline-accent"
          >
            {dark ? '☾ dark' : '☀ light'}
          </button>
          <button
            type="button"
            onClick={() => setCount(0)}
            className="rounded-full border border-line px-3 py-1.5 font-mono text-xs transition hover:border-accent focus-visible:outline-2 focus-visible:outline-accent"
          >
            hot restart ↺
          </button>
        </div>
        <pre className="card overflow-x-auto p-4 font-mono text-[12px] leading-relaxed text-fg/80">
          <code>
            <span className="text-muted">{'// what you are seeing, in Flutter\n'}</span>
            {'theme: ThemeData(\n  colorScheme: ColorScheme.fromSeed(\n    seedColor: '}
            <span className="text-accent">{`Color(${hex})`}</span>
            {',\n    brightness: '}
            <span className="text-accent">{dark ? 'Brightness.dark' : 'Brightness.light'}</span>
            {
              ',\n  ),\n),\n\nFloatingActionButton(\n  shape: RoundedRectangleBorder(\n    borderRadius: BorderRadius.circular('
            }
            <span className="text-accent">{radius}</span>
            {'),\n  ),\n  onPressed: _incrementCounter, '}
            <span className="text-muted">{`// count = ${String(count)}`}</span>
            {'\n)'}
          </code>
        </pre>
      </div>
    </div>
  )
}
