import type { Metadata } from 'next'
import { Figtree, IBM_Plex_Mono } from 'next/font/google'
import { FreelanceForm } from '../../../../../components/freelance/FreelanceForm'
import { StepTimeline } from '../../../../../components/freelance/StepTimeline'
import { freelanceData } from '../data'
import '../directions.css'

const sans = Figtree({ subsets: ['latin'], variable: '--font-body-family' })
const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono-family',
})

export const metadata: Metadata = { title: 'Freelance direction A: Warm grid' }

const strip = (t: string) => t.replace(/^Sample: /, '')

function Section({
  n,
  id,
  title,
  children,
}: {
  n: number
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="mx-auto max-w-7xl scroll-mt-6 px-5 py-20 sm:px-8"
    >
      <div className="mb-10 grid gap-2 border-t border-fg/20 pt-4 md:grid-cols-12">
        <span className="font-mono text-sm text-accent md:col-span-2">
          {String(n).padStart(2, '0')}
        </span>
        <h2
          id={`${id}-title`}
          className="text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] font-semibold tracking-tight md:col-span-10"
        >
          {title}
        </h2>
      </div>
      {children}
    </section>
  )
}

// Direction A: warm colour and rounded shapes on a visible twelve-column grid.
export default function Warm() {
  const d = freelanceData()
  return (
    <div className={`fl-warm ${sans.variable} ${mono.variable} min-h-svh bg-bg font-body text-fg`}>
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <span className="font-semibold">{strip(d.name)}</span>
        <nav aria-label="Sections" className="flex gap-5 text-sm max-sm:hidden">
          <a href="#services">Services</a>
          <a href="#process">Process</a>
          <a href="#work">Work</a>
          <a href="#contact" className="rounded-full bg-fg px-4 py-1.5 text-bg">
            Start a project
          </a>
        </nav>
      </header>

      <section className="relative">
        <div
          aria-hidden
          className="grid-lines pointer-events-none absolute inset-0 mx-auto max-w-7xl"
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 pt-16 pb-24 sm:px-8 md:grid-cols-12">
          <div className="md:col-span-8">
            <p className="inline-flex items-center gap-2 rounded-full bg-accent-2/15 px-3 py-1 text-sm font-medium text-accent-2">
              <span className="size-2 rounded-full bg-accent-2" />
              Taking on new projects
            </p>
            <h1 className="mt-6 text-[clamp(2.8rem,7vw,6rem)] leading-[0.98] font-semibold tracking-[-0.035em]">
              Your idea, built properly, by one person who{' '}
              <span className="relative whitespace-nowrap text-accent">
                owns all of it.
                <svg
                  aria-hidden
                  viewBox="0 0 300 12"
                  className="absolute -bottom-2 left-0 w-full"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 9 C 80 2, 220 2, 298 7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
            <p className="mt-8 max-w-xl text-xl text-muted">{d.tagline}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="#contact"
                className="rounded-full bg-accent px-6 py-3 font-semibold text-accent-fg"
              >
                Start the conversation
              </a>
              <a
                href="#process"
                className="rounded-full border border-fg/25 px-6 py-3 font-semibold"
              >
                See how it works
              </a>
            </div>
          </div>
          <dl className="grid grid-cols-2 content-end gap-3 md:col-span-4">
            {[
              ['Services', String(d.services.length)],
              ['Steps', String(d.steps.length)],
              ['Mobile · Web · Backend', 'All three'],
              ['Contracts', 'Fixed scope or monthly'],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl border border-line bg-surface p-4">
                <dt className="font-mono text-xs text-muted">{k}</dt>
                <dd className="mt-1 text-lg font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Section n={1} id="services" title="What I can build for you">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {d.services.map((s, i) => (
            <li
              key={s.id}
              className="flex flex-col rounded-3xl border border-line bg-surface p-6 transition hover:-translate-y-1 hover:shadow-[0_12px_30px_-12px_rgb(0_0_0/0.25)]"
            >
              <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-3 text-xl font-semibold">{strip(s.title)}</h3>
              <p className="mt-2 text-muted">{s.summary}</p>
              <ul className="mt-4 space-y-1.5 text-sm">
                {(s.deliverables ?? []).map((x) => (
                  <li key={x.id ?? x.text} className="flex gap-2">
                    <span aria-hidden className="text-accent">
                      ✓
                    </span>
                    {x.text}
                  </li>
                ))}
              </ul>
              <p className="mt-auto pt-5 font-mono text-xs text-accent-2">{s.typicalTimeline}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section n={2} id="process" title="How working together goes">
        <StepTimeline steps={d.steps} />
      </Section>

      <Section n={3} id="work" title="Selected work">
        <ul className="grid gap-4 md:grid-cols-3">
          {d.projects.slice(0, 3).map((p) => (
            <li key={p.id} className="rounded-3xl border border-line bg-surface p-6">
              <p className="font-mono text-xs text-muted">{p.platforms.join(' · ')}</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight">{strip(p.title)}</h3>
              <p className="mt-2 text-muted">{p.summary}</p>
              <ul className="mt-4 space-y-1.5 text-sm">
                {p.highlights.map((h) => (
                  <li key={h} className="flex gap-2">
                    <span aria-hidden className="text-accent-2">
                      →
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Section>

      {d.testimonials.length > 0 && (
        <Section n={4} id="kind-words" title="Kind words">
          <ul className="grid gap-4 md:grid-cols-3">
            {d.testimonials.map((t) => (
              <li key={t.id} className="rounded-3xl bg-accent/10 p-6">
                <blockquote className="text-lg">“{t.quote}”</blockquote>
                <p className="mt-4 text-sm font-semibold">{t.name}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section
        n={d.testimonials.length > 0 ? 5 : 4}
        id="contact"
        title="Tell me what you’re building"
      >
        <div className="grid gap-10 md:grid-cols-12">
          <p className="text-lg text-muted md:col-span-4">
            A few lines is enough. I’ll reply with questions or a short plan, and we’ll take it from
            there.
          </p>
          <div className="md:col-span-8">
            {d.endpoint && d.siteKey ? (
              <FreelanceForm
                endpoint={d.endpoint}
                siteKey={d.siteKey}
                projectTypes={d.services.map((s) => strip(s.title))}
              />
            ) : (
              <p className="text-muted">The contact form is set up at deploy time.</p>
            )}
          </div>
        </div>
      </Section>
    </div>
  )
}
