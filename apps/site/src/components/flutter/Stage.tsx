'use client'

import { oklchToHex } from '../../lib/color'
import { setFlutter, useFlutter, type StageScene } from './store'
import { Terminal, type TerminalData } from './Terminal'

export interface StageProject {
  id: number
  title: string
  summary: string | null
  platforms: string[]
  status: string
  hue: number
  mobile: boolean
}

const deviceTargets = [
  ['Android', 'mobile'],
  ['iOS', 'mobile'],
  ['Chrome', 'web'],
  ['macOS', 'desktop'],
  ['Windows', 'desktop'],
  ['Linux', 'desktop'],
] as const

function tone(hue: number, l: number, c = 0.06) {
  return `oklch(${String(l)} ${String(c)} ${String(hue)})`
}

// The active project as its own app: a Material-style screen in a tonal palette from its hue.
function ProjectScreen({ project }: { project: StageProject }) {
  const body = (
    <div className="flex h-full flex-col" style={{ background: tone(project.hue, 0.97, 0.015) }}>
      <div className="px-5 pt-8 pb-5" style={{ background: tone(project.hue, 0.88, 0.07) }}>
        <p className="text-lg leading-tight font-medium text-[#1c1c1c]">
          {project.title.replace(/^Sample:\s*/, '')}
        </p>
        <p className="mt-1 text-xs text-[#38424a]">{project.status}</p>
      </div>
      <div className="flex-1 space-y-3 p-4">
        {project.summary && (
          <p
            className="rounded-2xl p-4 text-sm leading-snug text-[#1c1c1c]"
            style={{ background: tone(project.hue, 0.92, 0.04) }}
          >
            {project.summary}
          </p>
        )}
        <div className="flex flex-wrap gap-1.5">
          {project.platforms.map((p) => (
            <span
              key={p}
              className="rounded-full px-3 py-1 text-xs text-[#1c1c1c]"
              style={{ background: tone(project.hue, 0.9, 0.05) }}
            >
              {p}
            </span>
          ))}
        </div>
        {[0, 1].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-2xl p-3"
            style={{ background: tone(project.hue + i * 40, 0.93, 0.03) }}
          >
            <span
              className="size-9 rounded-full"
              style={{ background: tone(project.hue + i * 40, 0.7, 0.12) }}
            />
            <span
              className="h-2.5 flex-1 rounded-full"
              style={{ background: tone(project.hue, 0.82, 0.03) }}
            />
          </div>
        ))}
      </div>
      <div
        className="flex justify-around py-3"
        style={{ background: tone(project.hue, 0.93, 0.04) }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-8 rounded-full"
            style={{
              background: i === 0 ? tone(project.hue, 0.45, 0.12) : tone(project.hue, 0.8, 0.03),
            }}
          />
        ))}
      </div>
    </div>
  )
  return project.mobile ? (
    <div
      data-ui
      className="aspect-[9/19] h-[min(82%,640px)] overflow-hidden rounded-[2.4rem] border-[10px] border-[#1d211b]"
    >
      {body}
    </div>
  ) : (
    <div
      data-ui
      className="aspect-[16/10] w-[88%] overflow-hidden rounded-xl border-[8px] border-t-[28px] border-[#1d211b]"
    >
      {body}
    </div>
  )
}

export function CounterPhone() {
  const { count, hue, radius, dark } = useFlutter((s) => s)
  const container = dark ? `oklch(0.32 0.06 ${String(hue)})` : `oklch(0.9 0.06 ${String(hue)})`
  const surface = dark ? `oklch(0.2 0.02 ${String(hue)})` : `oklch(0.98 0.01 ${String(hue)})`
  const onSurface = dark ? '#e9e9ef' : '#1c1b20'
  return (
    <div
      data-ui
      role="group"
      aria-label={`Flutter counter app preview, seed colour #${oklchToHex(0.6, 0.17, hue)}`}
      className="relative flex aspect-[9/19] h-[min(82%,640px)] flex-col overflow-hidden rounded-[2.4rem] border-[10px] border-[#1d211b] transition-colors"
      style={{ background: surface, color: onSurface }}
    >
      <div className="px-5 pt-9 pb-4 text-base transition-colors" style={{ background: container }}>
        Flutter Demo Home Page
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-1 px-4 text-center text-sm">
        <p>You have pushed the button this many times:</p>
        <p className="text-5xl tabular-nums" aria-live="polite">
          {count}
        </p>
      </div>
      <button
        type="button"
        aria-label="Increment"
        onClick={() => setFlutter((s) => ({ count: s.count + 1 }))}
        className="press absolute right-5 bottom-5 grid size-14 place-items-center text-2xl transition-[border-radius,background-color] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
        style={{ background: container, borderRadius: radius }}
      >
        +
      </button>
    </div>
  )
}

function DevicesWindow() {
  return (
    <div
      data-ui
      className="w-[86%] overflow-hidden rounded-xl bg-[#1d211b] font-mono text-[13px] text-[#e3e2da]" // taste-skill-ignore: flutter devices output is literal code
    >
      <p className="px-5 pt-5 opacity-70">$ flutter devices</p>
      <ul className="space-y-2 p-5">
        {deviceTargets.map(([name, kind]) => (
          <li key={name} className="flex justify-between gap-4">
            <span>
              <span className="text-[#9fd8b4]">●</span> {name}
            </span>
            <span className="opacity-70">{kind}</span>
          </li>
        ))}
      </ul>
      <p className="px-5 pb-5 opacity-70">6 targets · one codebase</p>
    </div>
  )
}

const fields: Record<StageScene, string> = {
  run: 'bg-[var(--field-2)]',
  work: 'bg-[var(--field-3)]',
  lab: 'bg-[var(--field-2)]',
  devices: 'bg-[var(--field-1)]',
}

// The fixed half: one stage whose scene follows the section being read.
export function Stage({
  projects,
  terminal,
}: {
  projects: StageProject[]
  terminal: TerminalData
}) {
  const scene = useFlutter((s) => s.scene)
  const activeId = useFlutter((s) => s.project)
  const project = projects.find((p) => p.id === activeId) ?? projects[0]
  // Only the active scene is laid out; it fades in. The others keep their state but leave the page.
  const layer = 'stage-scene absolute inset-0 grid place-items-center p-[6%]'

  return (
    <div
      className={`relative h-full w-full overflow-clip transition-colors duration-500 ${fields[scene]}`}
    >
      <div className={layer} hidden={scene !== 'run'}>
        <div className="aspect-[16/10] w-[92%]">
          <Terminal data={terminal} />
        </div>
      </div>
      <div className={layer} hidden={scene !== 'work'}>
        {project && <ProjectScreen key={project.id} project={project} />}
      </div>
      <div className={layer} hidden={scene !== 'lab'}>
        <CounterPhone />
      </div>
      <div className={layer} hidden={scene !== 'devices'}>
        <DevicesWindow />
      </div>
    </div>
  )
}
