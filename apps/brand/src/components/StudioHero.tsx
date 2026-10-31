'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const Monogram3D = dynamic(() => import('./Monogram3D'), { ssr: false })

function FlatMark({ color }: { color: string }) {
  return (
    <svg viewBox="-1.4 -1.2 2.8 2.4" className="size-full p-[12%]" aria-hidden>
      <polygon
        points="-1.2,1 -1.2,-1 -0.75,-1 0,-0.15 0.75,-1 1.2,-1 1.2,1 0.75,1 0.75,-0.3 0,0.55 -0.75,-0.3 -0.75,1"
        fill={color}
      />
    </svg>
  )
}

// The 3D mark loads once the browser is idle and only with motion allowed; until
// then, and otherwise, the flat letter stands in.
export function StudioMark({ kinds }: { kinds: { key: string; label: string; color: string }[] }) {
  const [ready, setReady] = useState(false)
  const [color, setColor] = useState('#ff4d00')

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const start = () => setReady(true)
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(start, { timeout: 2000 })
      return () => cancelIdleCallback(id)
    }
    const id = setTimeout(start, 800)
    return () => clearTimeout(id)
  }, [])

  return (
    <div className="flex h-full flex-col">
      <div className="relative min-h-[18rem] flex-1">
        {ready ? <Monogram3D color={color} /> : <FlatMark color={color} />}
      </div>
      <ul className="flex flex-wrap gap-2" aria-label="Kinds of post">
        {kinds.map((k) => (
          <li key={k.key}>
            <a
              href={`#${k.key}`}
              onPointerEnter={() => setColor(k.color)}
              onFocus={() => setColor(k.color)}
              className="flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm transition hover:border-fg"
            >
              <span
                className="size-2.5 rounded-full ring-1 ring-fg/30"
                style={{ background: k.color }}
              />
              {k.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
