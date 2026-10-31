import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@mosaic/ui'
import { ContactForm } from '../../../components/flutter/ContactForm'
import { CursorGlow } from '../../../components/CursorGlow'
import { DeviceMock } from '../../../components/flutter/DeviceMock'
import { ExperienceTabs } from '../../../components/flutter/ExperienceTabs'
import { DemoLab } from '../../../components/flutter/DemoLab'
import { flutterDemos } from '../../../lib/demos'
import { Playground } from '../../../components/flutter/Playground'
import { SideNav } from '../../../components/flutter/SideNav'
import { SkillBoard } from '../../../components/flutter/SkillBoard'
import { Terminal } from '../../../components/flutter/Terminal'
import { WorkDeck } from '../../../components/flutter/WorkDeck'
import {
  currentProject,
  demoStatusLabel,
  experience,
  formatMonth,
  isEnabled,
  latestPosts,
  person,
  platformLabel,
  projectsFor,
  profile,
  projectHue,
  skillsByCategory,
} from '../../../lib/content'
import { SITE_URL } from '../../../lib/site'

export function generateMetadata(): Metadata {
  if (!isEnabled('flutter')) return {}
  const seo = profile('flutter')
  return { title: seo.title ?? 'Flutter', description: seo.tagline ?? undefined }
}

const sections = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'playground', label: 'Playground' },
  { id: 'demos', label: 'Demo lab' },
  { id: 'writing', label: 'Writing' },
  { id: 'contact', label: 'Contact' },
]

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

