import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { CursorGlow } from '../../components/CursorGlow'
import { HubTerminal } from '../../components/HubTerminal'
import { RichText } from '@mosaic/ui'
import {
  brandHref,
  brandIsLive,
  enabledProfiles,
  isEnabled,
  person,
  profile,
  profileHref,
} from '../../lib/content'
import { SITE_URL } from '../../lib/site'

export function generateMetadata(): Metadata {
  if (!isEnabled('root')) return {}
  const seo = profile('root')
  return { title: seo.title ?? person().name ?? undefined, description: seo.tagline ?? undefined }
}

function Placeholder() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-24">
      <h1 className="font-display text-4xl">Uvesh Menpurwala</h1>
      <p className="mt-4 text-muted">This site is being built.</p>
    </main>
  )
}

// What each portfolio holds comes from the spec, not from content.
const portfolioMeta = [
  { key: 'flutter', label: 'Flutter', contents: 'Case studies, demo lab, writing' },
  { key: 'product', label: 'Product', contents: 'Case studies, teardowns, proposals' },
  { key: 'freelance', label: 'Freelance', contents: 'Services, selected work, contact' },
  { key: 'fullstack', label: 'Full-stack', contents: 'Systems, architecture, demo admin' },
  { key: 'brand', label: 'Brand', contents: 'Essays, breakdowns, concepts' },
] as const

function Anchor({ href, ...rest }: { href: string; className: string; children: ReactNode }) {
  return href.startsWith(brandHref) ? <a href={href} {...rest} /> : <Link href={href} {...rest} />
}

function SectionTitle({ id, index, children }: { id: string; index: number; children: string }) {
  return (
    <h2
      id={`${id}-title`}
      className="mb-8 flex items-center gap-4 font-display text-2xl font-semibold sm:text-3xl"
    >
      <span className="font-mono text-sm font-normal text-accent">
        {String(index).padStart(2, '0')}.
      </span>
      {children}
      <span aria-hidden className="h-px flex-1 bg-line" />
    </h2>
  )
}

function paragraphs(value: unknown): string[] {
  const root = (value as { root?: { children?: { children?: { text?: string }[] }[] } } | null)
    ?.root
  return (root?.children ?? [])
    .map((node) => (node.children ?? []).map((c) => c.text ?? '').join(''))
    .filter(Boolean)
}

function displayLink(url: string): string {
  if (url.startsWith('mailto:')) return url.slice('mailto:'.length)
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
}

