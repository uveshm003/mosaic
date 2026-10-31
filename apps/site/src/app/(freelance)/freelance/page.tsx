import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { FreelanceForm } from '../../../components/freelance/FreelanceForm'
import { ScrollTimeline } from '../../../components/freelance/ScrollTimeline'
import {
  freelanceProfile,
  isEnabled,
  person,
  profile,
  projectsFor,
  serviceGroupLabel,
  serviceGroupOrder,
  services,
  testimonials,
} from '../../../lib/content'

export function generateMetadata(): Metadata {
  if (!isEnabled('freelance')) return {}
  const seo = profile('freelance')
  return {
    title: seo.title ?? 'Freelance',
    description: seo.tagline ?? undefined,
  }
}

/** Dev seed titles carry "Sample:"; display type would repeat it on every card. */
const strip = (text: string) => text.replace(/^Sample: /, '')

const sections = [
  ['services', 'Services'],
  ['process', 'Process'],
  ['work', 'Work'],
  ['faq', 'FAQ'],
] as const

// A dimension line, like on a technical drawing: |—— label ——|
function Dimension({ label }: { label: string }) {
  return (
    <span aria-hidden className="flex items-center gap-2 font-mono text-[11px] text-muted">
      <span className="h-3 w-px bg-current" />
      <span className="h-px flex-1 bg-current" />
      {label}
      <span className="h-px flex-1 bg-current" />
      <span className="h-3 w-px bg-current" />
    </span>
  )
}

function Sheet({
  id,
  n,
  label,
  title,
  intro,
  paper = false,
  children,
}: {
  id: string
  n: number
  label: string
  title: string
  intro?: string
  paper?: boolean
  children: ReactNode
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`scroll-mt-4 ${paper ? 'paper border-y border-line' : ''}`}
    >
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="mb-12 grid gap-4 md:grid-cols-[1.4fr_1fr] md:items-end">
          <div>
            <p className="font-mono text-xs tracking-widest text-muted uppercase">
              Sheet {String(n).padStart(2, '0')} · {label}
            </p>
            <h2
              id={`${id}-title`}
              className="mt-2 max-w-3xl text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.02] font-bold tracking-tight"
            >
              {title}
            </h2>
          </div>
          {intro && <p className="text-lg text-muted md:pb-1">{intro}</p>}
        </div>
        {children}
      </div>
    </section>
  )
}

function Placeholder() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-24">
      <h1 className="text-4xl font-bold">Freelance</h1>
      <p className="mt-4 text-muted">This page is being built.</p>
    </main>
  )
}

