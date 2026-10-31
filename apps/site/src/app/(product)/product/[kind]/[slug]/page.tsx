import { RichText } from '@mosaic/ui'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BeforeAfter } from '../../../../../components/product/BeforeAfter'
import { DecisionLog } from '../../../../../components/product/DecisionLog'
import { JourneyMap } from '../../../../../components/product/JourneyMap'
import {
  demoStatusLabel,
  formatMonth,
  isEnabled,
  person,
  productKindLabel,
  productKindSlug,
  productLabel,
  productWork,
  type ProductItem,
} from '../../../../../lib/content'
import { productHref, strip } from '../../../../../lib/product'
import { SITE_URL } from '../../../../../lib/site'

interface Props {
  params: Promise<{ kind: string; slug: string }>
}

// A static export needs at least one path; the placeholder renders as not found.
export function generateStaticParams() {
  if (!isEnabled('product')) return [{ kind: '_', slug: '_' }]
  const paths = productWork().map((w) => ({ kind: productKindSlug[w.kind], slug: w.slug }))
  return paths.length > 0 ? paths : [{ kind: '_', slug: '_' }]
}

export const dynamicParams = false

function find(kind: string, slug: string): ProductItem | null {
  if (!isEnabled('product')) return null
  return productWork().find((w) => productKindSlug[w.kind] === kind && w.slug === slug) ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kind, slug } = await params
  const item = find(kind, slug)
  if (!item) return {}
  return {
    title: `${strip(item.title)} · ${productKindLabel[item.kind]}`,
    description: item.summary ?? productLabel(item) ?? undefined,
  }
}

// One piece of product work as a memo: header, the canvas (journey, decisions,
// before/after), then the full write-up.
export default async function ProductPage({ params }: Props) {
  const { kind, slug } = await params
  const item = find(kind, slug)
  if (!item) notFound()

  const all = productWork()
  const next =
    all[
      (all.findIndex((w) => w === item || (w.kind === item.kind && w.slug === item.slug)) + 1) %
        all.length
    ]
  const label = productLabel(item)
  const project = item.project
  const c = item.canvas
  const name = strip(person().name ?? '')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': item.kind === 'case-study' ? 'CreativeWork' : 'Article',
    name: item.title,
    headline: item.title,
    author: { '@type': 'Person', name },
    datePublished: item.date ?? undefined,
    url: `${SITE_URL}${productHref(item)}`,
  }

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article>
        <header className="mx-auto max-w-5xl px-5 pt-10 pb-12">
          <Link href="/product#work" className="font-mono text-xs text-muted hover:text-fg">
            ← All work
          </Link>
          <dl className="mt-8 grid max-w-xl grid-cols-[4.5rem_1fr] gap-y-1.5 border-y border-fg py-4 font-mono text-sm">
            <dt className="text-muted">Type</dt>
            <dd>{productKindLabel[item.kind]}</dd>
            <dt className="text-muted">From</dt>
            <dd>{name}</dd>
            {item.subject && (
              <>
                <dt className="text-muted">About</dt>
                <dd>{item.subject}</dd>
              </>
            )}
            {item.date && (
              <>
                <dt className="text-muted">Date</dt>
                <dd>{formatMonth(item.date)}</dd>
              </>
            )}
          </dl>
          <h1 className="mt-8 max-w-4xl font-display text-[clamp(2.4rem,6vw,4.6rem)] leading-[1] tracking-[-0.02em]">
            {strip(item.title)}
          </h1>
          {item.summary && <p className="mt-5 max-w-2xl text-xl text-muted">{item.summary}</p>}
          {label && (
            <p className="mt-6 inline-block rounded border border-fg px-2.5 py-1 text-sm font-medium">
              {label}
            </p>
          )}
          {project && (
            <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-sm">
              {[
                ['Role', project.role],
                ['Team', project.team],
                ['Period', `${formatMonth(project.start)} – ${formatMonth(project.end)}`],
                ['Status', demoStatusLabel[project.demoStatus]],
              ]
                .filter((row): row is [string, string] => Boolean(row[1]))
                .map(([k, v]) => (
                  <div key={k}>
                    <dt className="font-mono text-[11px] text-muted uppercase">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
            </dl>
          )}
        </header>

        {project && project.highlights.length > 0 && (
          <section aria-labelledby="tldr" className="mx-auto max-w-5xl px-5 pb-10">
            <h2 id="tldr" className="font-mono text-xs text-accent uppercase">
              TL;DR
            </h2>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {project.highlights.map((h) => (
                <li key={h} className="rounded-xl bg-accent-2/40 p-4 text-lg">
                  {h}
                </li>
              ))}
            </ul>
          </section>
        )}

        {c && c.journey.length > 0 && (
          <section aria-labelledby="journey" className="mx-auto max-w-5xl px-5 py-10">
            <h2 id="journey" className="mb-5 font-display text-3xl">
              The journey
            </h2>
            <JourneyMap journey={c.journey} />
          </section>
        )}

        {c && c.decisions.length > 0 && (
          <section aria-labelledby="decisions" className="mx-auto max-w-5xl px-5 py-10">
            <h2 id="decisions" className="mb-5 font-display text-3xl">
              {item.kind === 'case-study' ? 'Decisions' : 'What I’d decide'}
            </h2>
            <DecisionLog decisions={c.decisions} />
          </section>
        )}

        {c?.comparison && (
          <section aria-labelledby="compare" className="mx-auto max-w-5xl px-5 py-10">
            <h2 id="compare" className="mb-5 font-display text-3xl">
              Before and after
            </h2>
            <BeforeAfter comparison={c.comparison} />
          </section>
        )}

        {item.body !== null && (
          <section aria-labelledby="writeup" className="mx-auto max-w-5xl px-5 py-10">
            <h2 id="writeup" className="mb-5 font-display text-3xl">
              The write-up
            </h2>
            <div className="max-w-[44rem] space-y-4 text-[1.12rem] leading-[1.75] [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h3]:mt-6 [&_h3]:font-semibold">
              <RichText value={item.body} />
            </div>
          </section>
        )}

        {project && project.tech.length > 0 && (
          <section aria-labelledby="stack" className="mx-auto max-w-5xl px-5 py-6">
            <h2 id="stack" className="font-mono text-xs text-muted uppercase">
              Built with
            </h2>
            <ul className="mt-2 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <li key={t} className="rounded-full border border-line px-3 py-1 text-sm">
                  {t}
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>

      {next && next !== item && (
        <nav aria-label="Next" className="mx-auto max-w-5xl px-5 pt-10 pb-16">
          <Link
            href={productHref(next)}
            className="group block rounded-2xl border border-line bg-surface p-6 hover:border-fg"
          >
            <span className="font-mono text-xs text-muted uppercase">
              Next · {productKindLabel[next.kind]}
            </span>
            <span className="mt-2 block font-display text-3xl group-hover:underline group-hover:decoration-accent">
              {strip(next.title)}
            </span>
          </Link>
        </nav>
      )}
    </main>
  )
}
