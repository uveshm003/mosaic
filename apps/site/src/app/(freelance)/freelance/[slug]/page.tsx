import { RichText } from '@mosaic/ui'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
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
  if (!isEnabled('freelance')) return [{ slug: '_' }]
  const slugs = projectsFor('freelance').map(({ slug }) => ({ slug }))
  return slugs.length > 0 ? slugs : [{ slug: '_' }]
}

export const dynamicParams = false

const strip = (text: string) => text.replace(/^Sample: /, '')

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = isEnabled('freelance') ? projectFor('freelance', (await params).slug) : null
  if (!project) return {}
  return { title: `${strip(project.title)} · Freelance`, description: project.summary ?? undefined }
}

// A freelance case study: the same project as elsewhere, in its freelance wording.
export default async function FreelanceCaseStudy({ params }: Props) {
  if (!isEnabled('freelance')) notFound()
  const { slug } = await params
  const project = projectFor('freelance', slug)
  if (!project) notFound()

  const all = projectsFor('freelance')
  const following = all[(all.findIndex((p) => p.slug === slug) + 1) % all.length]
  const links = [
    { label: 'Live', href: project.live },
    { label: 'Repository', href: project.repo },
    { label: 'Video', href: project.video },
  ].filter((link): link is { label: string; href: string } => Boolean(link.href))
  const facts = [
    ['Role', project.role],
    ['Team', project.team],
    ['Period', formatPeriod(project.start, project.end)],
    ['Platforms', project.platforms.map((p) => platformLabel[p] ?? p).join(', ')],
    ['Status', demoStatusLabel[project.demoStatus]],
  ].filter((row): row is [string, string] => Boolean(row[1]))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.summary ?? undefined,
    url: `${SITE_URL}/freelance/${project.slug}`,
    keywords: project.tech.join(', ') || undefined,
  }

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="paper border-b border-line">
        <div className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
          <nav className="flex justify-between pt-6 font-mono text-xs text-muted">
            <Link href="/freelance#work" className="hover:text-fg">
              ← All work
            </Link>
            <span>Case study</span>
          </nav>
          <div className="mt-12 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-end">
            <div>
              <h1 className="text-[clamp(2.4rem,6vw,5rem)] leading-[0.98] font-bold tracking-[-0.035em]">
                {strip(project.title)}
              </h1>
              {project.summary && (
                <p className="mt-5 max-w-2xl text-xl text-muted">{project.summary}</p>
              )}
            </div>
            <dl className="pinned grid grid-cols-[6rem_1fr] gap-x-4 gap-y-2 rounded-2xl border-2 border-fg bg-surface p-5 text-sm">
              {facts.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="font-mono text-[11px] text-muted uppercase">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {(project.highlights.length > 0 || project.metrics.length > 0) && (
          <section
            aria-labelledby="outcomes"
            className="grid gap-8 border-b border-line py-14 lg:grid-cols-[14rem_1fr]"
          >
            <h2 id="outcomes" className="font-mono text-xs text-muted uppercase">
              What changed
            </h2>
            <div className="space-y-8">
              {project.highlights.length > 0 && (
                <ul className="grid gap-3 sm:grid-cols-2">
                  {project.highlights.map((text) => (
                    <li key={text} className="rounded-2xl border border-line bg-surface p-4">
                      <span aria-hidden className="mr-2 text-accent-2">
                        →
                      </span>
                      {text}
                    </li>
                  ))}
                </ul>
              )}
              {project.metrics.length > 0 && (
                <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {project.metrics.map((m) => (
                    <div key={m.label} className="rounded-2xl border-2 border-fg bg-surface p-4">
                      <dt className="font-mono text-[11px] text-muted uppercase">{m.label}</dt>
                      <dd className="mt-1 text-3xl font-bold">{m.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </section>
        )}

        {project.body !== null && (
          <article className="grid gap-8 py-14 lg:grid-cols-[14rem_1fr]">
            <h2 className="font-mono text-xs text-muted uppercase">The story</h2>
            <div className="max-w-prose space-y-4 text-[1.08rem] leading-[1.75] [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-bold">
              <RichText value={project.body} />
            </div>
          </article>
        )}

        {(project.tech.length > 0 || links.length > 0) && (
          <section
            aria-labelledby="stack"
            className="grid gap-8 border-t border-line py-14 lg:grid-cols-[14rem_1fr]"
          >
            <h2 id="stack" className="font-mono text-xs text-muted uppercase">
              Built with
            </h2>
            <div className="space-y-5">
              <ul className="flex flex-wrap gap-2">
                {project.tech.map((name) => (
                  <li key={name} className="rounded-lg bg-surface px-3 py-1 font-mono text-xs">
                    {name}
                  </li>
                ))}
              </ul>
              {links.length > 0 && (
                <ul className="flex flex-wrap gap-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="inline-block rounded-xl border-2 border-fg px-3 py-1.5 font-mono text-xs hover:bg-fg hover:text-bg"
                      >
                        {link.label} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}
      </div>

      <section className="paper border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-20 sm:px-8 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-[clamp(2rem,4vw,3rem)] leading-tight font-bold tracking-tight">
              Need something like this?
            </h2>
            <Link
              href="/freelance#contact"
              className="mt-6 inline-block rounded-xl border-2 border-fg bg-accent px-6 py-3 font-bold text-accent-fg shadow-[4px_4px_0_var(--fg)]"
            >
              Start the conversation
            </Link>
          </div>
          {following && following.slug !== project.slug && (
            <Link
              href={`/freelance/${following.slug}`}
              className="group rounded-2xl border-2 border-fg bg-surface p-6 transition hover:shadow-[5px_5px_0_var(--accent-2)]"
            >
              <span className="font-mono text-xs text-muted uppercase">Next case study →</span>
              <span className="mt-2 block text-2xl font-bold group-hover:underline">
                {strip(following.title)}
              </span>
            </Link>
          )}
        </div>
      </section>
    </main>
  )
}