export default function FlutterHome() {
  if (!isEnabled('flutter')) notFound()

  const me = person()
  const name = me.name ?? ''
  const headline = me.headlines?.[0]?.text ?? ''
  const availability = me.headlines?.[1]?.text
  const work = projectsFor('flutter')
  const current = currentProject()
  const roles = experience()
  const skills = skillsByCategory()
  const posts = latestPosts(3)
  const links = me.contactLinks ?? []
  const caseStudyHref = (p: { slug: string }) => `/flutter/${p.slug}`
  const endpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle: headline,
    homeLocation: me.location ? { '@type': 'Place', name: me.location } : undefined,
    url: `${SITE_URL}/flutter`,
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
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:flex lg:gap-16 lg:px-12">
        <header className="pt-16 lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-[42%] lg:flex-col lg:justify-between lg:py-20">
          <div>
            <h1
              className="rise font-display text-[clamp(2.8rem,6vw,4.6rem)] leading-[0.95] font-bold tracking-[-0.035em]"
              aria-label={name}
            >
              {name.split(' ').map((word, w, words) => {
                // Letter index across the whole name, so the rise staggers left to right.
                const offset = words.slice(0, w).join(' ').length + (w > 0 ? 1 : 0)
                return (
                  <span key={w} aria-hidden className="inline-block whitespace-nowrap">
                    {Array.from(word).map((char, i) => (
                      <span key={i} style={{ ['--i' as string]: offset + i }}>
                        {char}
                      </span>
                    ))}
                    {w < words.length - 1 ? '\u00a0' : ''}
                  </span>
                )
              })}
            </h1>
            <p className="mt-4 font-display text-xl text-fg/90">{headline}</p>
            <p className="mt-3 max-w-sm text-muted">{profile('flutter').tagline}</p>
            {availability && (
              <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 font-mono text-xs">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:animate-none" />
                  <span className="relative inline-flex size-2 rounded-full bg-accent" />
                </span>
                {availability}
              </p>
            )}
            <div className="mt-14">
              <SideNav sections={sections} />
            </div>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs text-muted lg:mt-0">
            {links.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  className="transition hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
                >
                  {link.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </header>

        <main className="space-y-28 pt-14 pb-24 lg:w-[58%] lg:py-20">
          <section aria-label="Terminal">
            <Terminal
              data={{
                name,
                headline,
                location: me.location ?? '',
                about: paragraphs(me.about),
                projects: work.map((p) => ({ title: p.title, href: caseStudyHref(p) })),
                skills: skills.flatMap((g) => g.skills.map((s) => s.name)),
                experience: roles.map((r) => `${r.title} @ ${r.employer}`),
                links: links.map(({ label, url }) => ({ label, url })),
              }}
            />
          </section>

          <section id="about" aria-labelledby="about-title" className="reveal scroll-mt-20">
            <SectionTitle id="about" index={1}>
              About
            </SectionTitle>
            <div className="space-y-4 text-[1.05rem] leading-relaxed text-fg/80">
              <RichText value={me.about} />
            </div>
            {current && (
              <div className="card mt-8 flex items-center gap-4 p-5">
                <span
                  className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent/15 text-xl"
                  aria-hidden
                >
                  ⚒
                </span>
                <div>
                  <p className="font-mono text-xs text-accent">currently building</p>
                  <p className="font-medium">{current.title}</p>
                  {current.summary && <p className="text-sm text-muted">{current.summary}</p>}
                </div>
              </div>
            )}
          </section>

          <section id="work" aria-labelledby="work-title" className="reveal scroll-mt-20">
            <SectionTitle id="work" index={2}>
              Featured work
            </SectionTitle>
            <WorkDeck label="Featured projects">
              {work.map((project) => {
                const href: string | null = caseStudyHref(project)
                const phone = project.platforms.some((p) => p === 'android' || p === 'ios')
                const inner = (
                  <>
                    <div className="grid h-60 place-items-center overflow-hidden rounded-xl bg-[radial-gradient(circle_at_50%_120%,color-mix(in_oklab,var(--accent)_18%,transparent),transparent_70%)] p-5 transition-transform duration-500 group-hover:scale-[1.03]">
                      <DeviceMock
                        kind={phone ? 'phone' : 'desktop'}
                        hue={projectHue(project.id)}
                        label={project.title}
                      />
                    </div>
                    <div className="mt-5 flex items-center justify-between gap-3 font-mono text-[11px] text-muted">
                      <span>{formatMonth(project.start)}</span>
                      <span className="rounded-full border border-accent/40 px-2 py-0.5 text-accent">
                        {demoStatusLabel[project.demoStatus]}
                      </span>
                    </div>
                    <h3 className="mt-2 font-display text-xl leading-tight font-semibold">
                      {project.title}
                      {href && (
                        <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      )}
                    </h3>
                    {project.summary && (
                      <p className="mt-2 text-sm leading-relaxed text-muted">{project.summary}</p>
                    )}
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {project.platforms.map((p) => (
                        <li
                          key={p}
                          className="rounded-md bg-surface px-2 py-0.5 font-mono text-[10px] text-fg/70"
                        >
                          {platformLabel[p]}
                        </li>
                      ))}
                    </ul>
                  </>
                )
                const cls =
                  'group card block w-[19rem] shrink-0 snap-start p-4 transition hover:-translate-y-1 hover:border-accent/50 sm:w-[22rem]'
                return href ? (
                  <Link
                    key={project.id}
                    href={href}
                    draggable={false}
                    className={`${cls} focus-visible:outline-2 focus-visible:outline-accent`}
                  >
                    {inner}
                  </Link>
                ) : (
                  <article key={project.id} className={cls}>
                    {inner}
                  </article>
                )
              })}
            </WorkDeck>
          </section>

          <section
            id="experience"
            aria-labelledby="experience-title"
            className="reveal scroll-mt-20"
          >
            <SectionTitle id="experience" index={3}>
              Experience
            </SectionTitle>
            <ExperienceTabs
              items={roles.map((role) => ({
                id: String(role.id),
                employer: role.employer,
                employerDetail: role.employerDetail ?? null,
                title: role.title,
                period: `${formatMonth(role.period?.start ?? null)} – ${formatMonth(role.period?.end ?? null)}`,
                location: role.location ?? null,
                highlights: (role.highlights ?? []).map((h) => h.text),
              }))}
            />
          </section>

          <section id="skills" aria-labelledby="skills-title" className="reveal scroll-mt-20">
            <SectionTitle id="skills" index={4}>
              Skills &amp; stack
            </SectionTitle>
            <SkillBoard groups={skills} />
          </section>

          <section
            id="playground"
            aria-labelledby="playground-title"
            className="reveal scroll-mt-20"
          >
            <SectionTitle id="playground" index={5}>
              Playground
            </SectionTitle>
            <p className="mb-6 max-w-xl text-muted">
              Flutter’s starter app, rebuilt in the browser. Tap the button, change the seed colour,
              and watch the Flutter code update.
            </p>
            <Playground />
          </section>

          <section id="demos" aria-labelledby="demos-title" className="reveal scroll-mt-20">
            <SectionTitle id="demos" index={6}>
              Demo lab
            </SectionTitle>
            <p className="mb-6 max-w-xl text-muted">
              Real Flutter apps compiled for the web, running right here. Each one loads only when
              you press Run.
            </p>
            <DemoLab demos={flutterDemos} />
          </section>

          {posts.length > 0 && (
            <section id="writing" aria-labelledby="writing-title" className="reveal scroll-mt-20">
              <SectionTitle id="writing" index={7}>
                Writing
              </SectionTitle>
              <ul className="divide-y divide-line">
                {posts.map((post) => (
                  <li
                    key={post.id}
                    className="group flex flex-wrap items-baseline justify-between gap-2 py-4"
                  >
                    <span className="font-medium transition group-hover:text-accent">
                      {post.title}
                    </span>
                    <span className="font-mono text-xs text-muted">
                      {formatMonth(post.publishedAt ?? null)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section id="contact" aria-labelledby="contact-title" className="reveal scroll-mt-20">
            <SectionTitle id="contact" index={8}>
              Contact
            </SectionTitle>
            <p className="mb-8 max-w-xl text-lg text-fg/85">
              Have a project, a role or a question? Send a message and I’ll get back to you by
              email.
            </p>
            {endpoint && siteKey ? (
              <ContactForm endpoint={endpoint} siteKey={siteKey} />
            ) : (
              <ul className="flex flex-wrap gap-3">
                {links.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      className="card inline-block px-4 py-2 transition hover:border-accent"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>
      </div>
    </>
  )
}
