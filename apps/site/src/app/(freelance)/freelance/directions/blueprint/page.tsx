import type { Metadata } from 'next'
import { DM_Mono, DM_Sans } from 'next/font/google'
import { FreelanceForm } from '../../../../../components/freelance/FreelanceForm'
import { ScrollTimeline } from '../../../../../components/freelance/ScrollTimeline'
import { freelanceData } from '../data'
import '../directions.css'

const sans = DM_Sans({ subsets: ['latin'], variable: '--font-body-family' })
const mono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono-family' })

export const metadata: Metadata = { title: 'Freelance direction B: Blueprint' }

const strip = (t: string) => t.replace(/^Sample: /, '')

// A dimension line, like on a drawing: |———— label ————|
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

function Heading({ id, label, title }: { id: string; label: string; title: string }) {
  return (
    <div className="mb-12">
      <p className="font-mono text-xs tracking-widest text-muted uppercase">{label}</p>
      <h2
        id={`${id}-title`}
        className="mt-2 max-w-3xl text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.02] font-bold tracking-tight"
      >
        {title}
      </h2>
    </div>
  )
}

// Direction B: a friendly blueprint. Drafting-paper grid, spec sheets and dimension lines.
export default function Blueprint() {
  const d = freelanceData()
  return (
    <div
      className={`fl-blueprint ${sans.variable} ${mono.variable} min-h-svh bg-bg font-body text-fg`}
    >
      <div className="paper">
        <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <span className="font-mono text-sm">
            {strip(d.name)} <span className="text-muted">/ freelance</span>
          </span>
          <a
            href="#contact"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-bold text-accent-fg shadow-[3px_3px_0_var(--fg)]"
          >
            Start a project
          </a>
        </header>

        <section className="mx-auto max-w-6xl px-5 pt-14 pb-24 sm:px-8">
          <p className="font-mono text-xs tracking-widest text-muted uppercase">
            Sheet 01 · The idea
          </p>
          <h1 className="mt-4 max-w-4xl text-[clamp(2.8rem,7.5vw,6.2rem)] leading-[0.96] font-bold tracking-[-0.04em]">
            From a sketch on a napkin to an app{' '}
            <span className="rounded-xl bg-accent px-3 text-accent-fg">people use.</span>
          </h1>
          <div className="mt-10 grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-end">
            <p className="max-w-xl text-xl text-muted">{d.tagline}</p>
            <div className="rounded-xl border-2 border-fg bg-surface p-5 shadow-[6px_6px_0_var(--fg)]">
              <p className="font-mono text-xs text-muted">Typical first build</p>
              <p className="mt-1 text-3xl font-bold">4–12 weeks</p>
              <div className="mt-3">
                <Dimension label="talk → launch" />
              </div>
            </div>
          </div>
        </section>
      </div>

      <section
        id="services"
        aria-labelledby="services-title"
        className="mx-auto max-w-6xl px-5 py-20 sm:px-8"
      >
        <Heading
          id="services"
          label="Sheet 02 · Services"
          title="Pick the part you need, or all of it."
        />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {d.services.map((s, i) => (
            <li
              key={s.id}
              className="flex flex-col rounded-xl border-2 border-fg bg-surface p-5 transition hover:-translate-y-1 hover:shadow-[5px_5px_0_var(--accent)]"
            >
              <div className="flex items-center justify-between font-mono text-[11px] text-muted">
                <span>SVC-{String(i + 1).padStart(2, '0')}</span>
                <span>{s.typicalTimeline}</span>
              </div>
              <h3 className="mt-4 text-xl font-bold">{strip(s.title)}</h3>
              <p className="mt-2 text-sm text-muted">{s.summary}</p>
              <ul className="mt-4 space-y-1 border-t border-dashed border-line pt-3 font-mono text-xs">
                {(s.deliverables ?? []).map((x) => (
                  <li key={x.id ?? x.text}>+ {x.text}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <section id="process" aria-labelledby="process-title" className="paper border-y border-line">
        <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
          <Heading
            id="process"
            label="Sheet 03 · Process"
            title="How a project runs, week by week."
          />
          <ScrollTimeline steps={d.steps} />
        </div>
      </section>

      <section
        id="work"
        aria-labelledby="work-title"
        className="mx-auto max-w-6xl px-5 py-20 sm:px-8"
      >
        <Heading id="work" label="Sheet 04 · Work" title="Things I’ve built for others." />
        <ul className="grid gap-5 md:grid-cols-3">
          {d.projects.slice(0, 3).map((p, i) => (
            <li key={p.id} className="rounded-xl border-2 border-fg bg-surface">
              <div
                aria-hidden
                className="paper flex h-36 items-end border-b-2 border-fg p-4 font-mono text-[11px] text-muted"
              >
                FIG. {i + 1} · {p.platforms.join(' / ')}
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold">{strip(p.title)}</h3>
                <p className="mt-2 text-sm text-muted">{p.summary}</p>
                <ul className="mt-3 space-y-1 text-sm">
                  {p.highlights.map((h) => (
                    <li key={h}>— {h}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {d.testimonials.length > 0 && (
        <section aria-label="Kind words" className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
          <ul className="grid gap-5 md:grid-cols-3">
            {d.testimonials.map((t) => (
              <li key={t.id} className="rounded-xl bg-fg p-6 text-bg">
                <blockquote>“{t.quote}”</blockquote>
                <p className="mt-4 font-mono text-xs">— {t.name}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section id="contact" aria-labelledby="contact-title" className="paper border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-24 sm:px-8 md:grid-cols-[1fr_1.4fr]">
          <Heading id="contact" label="Sheet 05 · Brief" title="Send me the napkin sketch." />
          <div className="rounded-xl border-2 border-fg bg-surface p-6 shadow-[6px_6px_0_var(--fg)]">
            {d.endpoint && d.siteKey ? (
              <FreelanceForm
                endpoint={d.endpoint}
                siteKey={d.siteKey}
                rounded="rounded-lg"
                projectTypes={d.services.map((s) => strip(s.title))}
              />
            ) : (
              <p className="text-muted">The contact form is set up at deploy time.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
