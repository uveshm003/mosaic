'use client'

import { useEffect, useState } from 'react'

// Swaps one word of a headline every few seconds. Holds the first under reduced motion.
export function RotatingWord({ words }: { words: string[] }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setI((n) => (n + 1) % words.length), 2200)
    return () => clearInterval(id)
  }, [words.length])
  return (
    <span className="relative inline-grid justify-items-start align-baseline">
      {words.map((w, n) => (
        <span
          key={w}
          aria-hidden={n !== i}
          className={`col-start-1 row-start-1 transition-all duration-500 ease-out ${n === i ? 'translate-y-0 opacity-100' : n < i ? '-translate-y-6 opacity-0' : 'translate-y-6 opacity-0'}`}
        >
          {w}
        </span>
      ))}
    </span>
  )
}
