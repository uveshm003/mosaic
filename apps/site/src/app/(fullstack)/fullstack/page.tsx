import { demoReviewer } from '@mosaic/content'
import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArchitectureDiagram } from '../../../components/fullstack/ArchitectureDiagram'
import { ProjectRows } from '../../../components/fullstack/ProjectRows'
import { StackExplorer } from '../../../components/fullstack/StackExplorer'
import {
  demoAdminUrl,
  demoStatusLabel,
  formatMonth,
  isEnabled,
  person,
  profile,
  projectsFor,
  techCatalog,
} from '../../../lib/content'
import { strip } from '../../../lib/fullstack'

export function generateMetadata(): Metadata {
  if (!isEnabled('fullstack')) return {}
  const seo = profile('fullstack')
  return {
    title: seo.title ? strip(seo.title) : 'Full-stack',
    description: seo.tagline ?? undefined,
  }
}

function Panel({
  id,
  title,
  action,
  children,
  className = '',
}: {
  id: string
  title: string
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`min-w-0 scroll-mt-16 rounded-xl border border-line bg-surface ${className}`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
        <h2 id={`${id}-title`} className="font-mono text-xs text-muted uppercase">
          {title}
        </h2>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </section>
  )
}

// The Full-stack profile: an app-like overview of systems, stack and demos.
export default function Fullstack() {
  if (!isEnabled('fullstack')) {
    return (
      <main className="px-6 py-24">
        <h1 className="text-4xl font-semibold">Full-stack</h1>
        <p className="mt-4 text-muted">This page is being built.</p>
      </main>
    )
  }

  const me = person()
  const settings = profile('fullstack')
  const projects = projectsFor('fullstack')
  const featured =
    projects.find((p) => p.demoAdmin && p.architecture) ?? projects.find((p) => p.architecture)
  const demo = demoAdminUrl()
  const github = me.contactLinks?.find((l) => l.url.includes('github.com'))
  const email = me.contactLinks?.find((l) => l.url.startsWith('mailto:'))
  const catalog = techCatalog(projects)
  const live = (s: string) => s === 'live' || s === 'demo-build'
  const activity = projects
    .flatMap((p) => [
      ...(p.start ? [{ at: p.start, verb: 'started', project: p }] : []),
      ...(p.end ? [{ at: p.end, verb: 'shipped', project: p }] : []),
    ])
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 10)

  const stats = [
    ['Projects', projects.length],
    ['Technologies', catalog.reduce((n, g) => n + g.tech.length, 0)],
    ['Diagrams', projects.filter((p) => p.architecture).length],
    ['Runnable demos', projects.filter((p) => live(p.demoStatus)).length],
  ] as const

  return (
    <main className="space-y-5 p-4 sm:p-6">
      <section
        id="overview"
        aria-labelledby="overview-title"
        className="dots scroll-mt-16 rounded-xl border border-line px-5 py-10 sm:px-8 sm:py-14"
      >
        <p className="font-mono text-xs text-muted">~/fullstack $ whoami</p>
        <h1
          id="overview-title"
          className="mt-3 max-w-3xl text-[clamp(2.2rem,5vw,4rem)] leading-[1.02] font-semibold tracking-[-0.03em]"
        >
          {strip(me.name ?? '')}, building systems end to end.
        </h1>
        {settings.tagline && (
          <p className="mt-4 max-w-2xl text-lg text-muted">{settings.tagline}</p>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          {github && (
            <a
              href={github.url}
              className="rounded-lg bg-fg px-4 py-2.5 text-sm font-semibold text-bg hover:opacity-90"
            >
              GitHub ↗
            </a>
          )}
          {demo && (
            <a
              href="#demo"
              className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-fg hover:brightness-110"
            >
              Try the demo admin
            </a>
          )}
          <span className="rounded-lg border border-line bg-surface px-4 py-2.5 font-mono text-xs leading-5 text-muted">
            press <kbd className="text-fg">⌘K</kbd> to jump anywhere
          </span>
        </div>
        <dl className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map(([label, value]) => (
            <div key={label} className="rounded-lg border border-line bg-surface p-3">
              <dt className="font-mono text-[11px] text-muted uppercase">{label}</dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {featured?.architecture && (
        <section id="architecture" aria-labelledby="architecture-title" className="scroll-mt-16">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 id="architecture-title" className="text-xl font-semibold">
                How {strip(featured.title).split(':')[0]} fits together
              </h2>
              <p className="text-sm text-muted">Send a request through it, or step hop by hop.</p>
            </div>
            <Link
              href={`/fullstack/${featured.slug}`}
              className="font-mono text-xs text-accent hover:underline"
            >
              Read the case study →
            </Link>
          </div>
          <ArchitectureDiagram
            architecture={featured.architecture}
            title={featured.slug.replace(/^sample-/, '')}
          />
        </section>
      )}

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <Panel id="projects" title={`Projects · ${String(projects.length)}`}>
          <ProjectRows
            rows={projects.map((p) => ({
              slug: p.slug,
              title: strip(p.title),
              summary: p.summary,
              kind: p.kind,
              tech: p.tech,
              status: demoStatusLabel[p.demoStatus],
              live: live(p.demoStatus),
              diagram: p.architecture !== null,
            }))}
          />
        </Panel>
        <div className="min-w-0 space-y-5">
          <Panel id="stack" title="Stack explorer">
            <StackExplorer groups={catalog} />
          </Panel>
          {demo && (
            <Panel id="demo" title="Demo admin">
              <p className="text-sm">
                The admin behind this site, with demo data that resets every night. Sign in as a
                read-only reviewer.
              </p>
              <dl className="mt-3 grid grid-cols-[5rem_1fr] gap-y-1 rounded-lg bg-bg p-3 font-mono text-xs">
                <dt className="text-muted">email</dt>
                <dd className="select-all">{demoReviewer.email}</dd>
                <dt className="text-muted">password</dt>
                <dd className="select-all">{demoReviewer.password}</dd>
              </dl>
              <a
                href={demo}
                className="mt-3 inline-block rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-accent-fg"
              >
                Open the demo admin ↗
              </a>
            </Panel>
          )}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel id="activity" title="Activity log">
          <ol className="space-y-1 font-mono text-xs">
            {activity.map((a) => (
              <li
                key={`${a.project.slug}-${a.verb}`}
                className="grid grid-cols-[5.5rem_4.5rem_1fr] gap-2"
              >
                <span className="text-muted">{formatMonth(a.at)}</span>
                <span className={a.verb === 'shipped' ? 'text-[var(--ok)]' : 'text-accent'}>
                  {a.verb}
                </span>
                <Link href={`/fullstack/${a.project.slug}`} className="truncate hover:underline">
                  {strip(a.project.title)}
                </Link>
              </li>
            ))}
          </ol>
        </Panel>
        <Panel id="contact" title="Contact">
          <p className="text-sm">
            Hiring for a full-stack role? The code is the best introduction.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {github && (
              <li>
                <a href={github.url} className="font-mono text-accent hover:underline">
                  {github.url.replace(/^https?:\/\//, '')} ↗
                </a>
              </li>
            )}
            {email && (
              <li>
                <a href={email.url} className="font-mono text-accent hover:underline">
                  {email.url.replace('mailto:', '')}
                </a>
              </li>
            )}
          </ul>
        </Panel>
      </div>
    </main>
  )
}
