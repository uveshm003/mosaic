'use client'

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'

export interface TerminalData {
  name: string
  headline: string
  location: string
  projects: { title: string; href: string }[]
  skills: string[]
  experience: string[]
  links: { label: string; url: string }[]
}

type Line = { id: number; prompt?: string; body: ReactNode }

const CLEAR = Symbol('clear')
const BOOT = 'flutter run -d all'
const targets = ['Android', 'iOS', 'Chrome', 'macOS', 'Windows', 'Linux']

function run(command: string, data: TerminalData): ReactNode | typeof CLEAR {
  const [cmd = ''] = command.trim().toLowerCase().split(/\s+/)
  switch (cmd) {
    case '':
      return null
    case 'flutter':
      return (
        <ul>
          {targets.map((t) => (
            <li key={t}>
              Launched on {t} <span className="text-[#9fd8b4]">done</span>
            </li>
          ))}
          <li className="mt-1 opacity-70">Type “help” to look around.</li>
        </ul>
      )
    case 'help':
      return 'whoami · projects · skills · experience · contact · clear'
    case 'whoami':
      return `${data.name}, ${data.headline.toLowerCase()} in ${data.location}.`
    case 'projects':
    case 'ls':
      return (
        <ul>
          {data.projects.map((p) => (
            <li key={p.href}>
              <a
                href={p.href}
                className="underline decoration-dotted underline-offset-4 hover:text-[#9fd8b4]"
              >
                {p.title}
              </a>
            </li>
          ))}
        </ul>
      )
    case 'skills':
      return data.skills.join(' · ')
    case 'experience':
      return (
        <ul>
          {data.experience.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )
    case 'contact':
      return (
        <ul>
          {data.links.map((l) => (
            <li key={l.url}>
              <a href={l.url} className="underline underline-offset-4 hover:text-[#9fd8b4]">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )
    case 'clear':
      return CLEAR
    default:
      return `command not found: ${cmd}. Try “help”.`
  }
}

// A real terminal window on the stage: it boots with `flutter run`, then takes commands.
export function Terminal({ data }: { data: TerminalData }) {
  const [lines, setLines] = useState<Line[]>([])
  const [typed, setTyped] = useState('')
  const [value, setValue] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [cursor, setCursor] = useState(-1)
  const screen = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const nextId = useRef(1)

  const submit = (command: string) => {
    const output = run(command, data)
    if (output === CLEAR) setLines([])
    else setLines((prev) => [...prev, { id: nextId.current++, prompt: command, body: output }])
    if (command.trim()) setHistory((prev) => [command, ...prev].slice(0, 20))
    setCursor(-1)
    setValue('')
  }

  // Boot: type the command, then show the launch. Instant under reduced motion.
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setLines([{ id: 0, prompt: BOOT, body: run(BOOT, data) as ReactNode }])
      return
    }
    let i = 0
    const timer = setInterval(() => {
      i += 1
      setTyped(BOOT.slice(0, i))
      if (i >= BOOT.length) {
        clearInterval(timer)
        setTimeout(() => {
          setTyped('')
          setLines([{ id: 0, prompt: BOOT, body: run(BOOT, data) as ReactNode }])
        }, 350)
      }
    }, 45)
    return () => {
      clearInterval(timer)
    }
  }, [data])

  useEffect(() => {
    screen.current?.scrollTo({ top: screen.current.scrollHeight })
  }, [lines])

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
    <div
      data-ui
      className="flex h-full w-full flex-col overflow-hidden rounded-xl bg-[#1d211b] font-mono text-[13px] text-[#e3e2da]" // taste-skill-ignore: a terminal shows literal code
    >
      <div className="flex items-center gap-2 px-4 py-3">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-xs opacity-70">~/portfolio</span>
      </div>
      <div
        ref={screen}
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
        className="flex-1 space-y-3 overflow-y-auto px-4 pb-4 leading-relaxed"
        onClick={() => input.current?.focus()}
      >
        {lines.map((line) => (
          <div key={line.id}>
            {line.prompt !== undefined && (
              <p>
                <span className="text-[#9fd8b4]">$</span> {line.prompt}
              </p>
            )}
            <div className="opacity-90">{line.body}</div>
          </div>
        ))}
        {typed && (
          <p aria-hidden>
            <span className="text-[#9fd8b4]">$</span> {typed}
          </p>
        )}
        <label className="flex items-center gap-2">
          <span className="text-[#9fd8b4]" aria-hidden>
            $
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
            className="w-full bg-transparent caret-[#9fd8b4] outline-none"
          />
        </label>
      </div>
    </div>
  )
}
