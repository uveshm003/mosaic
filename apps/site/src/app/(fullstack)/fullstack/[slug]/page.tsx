import { demoReviewer } from '@mosaic/content'
import { RichText } from '@mosaic/ui'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArchitectureDiagram } from '../../../../components/fullstack/ArchitectureDiagram'
import {
  demoAdminUrl,
  demoStatusLabel,
  formatPeriod,
  isEnabled,
  platformLabel,
  projectFor,
  projectsFor,
} from '../../../../lib/content'
import { strip } from '../../../../lib/fullstack'
import { SITE_URL } from '../../../../lib/site'

interface Props {
  params: Promise<{ slug: string }>
}

// A static export needs at least one path; the placeholder renders as not found.
export function generateStaticParams() {
  if (!isEnabled('fullstack')) return [{ slug: '_' }]
  const slugs = projectsFor('fullstack').map(({ slug }) => ({ slug }))
  return slugs.length > 0 ? slugs : [{ slug: '_' }]
}

export const dynamicParams = false

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = isEnabled('fullstack') ? projectFor('fullstack', (await params).slug) : null
  if (!project) return {}
  return {
    title: `${strip(project.title)} · Full-stack`,
    description: project.summary ?? undefined,
  }
}

// A full-stack case study: the architecture first, then the story, the stack and the links.
export default async function FullstackCaseStudy({ params }: Props) {
  if (!isEnabled('fullstack')) notFound()
  const { slug } = await params
  const project = projectFor('fullstack', slug)
  if (!project) notFound()

  const demo = project.demoAdmin ? demoAdminUrl() : null
  const live = project.demoStatus === 'live' || project.demoStatus === 'demo-build'
  const links = [
    { label: 'Live', href: project.live },
    { label: 'Repository', href: project.repo },
    { label: 'Video', href: project.video },
  ].filter((link): link is { label: string; href: string } => Boolean(link.href))
  const facts = [
    ['role', project.role],
    ['team', project.team],
    ['period', formatPeriod(project.start, project.end)],
    ['platforms', project.platforms.map((p) => platformLabel[p] ?? p).join(', ')],
    ['kind', project.kind],
  ].filter((row): row is [string, string] => Boolean(row[1]))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.title,
    description: project.summary ?? undefined,
    url: `${SITE_URL}/fullstack/${project.slug}`,
    applicationCategory: 'DeveloperApplication',
    keywords: project.tech.join(', ') || undefined,
  }

  return (
    <main className="space-y-5 p-4 sm:p-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="font-mono text-xs text-muted">
        <Link href="/fullstack" className="hover:text-fg">
          fullstack
        </Link>{' '}
        /{' '}
        <Link href="/fullstack#projects" className="hover:text-fg">
          projects
        </Link>{' '}
        / <span className="text-fg">{project.slug.replace(/^sample-/, '')}</span>
      </nav>

      <header className="grid gap-5 rounded-xl border border-line bg-surface p-5 sm:p-8 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2 py-0.5 font-mono text-[11px]">
            <span className={`size-1.5 rounded-full ${live ? 'bg-[var(--ok)]' : 'bg-muted'}`} />
            {demoStatusLabel[project.demoStatus]}
          </span>
          <h1 className="mt-4 text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.03] font-semibold tracking-[-0.03em]">
            {strip(project.title)}
          </h1>
          {project.summary && (
            <p className="mt-4 max-w-2xl text-lg text-muted">{project.summary}</p>
          )}
        </div>
        <dl className="grid content-start grid-cols-[6rem_1fr] gap-y-1.5 rounded-lg bg-bg p-4 font-mono text-xs">
          {facts.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-muted">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </header>

      {project.architecture && (
        <ArchitectureDiagram
          architecture={project.architecture}
          title={project.slug.replace(/^sample-/, '')}
        />
      )}

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        {project.body !== null ? (
          <article className="rounded-xl border border-line bg-surface p-5 sm:p-8">
            <div className="max-w-prose space-y-4 leading-[1.75] [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2:first-child]:mt-0 [&_h3]:mt-6 [&_h3]:font-semibold">
              <RichText value={project.body} />
            </div>
          </article>
        ) : (
          <div />
        )}
        <aside className="space-y-5">
          {(project.highlights.length > 0 || project.metrics.length > 0) && (
            <section
              aria-labelledby="results"
              className="rounded-xl border border-line bg-surface p-4"
            >
              <h2 id="results" className="font-mono text-xs text-muted uppercase">
                Results
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                {project.highlights.map((h) => (
                  <li key={h}>→ {h}</li>
                ))}
              </ul>
              {project.metrics.length > 0 && (
                <dl className="mt-3 grid grid-cols-2 gap-2">
                  {project.metrics.map((m) => (
                    <div key={m.label} className="rounded-lg bg-bg p-2">
                      <dt className="font-mono text-[10px] text-muted uppercase">{m.label}</dt>
                      <dd className="text-lg font-semibold">{m.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </section>
          )}
          <section
            aria-labelledby="stack-title"
            className="rounded-xl border border-line bg-surface p-4"
          >
            <h2 id="stack-title" className="font-mono text-xs text-muted uppercase">
              Stack
            </h2>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {project.tech.map((t) => (
                <li key={t} className="rounded bg-bg px-2 py-1 font-mono text-xs">
                  {t}
                </li>
              ))}
            </ul>
            {links.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="inline-block rounded-lg border border-line px-3 py-1.5 font-mono text-xs hover:border-accent"
                    >
                      {l.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>
          {demo && (
            <section
              aria-labelledby="demo-title"
              className="rounded-xl border-2 border-accent bg-surface p-4"
            >
              <h2 id="demo-title" className="font-mono text-xs text-accent uppercase">
                Try it: demo admin
              </h2>
              <p className="mt-2 text-sm">
                Demo data, reset every night. Sign in as a read-only reviewer:
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
            </section>
          )}
        </aside>
      </div>
    </main>
  )
}
