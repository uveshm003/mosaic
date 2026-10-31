'use client'

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'

export interface HubTerminalData {
  name: string
  headline: string
  location: string
  about: string[]
  portfolios: { key: string; label: string; description: string; href: string | null }[]
  links: { label: string; url: string }[]
}

type Line = { id: number; prompt?: string; body: ReactNode }

const chips = ['help', 'whoami', 'ls', 'cd flutter', 'contact'] as const

type CdResult = { href: string; message: string } | { href: null; message: string }

// Resolves `cd <name>` to a portfolio: only built portfolios have an href to open.
export function resolveCd(
  arg: string | undefined,
  portfolios: HubTerminalData['portfolios'],
): CdResult {
  const name = (arg ?? '').replace(/\/$/, '')
  const target = portfolios.find((p) => p.key === name)
  if (!target) return { href: null, message: `cd: no such portfolio: ${arg ?? ''}. Try “ls”.` }
  if (!target.href) return { href: null, message: `${target.label} is coming later.` }
  return { href: target.href, message: `Opening ${target.label}…` }
}
const CLEAR = Symbol('clear')

function run(command: string, data: HubTerminalData): ReactNode | typeof CLEAR {
  const [cmd = '', ...args] = command.trim().toLowerCase().split(/\s+/)
  switch (cmd) {
    case '':
      return null
    case 'help':
      return (
        <ul className="grid grid-cols-[7rem_1fr] gap-x-3">
          {[
            ['whoami', 'who is this?'],
            ['about', 'the longer story'],
            ['ls', 'list the portfolios'],
            ['cd <name>', 'open a portfolio'],
            ['contact', 'ways to reach me'],
            ['clear', 'clear the screen'],
          ].map(([c, d]) => (
            <li key={c} className="contents">
              <span className="text-accent">{c}</span>
              <span className="text-muted">{d}</span>
            </li>
          ))}
        </ul>
      )
    case 'whoami':
      return `${data.name}, ${data.headline.toLowerCase()} based in ${data.location}.`
    case 'about':
      return data.about.map((p, i) => (
        <p key={i} className="mb-2 last:mb-0">
          {p}
        </p>
      ))
    case 'ls':
    case 'portfolios':
      return (
        <ul>
          {data.portfolios.map((p) => (
            <li key={p.key}>
              <span className="text-accent-2">▸ </span>
              {p.href ? (
                <a
                  href={p.href}
                  className="underline decoration-dotted underline-offset-4 hover:text-accent"
                >
                  {p.key}/
                </a>
              ) : (
                <span className="text-muted">{p.key}/ (coming later)</span>
              )}
            </li>
          ))}
        </ul>
      )
    case 'cd': {
      const result = resolveCd(args[0], data.portfolios)
      if (result.href) window.location.assign(result.href)
      return result.message
    }
    case 'contact':
      return (
        <ul>
          {data.links.map((l) => (
            <li key={l.url}>
              <a href={l.url} className="text-accent underline-offset-4 hover:underline">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )
    case 'clear':
      return CLEAR
    case 'sudo':
      return args.join(' ') === 'hire'
        ? 'Permission granted. Scroll down to “contact” ↓'
        : 'Nice try.'
    default:
      return `command not found: ${cmd}. Try “help”.`
  }
}

// The hub's terminal: look around, list the portfolios, and `cd` into one.
export function HubTerminal({ data }: { data: HubTerminalData }) {
  const [lines, setLines] = useState<Line[]>([
    {
      id: 0,
      body: <span className="text-muted">Type a command, or tap one below. Try “ls”.</span>,
    },
  ])
  const [value, setValue] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [cursor, setCursor] = useState(-1)
  const screen = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const nextId = useRef(1)

  useEffect(() => {
    screen.current?.scrollTo({ top: screen.current.scrollHeight })
  }, [lines])

  const submit = (command: string) => {
    const output = run(command, data)
    if (output === CLEAR) setLines([])
    else setLines((prev) => [...prev, { id: nextId.current++, prompt: command, body: output }])
    if (command.trim()) setHistory((prev) => [command, ...prev].slice(0, 20))
    setCursor(-1)
    setValue('')
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') submit(value)
    if (event.key === 'ArrowUp' && history.length > 0) {
      event.preventDefault()
      const next = Math.min(cursor + 1, history.length - 1)
      setCursor(next)
      setValue(history[next] ?? '')
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      const next = Math.max(cursor - 1, -1)
      setCursor(next)
      setValue(next === -1 ? '' : (history[next] ?? ''))
    }
  }

  return (
    <div className="card overflow-hidden font-mono text-[13px] shadow-[0_30px_80px_-40px_var(--accent)]">
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-xs text-muted">~ — zsh</span>
      </div>
      <div
        ref={screen}
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
        className="h-64 space-y-3 overflow-y-auto px-4 py-4 leading-relaxed"
        onClick={() => input.current?.focus()}
      >
        {lines.map((line) => (
          <div key={line.id}>
            {line.prompt !== undefined && (
              <p>
                <span className="text-accent">❯</span> {line.prompt}
              </p>
            )}
            <div className="text-fg/85">{line.body}</div>
          </div>
        ))}
        <label className="flex items-center gap-2">
          <span className="text-accent" aria-hidden>
            ❯
          </span>
          <span className="sr-only">Terminal command</span>
          <input
            ref={input}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="w-full bg-transparent caret-accent outline-none"
          />
        </label>
      </div>
      <div className="flex flex-wrap gap-2 border-t border-line px-4 py-3">
        {chips.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => submit(chip)}
            className="wiggle rounded-full border border-line px-3 py-1 text-xs text-muted transition hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  )
}
