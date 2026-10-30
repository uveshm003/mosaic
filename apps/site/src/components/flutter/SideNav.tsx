'use client'

import { useEffect, useState } from 'react'

// Highlights the section currently in view, like a table of contents.
export function SideNav({ sections }: { sections: { id: string; label: string }[] }) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const first = sections[0] ? document.getElementById(sections[0].id) : null
    const last = sections.at(-1)?.id ?? null
    let inBand: string | null = null

    // One rule for every update: nothing above the first section, the last section once the
    // page bottoms out (it can never reach the middle of the screen), otherwise the one in view.
    const update = () => {
      if (first && first.getBoundingClientRect().top > window.innerHeight * 0.45) setActive(null)
      else if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2)
        setActive(last)
      else if (inBand) setActive(inBand)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visible) inBand = visible.target.id
        update()
      },
      { rootMargin: '-35% 0px -55% 0px' },
    )
    for (const { id } of sections) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', update)
    }
  }, [sections])

  return (
    <nav aria-label="Sections" className="hidden lg:block">
      <ul className="space-y-3">
        {sections.map(({ id, label }) => {
          const on = id === active
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={on ? 'location' : undefined}
                className="group flex items-center gap-4 py-1 font-mono text-xs tracking-widest uppercase focus-visible:outline-2 focus-visible:outline-accent"
              >
                <span
                  className={`h-px transition-all duration-300 ${on ? 'w-16 bg-accent' : 'w-8 bg-muted group-hover:w-16 group-hover:bg-fg'}`}
                />
                <span className={on ? 'text-fg' : 'text-muted group-hover:text-fg'}>{label}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
