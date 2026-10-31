import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@mosaic/ui'
import {
  demoStatusLabel,
  formatPeriod,
  isEnabled,
  platformLabel,
  projectFor,
  projectsFor,
} from '../../../../lib/content'
import { SITE_URL } from '../../../../lib/site'

interface Props {
  params: Promise<{ slug: string }>
}

// A static export needs at least one path; the placeholder renders as not found.
export function generateStaticParams() {
  if (!isEnabled('flutter')) return [{ slug: '_' }]
  const slugs = projectsFor('flutter').map(({ slug }) => ({ slug }))
  return slugs.length > 0 ? slugs : [{ slug: '_' }]
}

export const dynamicParams = false

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = isEnabled('flutter') ? projectFor('flutter', (await params).slug) : null
  if (!project) return {}
  return { title: `${project.title} · Flutter`, description: project.summary ?? undefined }
}

const kindLabel = {
  work: 'Work',
  freelance: 'Freelance',
  personal: 'Personal',
  'open-source': 'Open source',
}

export default async function CaseStudy({ params }: Props) {
  if (!isEnabled('flutter')) notFound()
  const project = projectFor('flutter', (await params).slug)
  if (!project) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.summary ?? undefined,
    url: `${SITE_URL}/flutter/${project.slug}`,
    keywords: project.tech.join(', ') || undefined,
  }
  const links = [
    { label: 'Live', href: project.live },
    { label: 'Repository', href: project.repo },
    { label: 'Video', href: project.video },
  ].filter((link): link is { label: string; href: string } => Boolean(link.href))

  return (
    <main className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="flex justify-between pt-8 font-mono text-xs text-muted">
        <Link href="/flutter" className="hover:text-fg">
          ← FLUTTER
        </Link>
        <span>CASE STUDY</span>
      </nav>

      <header className="grid gap-6 border-b border-fg pt-10 pb-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <h1 className="text-[clamp(2.2rem,6vw,4.5rem)] leading-[0.98] font-semibold tracking-[-0.035em]">
            {project.title}
          </h1>
          {project.summary && (
            <p className="mt-5 max-w-2xl text-lg text-muted">{project.summary}</p>
          )}
        </div>
        <dl className="grid grid-cols-[6.5rem_1fr] content-end gap-y-2 font-mono text-xs lg:col-span-4">
          {project.role && (
            <>
              <dt className="text-muted">ROLE</dt>
              <dd>{project.role}</dd>
            </>
          )}
          {project.team && (
            <>
              <dt className="text-muted">TEAM</dt>
              <dd>{project.team}</dd>
            </>
          )}
          {project.start && (
            <>
              <dt className="text-muted">PERIOD</dt>
              <dd>{formatPeriod(project.start, project.end)}</dd>
            </>
          )}
          <dt className="text-muted">PLATFORMS</dt>
          <dd>{project.platforms.map((p) => platformLabel[p]).join(', ')}</dd>
          <dt className="text-muted">KIND</dt>
          <dd>{kindLabel[project.kind]}</dd>
          <dt className="text-muted">STATUS</dt>
          <dd>
            <span className="border border-fg px-1.5 py-0.5 whitespace-nowrap">
              {demoStatusLabel[project.demoStatus].toUpperCase()}
            </span>
          </dd>
        </dl>
      </header>

      {(project.highlights.length > 0 || project.metrics.length > 0) && (
        <section
          className="grid gap-8 border-b border-line py-10 lg:grid-cols-12"
          aria-labelledby="highlights"
        >
          <h2 id="highlights" className="font-mono text-xs text-muted lg:col-span-3">
            HIGHLIGHTS
          </h2>
          <div className="space-y-6 lg:col-span-9">
            {project.highlights.length > 0 && (
              <ul className="list-disc space-y-2 pl-5">
                {project.highlights.map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>
            )}
            {project.metrics.length > 0 && (
              <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {project.metrics.map((metric) => (
                  <div key={metric.label} className="border-t border-fg pt-2">
                    <dt className="font-mono text-xs text-muted">{metric.label}</dt>
                    <dd className="text-2xl font-medium">{metric.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </section>
      )}

      {project.body !== null && (
        <article className="grid gap-8 py-10 lg:grid-cols-12">
          <div className="max-w-prose space-y-4 text-[1.05rem] leading-[1.7] lg:col-span-8 lg:col-start-4 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold">
            <RichText value={project.body} />
          </div>
        </article>
      )}

      <section
        className="grid gap-8 border-t border-line py-10 lg:grid-cols-12"
        aria-labelledby="stack"
      >
        <h2 id="stack" className="font-mono text-xs text-muted lg:col-span-3">
          STACK &amp; LINKS
        </h2>
        <div className="space-y-5 lg:col-span-9">
          {project.tech.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {project.tech.map((name) => (
                <li
                  key={name}
                  className="border border-line bg-surface px-2.5 py-1 font-mono text-xs"
                >
                  {name}
                </li>
              ))}
            </ul>
          )}
          {links.length > 0 && (
            <ul className="flex flex-wrap gap-3">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="inline-block border border-fg px-3 py-1.5 font-mono text-xs hover:bg-fg hover:text-bg"
                  >
                    {link.label.toUpperCase()} ↗
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  )
}
