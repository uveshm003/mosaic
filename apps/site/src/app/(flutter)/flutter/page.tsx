import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CrossLinks } from '../../../components/CrossLinks'
import { LabControls } from '../../../components/flutter/LabControls'
import { CounterPhone, Stage, type StageProject } from '../../../components/flutter/Stage'
import { StageSections } from '../../../components/flutter/StageSections'
import { WorkIndex } from '../../../components/flutter/WorkIndex'
import {
  demoStatusLabel,
  experience,
  formatMonth,
  isEnabled,
  person,
  platformLabel,
  profile,
  projectHue,
  projectsFor,
  skillsByCategory,
} from '../../../lib/content'
import { flutterPictures, type Picture } from '../../../lib/pictures'
import { SITE_URL } from '../../../lib/site'

export function generateMetadata(): Metadata {
  if (!isEnabled('flutter')) return {}
  const seo = profile('flutter')
  return { title: seo.title ?? 'Flutter', description: seo.tagline ?? undefined }
}

const margin = 'px-[clamp(20px,2.4vw,40px)]'
const year = (iso: string | null) => (iso ? String(new Date(iso).getFullYear()) : '')

function Photo({ picture, className }: { picture: Picture; className?: string }) {
  return (
    // Static export: no runtime optimizer; these are pre-sized WebP files.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={picture.src}
      width={picture.width}
      height={picture.height}
      alt={picture.alt}
      loading="lazy"
      decoding="async"
      className={`h-full w-full object-cover ${className ?? ''}`}
    />
  )
}

