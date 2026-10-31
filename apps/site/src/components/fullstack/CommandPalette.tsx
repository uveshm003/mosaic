'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useStack } from './StackContext'

export type Command =
  | { group: string; label: string; hint?: string; href: string }
  | { group: string; label: string; hint?: string; tech: string }

export function matches(command: Command, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const text = `${command.group} ${command.label} ${command.hint ?? ''}`.toLowerCase()
  return q.split(/\s+/).every((word) => text.includes(word))
}

// ⌘K (or Ctrl+K, or /) to jump anywhere: sections, case studies, links, or "where is X used?"
export function CommandPalette({ commands }: { commands: Command[] }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const router = useRouter()
  const { setTech } = useStack()
  const results = useMemo(() => commands.filter((c) => matches(c, query)), [commands, query])

  const open = () => {
    setQuery('')
    setActive(0)
    dialog.current?.showModal()
    input.current?.focus()
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing =
        e.target instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault()
        if (dialog.current?.open) dialog.current.close()
        else open()
      }
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [])

  const run = (command: Command | undefined) => {
    if (!command) return
    dialog.current?.close()
    if ('tech' in command) {
      setTech(command.tech)
      document.getElementById('stack')?.scrollIntoView({ behavior: 'smooth' })
    } else if (/^https?:/.test(command.href)) {
      window.open(command.href, '_blank', 'noopener')
    } else {
      router.push(command.href)
    }
  }

  let lastGroup = ''
  return (
    <>
      <button
        type="button"
        onClick={open}
        className="flex items-center gap-3 rounded-lg border border-line bg-surface px-3 py-1.5 text-sm text-muted hover:border-accent"
      >
        <span>Search or jump to…</span>
        <kbd className="rounded border border-line px-1.5 font-mono text-[11px]">⌘K</kbd>
      </button>
      <dialog
        ref={dialog}
        aria-label="Command palette"
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current.close()
        }}
        className="m-auto mt-[12vh] w-[min(36rem,calc(100vw-2rem))] rounded-xl border border-line bg-surface p-0 text-fg shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-[2px]"
      >
        <input
          ref={input}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setActive(0)
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setActive((i) => Math.min(i + 1, results.length - 1))
            } else if (e.key === 'ArrowUp') {
              e.preventDefault()
              setActive((i) => Math.max(i - 1, 0))
            } else if (e.key === 'Enter') {
              e.preventDefault()
              run(results[active])
            }
          }}
          role="combobox"
          aria-expanded
          aria-controls="palette-results"
          aria-activedescendant={results[active] ? `cmd-${String(active)}` : undefined}
          placeholder="Type a project, a technology, or a section…"
          className="w-full border-b border-line bg-transparent px-4 py-3.5 outline-none"
        />
        <ul id="palette-results" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-muted">Nothing matches.</li>
          )}
          {results.map((c, i) => {
            const header = c.group !== lastGroup
            lastGroup = c.group
            return (
              <li key={`${c.group}-${c.label}`} role="presentation">
                {header && (
                  <p className="px-3 pt-2 pb-1 font-mono text-[10px] text-muted uppercase">
                    {c.group}
                  </p>
                )}
                <div
                  id={`cmd-${String(i)}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => run(c)}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2 text-sm ${i === active ? 'bg-accent text-accent-fg' : ''}`}
                >
                  <span>{c.label}</span>
                  {c.hint && (
                    <span
                      className={`font-mono text-[11px] ${i === active ? 'opacity-80' : 'text-muted'}`}
                    >
                      {c.hint}
                    </span>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
        <p className="flex gap-4 border-t border-line px-4 py-2 font-mono text-[10px] text-muted">
          <span>↑↓ move</span>
          <span>↵ open</span>
          <span>esc close</span>
        </p>
      </dialog>
    </>
  )
}
