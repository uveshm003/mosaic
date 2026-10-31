import type { Metadata } from 'next'
import Link from 'next/link'
import { BeforeAfter } from '../../../components/product/BeforeAfter'
import { DecisionLog } from '../../../components/product/DecisionLog'
import { JourneyMap } from '../../../components/product/JourneyMap'
import { WorkIndex } from '../../../components/product/WorkIndex'
import { formatMonth, isEnabled, person, profile, productWork } from '../../../lib/content'
import { productHref, strip, toCard } from '../../../lib/product'

export function generateMetadata(): Metadata {
  if (!isEnabled('product')) return {}
  const seo = profile('product')
  return { title: seo.title ? strip(seo.title) : 'Product', description: seo.tagline ?? undefined }
}

function Heading({ n, id, children }: { n: string; id: string; children: string }) {
  return (
    <h2
      id={id}
      className="flex items-baseline gap-4 font-display text-[clamp(1.9rem,4vw,2.8rem)] leading-tight"
    >
      <span className="font-mono text-sm text-accent">{n}</span>
      {children}
    </h2>
  )
}

// The Product profile, written like a memo: what I'd tell a product team, with the
// canvas work underneath.
export default function Product() {
  if (!isEnabled('product')) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-24">
        <h1 className="font-display text-4xl">Product</h1>
        <p className="mt-4 text-muted">This page is being built.</p>
      </main>
    )
  }

  const me = person()
  const name = strip(me.name ?? '')
  const work = productWork()
  const counts = {
    'case-study': work.filter((w) => w.kind === 'case-study').length,
    teardown: work.filter((w) => w.kind === 'teardown').length,
    proposal: work.filter((w) => w.kind === 'proposal').length,
  }
  const withJourney = work.find((w) => w.canvas?.journey.length)
  const withComparison =
    work.find((w) => w.canvas?.comparison && w !== withJourney) ??
    work.find((w) => w.canvas?.comparison)
  const decisions = work
    .flatMap((w) =>
      (w.canvas?.decisions ?? []).map((d) => ({
        ...d,
        from: { title: strip(w.title), href: productHref(w) },
      })),
    )
    // The same question can come up in more than one piece of work; show it once.
    .filter((d, i, all) => all.findIndex((x) => x.question === d.question) === i)
    .slice(0, 4)
  const email = me.contactLinks?.find((l) => l.url.startsWith('mailto:'))
  const latest = work[0]?.date ?? null

  return (
    <main>
      {/* The memo header. */}
      <section className="mx-auto max-w-5xl px-5 pt-14 pb-16 sm:pt-20">
        <dl className="grid max-w-xl grid-cols-[4.5rem_1fr] gap-y-1.5 border-y border-fg py-4 font-mono text-sm">
          <dt className="text-muted">To</dt>
          <dd>Product teams, and engineering teams that care about product</dd>
          <dt className="text-muted">From</dt>
          <dd>{name}</dd>
          <dt className="text-muted">Re</dt>
          <dd>How I decide what to build</dd>
          {latest && (
            <>
              <dt className="text-muted">Updated</dt>
              <dd>{formatMonth(latest)}</dd>
            </>
          )}
        </dl>
        <h1 className="mt-10 max-w-4xl font-display text-[clamp(2.8rem,7vw,5.6rem)] leading-[0.98] tracking-[-0.02em]">
          Product judgement, with the <span className="marker italic">engineering</span> to ship it.
        </h1>
        {profile('product').tagline && (
          <p className="mt-6 max-w-2xl text-xl text-muted">{profile('product').tagline}</p>
        )}
        <ol className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            [
              `${String(counts['case-study'])} case studies`,
              'Products I worked on: the problem, the calls I made, and what changed.',
            ],
            [
              `${String(counts.teardown)} teardowns`,
              'Other companies’ apps, taken apart to see where they lose people.',
            ],
            [
              `${String(counts.proposal)} proposals`,
              'Changes I’d make to existing products, and why.',
            ],
          ].map(([title, text], i) => (
            <li key={title} className="rounded-2xl border border-line bg-surface p-5">
              <p className="font-mono text-xs text-accent">TL;DR {i + 1}</p>
              <p className="mt-2 font-display text-2xl">{title}</p>
              <p className="mt-1 text-sm text-muted">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      {withJourney?.canvas && (
        <section aria-labelledby="journey" className="mx-auto max-w-5xl px-5 py-14">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <Heading n="01" id="journey">
                Start from the journey
              </Heading>
              <p className="mt-2 text-muted">
                From{' '}
                <Link
                  href={productHref(withJourney)}
                  className="underline decoration-accent underline-offset-4"
                >
                  {strip(withJourney.title)}
                </Link>
                . Scrub through it.
              </p>
            </div>
          </div>
          <JourneyMap journey={withJourney.canvas.journey} />
        </section>
      )}

      {decisions.length > 0 && (
        <section aria-labelledby="decisions" className="mx-auto max-w-5xl px-5 py-14">
          <Heading n="02" id="decisions">
            The calls that mattered
          </Heading>
          <p className="mt-2 mb-6 text-muted">What was on the table, what I chose, and why.</p>
          <DecisionLog decisions={decisions} source />
        </section>
      )}

      {withComparison?.canvas?.comparison && (
        <section aria-labelledby="compare" className="mx-auto max-w-5xl px-5 py-14">
          <Heading n="03" id="compare">
            Before and after
          </Heading>
          <p className="mt-2 mb-6 text-muted">
            From{' '}
            <Link
              href={productHref(withComparison)}
              className="underline decoration-accent underline-offset-4"
            >
              {strip(withComparison.title)}
            </Link>
            . Drag to compare.
          </p>
          <BeforeAfter comparison={withComparison.canvas.comparison} />
        </section>
      )}

      <section aria-labelledby="work" className="mx-auto max-w-5xl px-5 py-14">
        <Heading n="04" id="work">
          All the work
        </Heading>
        <p className="mt-2 mb-6 text-muted">Case studies, teardowns and proposals, newest first.</p>
        <WorkIndex cards={work.map(toCard)} />
      </section>

      <section aria-labelledby="signoff" className="mx-auto max-w-5xl px-5 pt-10 pb-20">
        <div className="rounded-2xl border-2 border-dashed border-fg/30 p-8">
          <h2 id="signoff" className="font-display text-3xl">
            Want to talk it through?
          </h2>
          <p className="mt-2 max-w-xl text-muted">
            I’m happy to walk through any of these in more depth, including the parts that didn’t
            work.
          </p>
          {email && (
            <a
              href={email.url}
              className="mt-5 inline-block rounded-full bg-fg px-5 py-2.5 font-semibold text-bg hover:opacity-90"
            >
              {email.url.replace('mailto:', '')}
            </a>
          )}
          <p className="mt-8 font-display text-2xl italic">— {name}</p>
        </div>
      </section>
    </main>
  )
}