export default function FlutterHome() {
  if (!isEnabled('flutter')) notFound()

  const me = person()
  const settings = profile('flutter')
  const fullName = (me.name ?? '').trim()
  const surname = (fullName.split(/\s+/).at(-1) ?? fullName).toLowerCase()
  const role = me.headlines?.[0]?.text ?? ''
  const location = me.location ?? ''
  const links = me.contactLinks ?? []
  const email = links.find((l) => l.url.startsWith('mailto:'))
  const webLinks = links.filter((l) => l.url.startsWith('http'))
  const github = webLinks.find((l) => /github\.com/.test(l.url))
  const action = settings.primaryAction.label
    ? { label: settings.primaryAction.label, url: settings.primaryAction.url ?? '#contact' }
    : github
      ? { label: 'GitHub', url: github.url }
      : null

  const projects = projectsFor('flutter')
  const stageProjects: StageProject[] = projects.map((p) => ({
    id: p.id,
    title: p.title,
    summary: p.summary,
    platforms: p.platforms.map((x) => platformLabel[x] ?? x),
    status: demoStatusLabel[p.demoStatus],
    hue: projectHue(p.id),
    mobile: p.platforms.some((x) => x === 'android' || x === 'ios'),
  }))
  const roles = experience()
  const skills = skillsByCategory()
  const emailText = email ? email.url.slice('mailto:'.length) : null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: `${SITE_URL}/flutter`,
    mainEntity: { '@type': 'Person', name: fullName, jobTitle: role },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StageSections />

      <div className="relative lg:grid lg:grid-cols-[47%_1fr]">
        {/* The fixed half: the app keeps running while the column scrolls. */}
        <aside
          aria-label="Live Flutter stage"
          className="sticky top-0 z-0 h-[42svh] p-3 lg:h-svh lg:p-5"
        >
          <Stage
            projects={stageProjects}
            terminal={{
              name: fullName,
              headline: role,
              location,
              projects: projects.map((p) => ({ title: p.title, href: `/flutter/${p.slug}` })),
              skills: skills.flatMap((g) => g.skills.map((s) => s.name)),
              experience: roles.map((r) => `${r.title} @ ${r.employer}`),
              links: links.map(({ label, url }) => ({ label, url })),
            }}
          />
        </aside>

        <div className={`relative z-10 ${margin} max-lg:bg-bg lg:pr-10 lg:pl-14`}>
          <header
            data-scene="run"
            className="relative flex min-h-[58svh] flex-col pt-6 pb-10 lg:min-h-svh lg:pb-0"
          >
            <nav
              aria-label="Page"
              className="flex flex-wrap items-center justify-end gap-x-6 gap-y-2 text-[length:var(--step-small)]"
            >
              {[
                ['#work', 'Work'],
                ['#lab', 'Demo lab'],
                ['#experience', 'Experience'],
                ['#skills', 'Skills'],
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  className="press hover:text-accent focus-visible:outline-2 focus-visible:outline-fg max-sm:hidden"
                >
                  {label}
                </a>
              ))}
              {action && (
                <a
                  href={action.url}
                  className="press bg-accent px-4 py-2.5 text-accent-fg hover:bg-fg hover:text-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg"
                >
                  {action.label}
                </a>
              )}
            </nav>
            <p className="mt-10 max-w-[26ch] text-[length:var(--step-lead)] leading-snug lg:mt-[34vh]">
              {role} in {location}. One Flutter codebase, six platforms.
            </p>
            <h1
              aria-label={`${fullName}, Flutter engineer`}
              className="monument mt-auto pt-10 font-bold leading-[0.9] tracking-[-0.05em] whitespace-nowrap lowercase lg:absolute lg:bottom-10 lg:-left-[10vw] lg:pt-0"
              style={{ fontSize: surname.length > 9 ? '9vw' : 'clamp(80px, 12vw, 200px)' }}
            >
              {surname}
            </h1>
          </header>

          <section
            id="work"
            data-scene="work"
            aria-labelledby="work-title"
            className="scroll-mt-10 py-28 lg:py-40"
          >
            <h2
              id="work-title"
              data-reveal
              className="mb-12 text-[length:var(--step-lead)] font-medium"
            >
              Selected work
            </h2>
            <div data-reveal style={{ ['--i' as string]: 1 }}>
              <WorkIndex
                items={projects.map((p) => ({
                  id: p.id,
                  slug: p.slug,
                  title: p.title,
                  role: p.role,
                  year: year(p.start),
                }))}
              />
            </div>
          </section>

          <section
            id="lab"
            data-scene="lab"
            aria-labelledby="lab-title"
            className="scroll-mt-10 py-28 lg:py-40"
          >
            <h2
              id="lab-title"
              data-reveal
              className="text-[length:var(--step-head)] leading-none font-bold tracking-[-0.05em] lowercase"
            >
              The demo lab
            </h2>
            <p data-reveal style={{ ['--i' as string]: 1 }} className="mt-6 mb-10 max-w-[34ch]">
              Flutter’s starter counter app, running on the stage. Change its theme and shape, and
              read the code that draws it.
            </p>
            {/* Phones: the stage is covered by now, so the app runs inline. */}
            <div className="mb-10 grid h-[520px] place-items-center bg-[var(--field-2)] lg:hidden">
              <CounterPhone />
            </div>
            <div data-reveal style={{ ['--i' as string]: 2 }}>
              <LabControls />
            </div>
          </section>

          <section
            id="experience"
            data-scene="devices"
            aria-labelledby="experience-title"
            className="scroll-mt-10 py-28 lg:py-40"
          >
            <h2
              id="experience-title"
              data-reveal
              className="mb-8 text-[length:var(--step-lead)] font-medium"
            >
              Experience
            </h2>
            <ul className="max-w-[520px]">
              {roles.map((r, i) => (
                <li
                  key={r.id}
                  data-reveal
                  style={{ ['--i' as string]: i + 1 }}
                  className="flex items-baseline justify-between gap-6 py-2.5"
                >
                  <span className="flex items-baseline gap-2">
                    <span
                      aria-hidden
                      className="inline-block size-4 shrink-0 translate-y-0.5 rounded-full"
                      style={{ background: `oklch(0.55 0.1 ${String(projectHue(r.id))})` }}
                    />
                    <span>
                      {r.title}, {r.employer}
                    </span>
                  </span>
                  <span className="shrink-0 text-[length:var(--step-small)] text-muted tabular-nums">
                    {formatMonth(r.period?.start ?? null)} – {formatMonth(r.period?.end ?? null)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {/* Skills: one saturated field, the heading pinned while the groups pass. */}
      <section
        id="skills"
        aria-labelledby="skills-title"
        className={`bg-[var(--field-2)] ${margin} py-28 lg:py-40`}
      >
        <div className="grid gap-12 lg:grid-cols-12">
          <h2
            id="skills-title"
            className="relative z-10 text-[length:var(--step-head)] leading-[0.9] font-bold tracking-[-0.05em] lowercase lg:sticky lg:top-8 lg:col-span-5 lg:self-start"
          >
            Skills &amp; stack
          </h2>
          <div className="grid gap-x-10 gap-y-[72px] sm:grid-cols-2 lg:col-span-6 lg:col-start-7 lg:grid-cols-1 lg:gap-y-[120px]">
            {skills.map((group, gi) => {
              const picture =
                gi === 0 ? flutterPictures.fuertes : gi === 2 ? flutterPictures.photo : null
              return (
                <div key={group.category} data-reveal style={{ ['--i' as string]: gi % 3 }}>
                  <h3 className="text-[length:var(--step-lead)] font-bold lowercase">
                    {group.category}
                  </h3>
                  <div
                    className={`mt-5 flex gap-8 max-sm:flex-col ${gi === 2 ? 'sm:flex-row-reverse sm:justify-end' : ''}`}
                  >
                    {picture && (
                      <div className="aspect-[3/4] w-[200px] shrink-0 overflow-hidden max-sm:aspect-[4/3] max-sm:w-full">
                        <Photo picture={picture} />
                      </div>
                    )}
                    <ul className="space-y-3.5">
                      {group.skills.map((s) => (
                        <li key={s.id}>{s.name}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact: the email as display type on the deep field. */}
      <section
        id="contact"
        aria-labelledby="contact-title"
        className={`relative flex min-h-[86svh] flex-col justify-between gap-16 bg-[var(--field-4)] text-[var(--field-4-ink)] ${margin} py-10 lg:min-h-svh`}
      >
        <h2
          id="contact-title"
          data-reveal
          className="max-w-[30ch] text-[length:var(--step-lead)] leading-snug"
        >
          Building something in Flutter, or hiring for it? Write to me.
        </h2>
        {emailText && email && (
          <a
            href={email.url}
            data-reveal
            style={{ ['--i' as string]: 1 }}
            className="press block leading-[0.95] font-bold tracking-[-0.05em] break-words lowercase hover:text-[var(--field-2)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--field-4-ink)]"
          >
            <span
              style={{
                fontSize: `min(9vw, calc((100vw - 2 * clamp(20px, 2.4vw, 40px)) / ${(emailText.length * 0.56).toFixed(2)}))`,
              }}
            >
              {emailText.length > 26 ? (
                <>
                  {emailText.split('@')[0]}@
                  <br />
                  {emailText.split('@')[1]}
                </>
              ) : (
                emailText
              )}
            </span>
          </a>
        )}
        <div className="flex flex-wrap items-end justify-between gap-6 text-[length:var(--step-small)] max-sm:flex-col max-sm:items-start">
          <p>{location}</p>
          <ul className="flex gap-6">
            {webLinks.map((l) => (
              <li key={l.url}>
                <a
                  href={l.url}
                  className="press hover:text-[var(--field-2)] focus-visible:outline-2 focus-visible:outline-[var(--field-4-ink)]"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Close: the name across the last picture, Haeckel's hummingbirds (Dash's relatives). */}
      <footer className="relative flex min-h-[88svh] flex-col justify-between overflow-hidden text-[var(--field-4-ink)] lg:min-h-svh">
        <div className="absolute inset-0">
          <Photo picture={flutterPictures.haeckel} className="brightness-[0.62]" />
        </div>
        <div className={`relative flex flex-wrap justify-between gap-6 ${margin} pt-8`}>
          <CrossLinks current="flutter" className="text-[var(--field-4-ink)]" />
          {emailText && email && (
            <a href={email.url} className="press hover:text-[var(--field-2)]">
              {emailText}
            </a>
          )}
        </div>
        <div className={`relative ${margin} pb-6`}>
          <p
            aria-hidden
            className="leading-[0.85] font-bold tracking-[-0.05em] whitespace-nowrap lowercase"
            style={{ fontSize: surname.length > 9 ? '15vw' : '18vw' }}
          >
            {surname}
          </p>
          <p className="mt-4 text-[length:var(--step-small)]">
            Pictures:{' '}
            {Object.values(flutterPictures).map((p, i, all) => (
              <span key={p.credit.page}>
                <a href={p.credit.page} className="underline underline-offset-2">
                  {p.credit.title}
                </a>{' '}
                by {p.credit.creator}, {p.credit.licence}
                {i < all.length - 1 ? '; ' : '.'}
              </span>
            ))}
          </p>
        </div>
      </footer>
    </>
  )
}
