import type { Metadata } from 'next'
import Link from 'next/link'
import { PlatformFilter } from '../../../../components/PlatformFilter'
import {
  demoStatusLabel,
  formatMonth,
  platformLabel,
  postsFor,
  profile,
  projectsFor,
} from '../../../../lib/content'

export const metadata: Metadata = { title: 'Flutter · Direction A · Editorial' }

export default function EditorialFlutter() {
  const flutter = profile('flutter')
  const projects = projectsFor('flutter')
  const native = projects.filter(
    (p) => p.platforms.includes('android') || p.platforms.includes('ios'),
  )
  const posts = postsFor('flutter')

  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
      <nav className="flex justify-between pt-8 text-sm text-muted">
        <Link href="/directions/editorial" className="sweep">
          ← Index
        </Link>
        <span>Profile 01</span>
      </nav>

      <header className="grid gap-8 border-b border-line pt-10 pb-14 lg:grid-cols-[2fr_1fr] lg:items-end">
        <h1 className="font-display text-[clamp(4rem,14vw,11rem)] leading-[0.85] font-light tracking-[-0.04em] [font-variation-settings:'opsz'_144]">
          Flutter
        </h1>
        <div className="space-y-5">
          <p className="font-display text-xl leading-snug italic">{flutter.tagline}</p>
          {flutter.primaryAction.label && (
            <a
              href={flutter.primaryAction.url ?? '#'}
              className="inline-block rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-85"
            >
              {flutter.primaryAction.label}
            </a>
          )}
        </div>
      </header>

      <section id="ed-cases" className="reveal py-14" aria-labelledby="ed-cases-title">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 id="ed-cases-title" className="font-display text-3xl italic">
            Case studies
          </h2>
          <PlatformFilter
            scope="ed-cases"
            legend="Filter by platform"
            className="flex flex-wrap gap-x-4 gap-y-1 text-xs tracking-[0.18em] uppercase"
            optionClassName="cursor-pointer text-muted [&>span]:pb-0.5 [&>input:checked+span]:border-b [&>input:checked+span]:border-accent [&>input:checked+span]:text-fg [&>input:focus-visible+span]:outline-2 [&>input:focus-visible+span]:outline-accent"
          />
        </div>
        <div className="mt-8 divide-y divide-line border-y border-line">
          {projects.map((project, index) => (
            <article
              key={project.id}
              data-platforms={project.platforms.join(' ')}
              className="grid gap-4 py-8 sm:grid-cols-[4.5rem_1fr]"
            >
              <span className="font-display text-5xl leading-none text-accent tabular-nums">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
                <div>
                  <h3 className="font-display text-[clamp(1.5rem,3vw,2.2rem)] leading-tight">
                    {project.title}
                  </h3>
                  {project.summary && (
                    <p className="mt-3 max-w-prose leading-relaxed text-fg/85">{project.summary}</p>
                  )}
                </div>
                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 self-start text-sm">
                  <dt className="text-muted">Role</dt>
                  <dd>{project.role}</dd>
                  <dt className="text-muted">Period</dt>
                  <dd>
                    {formatMonth(project.start)} – {formatMonth(project.end)}
                  </dd>
                  <dt className="text-muted">Platforms</dt>
                  <dd>{project.platforms.map((p) => platformLabel[p]).join(', ')}</dd>
                  <dt className="text-muted">Status</dt>
                  <dd>
                    <span className="rounded-full border border-accent px-2 py-0.5 text-xs text-accent">
                      {demoStatusLabel[project.demoStatus]}
                    </span>
                  </dd>
                </dl>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        className="reveal grid gap-10 border-b border-line py-14 lg:grid-cols-[1fr_2fr]"
        aria-labelledby="ed-native"
      >
        <h2 id="ed-native" className="font-display text-3xl italic">
          Native
        </h2>
        <div className="space-y-6">
          <blockquote className="border-l-2 border-accent pl-6 font-display text-[clamp(1.4rem,3vw,2rem)] leading-snug">
            Native work inside Flutter apps, drawn from projects that ship on Android and iOS.
          </blockquote>
          <ul className="grid gap-3 sm:grid-cols-2">
            {native.map((project) => (
              <li key={project.id} className="border-t border-line pt-3">
                <p className="font-medium">{project.title}</p>
                <p className="text-sm text-muted">{project.tech.join(' · ')}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="reveal py-14" aria-labelledby="ed-lab">
        <h2 id="ed-lab" className="font-display text-3xl italic">
          Demo lab
        </h2>
        <figure className="mt-8 border border-line bg-surface p-4 sm:p-8">
          <div className="grid aspect-video place-items-center bg-[repeating-linear-gradient(45deg,var(--surface),var(--surface)_12px,var(--bg)_12px,var(--bg)_24px)]">
            <button
              type="button"
              disabled
              className="rounded-full bg-fg px-6 py-3 font-display text-lg text-bg disabled:cursor-not-allowed"
            >
              ▶ Load demo
            </button>
          </div>
          <figcaption className="mt-4 text-sm text-muted">
            Plate I. Embedded Flutter web builds load only when clicked. The first demo comes with
            Phase 2.
          </figcaption>
        </figure>
      </section>

      {posts.length > 0 && (
        <section className="reveal border-t border-line py-14" aria-labelledby="ed-writing">
          <h2 id="ed-writing" className="font-display text-3xl italic">
            Writing
          </h2>
          <ul className="mt-6 divide-y divide-line">
            {posts.map((post) => (
              <li
                key={post.id}
                className="flex flex-wrap items-baseline justify-between gap-2 py-4"
              >
                <span className="font-display text-xl">{post.title}</span>
                <span className="text-sm text-muted tabular-nums">
                  {post.publishedAt ? formatMonth(post.publishedAt) : ''}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