export default function Home() {
  if (!isEnabled('root')) return <Placeholder />

  const me = person()
  const name = (me.name ?? '').trim()
  const headline = me.headlines?.[0]?.text ?? ''
  const availability = me.headlines?.[1]?.text
  const location = me.location ?? ''
  const links = me.contactLinks ?? []
  const email = links.find((l) => l.url.startsWith('mailto:'))
  const live = new Set(enabledProfiles().map(({ key }) => key))

  const portfolios = portfolioMeta.map(({ key, label, contents }) => ({
    key,
    label,
    contents,
    description:
      key === 'brand'
        ? 'Marketing, growth, branding and advertising'
        : (profile(key).tagline ?? contents),
    href:
      key === 'brand'
        ? brandIsLive()
          ? brandHref
          : null
        : live.has(key)
          ? profileHref[key]
          : null,
  }))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle: headline,
    homeLocation: location ? { '@type': 'Place', name: location } : undefined,
    url: SITE_URL,
    sameAs: links.filter((l) => l.url.startsWith('http')).map((l) => l.url),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div aria-hidden className="glow pointer-events-none fixed inset-0" />
      <CursorGlow />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        <header className="grid min-h-svh items-center gap-12 py-16 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div>
            <h1
              className="rise font-display text-[clamp(2.8rem,6vw,4.8rem)] leading-[0.95] font-bold tracking-[-0.035em]"
              aria-label={name}
            >
              {name.split(' ').map((word, w, words) => {
                const offset = words.slice(0, w).join(' ').length + (w > 0 ? 1 : 0)
                return (
                  <span key={w} aria-hidden className="inline-block whitespace-nowrap">
                    {Array.from(word).map((char, i) => (
                      <span key={i} style={{ ['--i' as string]: offset + i }}>
                        {char}
                      </span>
                    ))}
                    {w < words.length - 1 ? ' ' : ''}
                  </span>
                )
              })}
            </h1>
            <p className="mt-4 font-display text-xl text-fg/90">{headline}</p>
            <p className="mt-3 max-w-md text-muted">{profile('root').tagline}</p>
            {availability && (
              <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 font-mono text-xs">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:animate-none" />
                  <span className="relative inline-flex size-2 rounded-full bg-accent" />
                </span>
                {availability}
              </p>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#portfolios"
                className="rounded-full bg-accent px-6 py-3 font-medium text-accent-fg transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                See the portfolios
              </a>
              <a
                href="#about"
                className="rounded-full border border-line px-6 py-3 transition hover:border-accent focus-visible:outline-2 focus-visible:outline-accent"
              >
                About me
              </a>
            </div>
          </div>
          <HubTerminal
            data={{
              name,
              headline,
              location,
              about: paragraphs(me.about),
              portfolios: portfolios.map(({ key, label, description, href }) => ({
                key,
                label,
                description,
                href,
              })),
              links: links.map(({ label, url }) => ({ label, url })),
            }}
          />
        </header>

        <main className="space-y-28 pb-24">
          <section
            id="portfolios"
            aria-labelledby="portfolios-title"
            className="reveal scroll-mt-20"
          >
            <SectionTitle id="portfolios" index={1}>
              Portfolios
            </SectionTitle>
            <ul className="grid auto-rows-[minmax(11rem,auto)] gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {portfolios.map((p, i) => {
                const big = i === 0
                const inner = (
                  <>
                    <span className="flex items-center justify-between gap-3 font-mono text-[11px] text-muted">
                      <span>{p.key}/</span>
                      <span
                        className={`rounded-full border px-2 py-0.5 ${p.href ? 'border-accent/50 text-accent' : 'border-line'}`}
                      >
                        {p.href ? 'Open' : 'Coming later'}
                      </span>
                    </span>
                    <span className="mt-auto block">
                      <span
                        className={`block font-display font-semibold tracking-tight ${big ? 'text-5xl sm:text-6xl' : 'text-3xl'}`}
                      >
                        {p.label}
                        {p.href && (
                          <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                            →
                          </span>
                        )}
                      </span>
                      <span className="mt-2 block max-w-md text-sm text-muted">
                        {p.description}
                      </span>
                      <span className="mt-3 block font-mono text-[11px] text-fg/60">
                        {p.contents}
                      </span>
                    </span>
                  </>
                )
                const cls = `card group relative flex h-full flex-col gap-4 overflow-hidden p-6 transition ${big ? 'sm:p-8' : ''}`
                return (
                  <li key={p.key} className={big ? 'sm:col-span-2 lg:row-span-2' : ''}>
                    {p.href ? (
                      // The brand is its own app, so it gets a plain link, not client routing.
                      <Anchor
                        href={p.href}
                        className={`${cls} hover:-translate-y-1 hover:border-accent/60 focus-visible:outline-2 focus-visible:outline-accent`}
                      >
                        {big && (
                          <span
                            aria-hidden
                            className="absolute -right-16 -bottom-24 size-72 rounded-full bg-[radial-gradient(circle,var(--accent),var(--accent-2)_45%,transparent_70%)] opacity-40 blur-2xl transition-transform duration-700 group-hover:scale-110"
                          />
                        )}
                        {inner}
                      </Anchor>
                    ) : (
                      <div className={`${cls} opacity-70`}>{inner}</div>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>

          <section id="about" aria-labelledby="about-title" className="reveal scroll-mt-20">
            <SectionTitle id="about" index={2}>
              About
            </SectionTitle>
            <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
              <div className="space-y-4 text-[1.05rem] leading-relaxed text-fg/80">
                <RichText value={me.about} />
              </div>
              <dl className="grid content-start gap-3">
                {[
                  ['Based in', location],
                  ['Availability', availability],
                  ['Email', email ? displayLink(email.url) : undefined],
                ]
                  .filter((row): row is [string, string] => Boolean(row[1]))
                  .map(([label, value]) => (
                    <div key={label} className="card wiggle px-5 py-4">
                      <dt className="font-mono text-xs text-accent">{label.toLowerCase()}</dt>
                      <dd className="mt-1 font-medium">{value}</dd>
                    </div>
                  ))}
              </dl>
            </div>
          </section>

          <section id="contact" aria-labelledby="contact-title" className="reveal scroll-mt-20">
            <SectionTitle id="contact" index={3}>
              Contact
            </SectionTitle>
            <p className="mb-8 max-w-xl text-lg text-fg/85">
              Have a project, a role or a question? Pick a portfolio above, or reach me directly.
            </p>
            <ul className="flex flex-wrap gap-3">
              {links.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    className="card wiggle inline-flex items-center gap-2 px-5 py-3 transition hover:border-accent focus-visible:outline-2 focus-visible:outline-accent"
                  >
                    {link.label}
                    <span className="font-mono text-xs text-muted">{displayLink(link.url)}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </main>

        <footer className="flex flex-wrap justify-between gap-4 border-t border-line py-8 font-mono text-xs text-muted">
          <span>{name}</span>
          <span>{location}</span>
        </footer>
      </div>
    </>
  )
}