// The Freelance profile: for founders and small teams, built to start a conversation.
export default function Freelance() {
  if (!isEnabled('freelance')) return <Placeholder />

  const me = person()
  const name = strip(me.name ?? '')
  const words = freelanceProfile()
  const allServices = services()
  const projects = projectsFor('freelance')
  const quotes = testimonials(projects.map((p) => p.id))
  const email = me.contactLinks?.find((l) => l.url.startsWith('mailto:'))
  const tools = [...new Set(projects.flatMap((p) => p.tech))].sort()
  const platforms = new Set(projects.flatMap((p) => p.platforms))
  const endpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  let sheet = 1
  const next = () => ++sheet
  // Sections hide while their content is empty, and so do their links.
  const present: Record<(typeof sections)[number][0], boolean> = {
    services: allServices.length > 0,
    process: words.engagement.length > 0,
    work: projects.length > 0,
    faq: words.faq.length > 0,
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: `${name}, freelance software engineer`,
    provider: { '@type': 'Person', name },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Services',
      itemListElement: allServices.map((s) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: strip(s.title),
          description: s.summary ?? undefined,
        },
      })),
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="paper">
        <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <span className="font-mono text-sm">
            {name} <span className="text-muted">/ freelance</span>
          </span>
          <nav aria-label="Sections" className="flex items-center gap-5 text-sm">
            <ul className="flex gap-5 max-md:hidden">
              {sections
                .filter(([id]) => present[id])
                .map(([id, label]) => (
                  <li key={id}>
                    <a href={`#${id}`} className="hover:text-accent-2">
                      {label}
                    </a>
                  </li>
                ))}
            </ul>
            <a
              href="#contact"
              className="rounded-xl border-2 border-fg bg-accent px-4 py-2 font-bold text-accent-fg shadow-[3px_3px_0_var(--fg)] transition hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0_var(--fg)]"
            >
              Start a project
            </a>
          </nav>
        </header>

        {/* Sheet 01: the idea. */}
        <section className="mx-auto max-w-6xl px-5 pt-12 pb-24 sm:px-8 sm:pt-20">
          <p className="font-mono text-xs tracking-widest text-muted uppercase">
            Sheet 01 · The idea
          </p>
          <h1 className="mt-4 max-w-4xl text-[clamp(2.8rem,7.5vw,6.2rem)] leading-[0.96] font-bold tracking-[-0.04em]">
            From a sketch on a napkin to an app{' '}
            <span className="relative inline-block">
              <span className="relative z-10 rounded-2xl bg-accent px-3 text-accent-fg">
                people use.
              </span>
              <svg
                aria-hidden
                viewBox="0 0 300 14"
                preserveAspectRatio="none"
                className="absolute -bottom-4 left-2 h-3 w-[95%] text-accent-2"
              >
                <path
                  d="M2 10 C 80 2, 220 2, 298 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>
          <div className="mt-14 grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-end">
            <div>
              <p className="max-w-xl text-xl text-muted">{profile('freelance').tagline}</p>
              {words.audience.length > 0 && (
                <ul aria-label="Who it’s for" className="mt-6 flex flex-wrap gap-2">
                  {words.audience.map((a) => (
                    <li
                      key={a}
                      className="rounded-xl border border-line bg-surface px-3 py-1.5 text-sm"
                    >
                      {a}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#contact"
                  className="rounded-xl border-2 border-fg bg-accent px-6 py-3 font-bold text-accent-fg shadow-[4px_4px_0_var(--fg)] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_var(--fg)]"
                >
                  Start the conversation
                </a>
                {present.process && (
                  <a href="#process" className="rounded-xl border-2 border-fg px-6 py-3 font-bold">
                    See how it works
                  </a>
                )}
              </div>
            </div>
            <dl className="pinned grid grid-cols-2 gap-px overflow-hidden rounded-2xl border-2 border-fg bg-line">
              {[
                ['Services', String(allServices.length)],
                ['Steps to launch', String(words.engagement.length)],
                ['Projects shown', String(projects.length)],
                ['Platforms shipped', String(platforms.size)],
              ]
                .filter(([, v]) => v !== '0')
                .map(([k, v], i, shown) => (
                  // An odd last tile spans the row, so no empty cell is left.
                  <div
                    key={k}
                    className={`bg-surface p-4 ${i === shown.length - 1 && i % 2 === 0 ? 'col-span-2' : ''}`}
                  >
                    <dt className="font-mono text-[11px] text-muted uppercase">{k}</dt>
                    <dd className="mt-1 text-3xl font-bold tabular-nums">{v}</dd>
                  </div>
                ))}
              <div className="col-span-2 bg-surface px-4 pb-4">
                <Dimension label="talk → plan → build → launch" />
              </div>
            </dl>
          </div>
        </section>
      </div>

      {present.services && (
        <Sheet
          id="services"
          n={next()}
          label="Services"
          title="Pick the part you need, or all of it."
          intro="Mobile, web and backend under one roof, so nothing gets lost between teams."
        >
          <div className="space-y-12">
            {serviceGroupOrder.map((group) => {
              const list = allServices.filter((s) => (s.group ?? 'build') === group)
              if (list.length === 0) return null
              return (
                <div key={group}>
                  <h3 className="mb-4 flex items-center gap-3 font-mono text-sm uppercase">
                    <span className="size-2.5 rounded-sm bg-accent-2" />
                    {serviceGroupLabel[group]}
                  </h3>
                  <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {list.map((s) => {
                      const i = allServices.indexOf(s)
                      return (
                        <li
                          key={s.id}
                          className="flex flex-col rounded-2xl border-2 border-fg bg-surface p-5 transition hover:-translate-y-1 hover:shadow-[5px_5px_0_var(--accent)]"
                        >
                          <div className="flex items-center justify-between font-mono text-[11px] text-muted">
                            <span>SVC-{String(i + 1).padStart(2, '0')}</span>
                            <span>{s.typicalTimeline}</span>
                          </div>
                          <h4 className="mt-4 text-xl font-bold">{strip(s.title)}</h4>
                          <p className="mt-2 text-sm text-muted">{s.summary}</p>
                          {(s.deliverables ?? []).length > 0 && (
                            <ul className="mt-auto space-y-1 border-t border-dashed border-line pt-3 font-mono text-xs [&:not(:first-child)]:mt-4">
                              {(s.deliverables ?? []).map((x) => (
                                <li key={x.id ?? x.text}>+ {x.text}</li>
                              ))}
                            </ul>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            })}
          </div>
        </Sheet>
      )}

      {words.principles.length > 0 && (
        <Sheet id="how-i-work" n={next()} label="Principles" title="What working with me is like.">
          <ul className="grid gap-5 md:grid-cols-2">
            {words.principles.map((p, i) => (
              <li
                key={p.title}
                className="flex gap-5 rounded-2xl border border-line bg-surface p-6"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent-2/15 font-mono font-bold text-accent-2">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>
                  <span className="block text-xl font-bold">{p.title}</span>
                  {p.text && <span className="mt-1 block text-muted">{p.text}</span>}
                </span>
              </li>
            ))}
          </ul>
        </Sheet>
      )}

      {words.engagement.length > 0 && (
        <Sheet
          id="process"
          n={next()}
          label="Process"
          title="How a project runs, step by step."
          intro="What you get at each step, and what I’ll ask of you."
          paper
        >
          <ScrollTimeline steps={words.engagement} />
        </Sheet>
      )}

      {projects.length > 0 && (
        <Sheet id="work" n={next()} label="Work" title="Things I’ve built for others.">
          <ul className="grid gap-5 md:grid-cols-3">
            {projects.slice(0, 6).map((p, i) => (
              <li key={p.id}>
                <Link
                  href={`/freelance/${p.slug}`}
                  className="group flex h-full flex-col rounded-2xl border-2 border-fg bg-surface transition hover:-translate-y-1 hover:shadow-[5px_5px_0_var(--accent-2)]"
                >
                  <div
                    aria-hidden
                    className="paper flex h-32 items-end justify-between rounded-t-[0.9rem] border-b-2 border-fg p-4 font-mono text-[11px] text-muted"
                  >
                    <span>FIG. {i + 1}</span>
                    <span>{p.platforms.join(' / ')}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-xl font-bold group-hover:underline">{strip(p.title)}</h3>
                    <p className="mt-2 text-sm text-muted">{p.summary}</p>
                    {p.highlights.length > 0 && (
                      <ul className="mt-3 space-y-1 text-sm">
                        {p.highlights.map((h) => (
                          <li key={h}>— {h}</li>
                        ))}
                      </ul>
                    )}
                    <span className="mt-auto pt-4 font-mono text-xs text-accent-2">
                      Read the case study →
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          {tools.length > 0 && (
            <div className="mt-12 rounded-2xl border border-dashed border-line p-5">
              <p className="font-mono text-xs text-muted uppercase">Tools on these projects</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {tools.map((t) => (
                  <li key={t} className="rounded-lg bg-surface px-3 py-1 font-mono text-xs">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Sheet>
      )}

      {/* Hidden until a real, consented testimonial is published. */}
      {quotes.length > 0 && (
        <Sheet id="kind-words" n={next()} label="Kind words" title="From people I’ve built with.">
          <ul className="grid gap-5 md:grid-cols-3">
            {quotes.map((t) => (
              <li key={t.id} className="rounded-2xl bg-fg p-6 text-bg">
                <blockquote className="text-lg">“{t.quote}”</blockquote>
                <p className="mt-4 font-mono text-xs">
                  — {strip(t.name)}
                  {t.role ? `, ${t.role}` : ''}
                  {t.company ? ` · ${t.company}` : ''}
                </p>
              </li>
            ))}
          </ul>
        </Sheet>
      )}

      {words.faq.length > 0 && (
        <Sheet id="faq" n={next()} label="Questions" title="Things people usually ask first.">
          <div className="grid gap-3 md:grid-cols-2">
            {words.faq.map((q) => (
              <details
                key={q.question}
                className="group rounded-2xl border-2 border-fg bg-surface p-5 open:shadow-[5px_5px_0_var(--accent)]"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-lg font-bold">
                  {q.question}
                  <span
                    aria-hidden
                    className="font-mono text-accent-2 transition group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-muted">{q.answer}</p>
              </details>
            ))}
          </div>
        </Sheet>
      )}

      <section
        id="contact"
        aria-labelledby="contact-title"
        className="paper scroll-mt-4 border-t border-line"
      >
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-24 sm:px-8 md:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="font-mono text-xs tracking-widest text-muted uppercase">
              Sheet {String(next()).padStart(2, '0')} · Brief
            </p>
            <h2
              id="contact-title"
              className="mt-2 text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.02] font-bold tracking-tight"
            >
              Send me the napkin sketch.
            </h2>
            <p className="mt-4 text-lg text-muted">
              A few lines is enough: what you’re building, who it’s for, and roughly when.
            </p>
            {words.engagement.length > 0 && (
              <ol className="mt-8 space-y-3">
                <li className="font-mono text-xs text-muted uppercase">What happens next</li>
                {words.engagement.slice(0, 2).map((s, i) => (
                  <li key={s.title} className="flex gap-3">
                    <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-accent font-mono text-sm font-bold text-accent-fg">
                      {i + 1}
                    </span>
                    <span>
                      <span className="font-bold">{s.title}.</span>{' '}
                      <span className="text-muted">{s.summary}</span>
                    </span>
                  </li>
                ))}
              </ol>
            )}
            {email && (
              <p className="mt-8 text-sm">
                Rather email?{' '}
                <a
                  href={email.url}
                  className="font-bold underline decoration-accent-2 underline-offset-4"
                >
                  {email.url.replace('mailto:', '')}
                </a>
              </p>
            )}
          </div>
          <div className="pinned rounded-2xl border-2 border-fg bg-surface p-6">
            {endpoint && siteKey ? (
              <FreelanceForm
                endpoint={endpoint}
                siteKey={siteKey}
                rounded="rounded-xl"
                projectTypes={allServices.map((s) => strip(s.title))}
              />
            ) : (
              <p className="text-muted">The contact form is set up at deploy time.</p>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
