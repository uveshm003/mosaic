import type { Metadata } from 'next'
import Link from 'next/link'
import { PlatformFilter } from '../../../../components/PlatformFilter'
import {
  allPlatforms,
  demoStatusLabel,
  formatMonth,
  platformLabel,
  postsFor,
  profile,
  projectsFor,
} from '../../../../lib/content'

export const metadata: Metadata = { title: 'Flutter · Direction B · Night studio' }

function art(id: number) {
  const hue = (id * 47) % 360
  return `radial-gradient(120% 90% at 0% 0%, oklch(0.62 0.19 ${String(hue)}), transparent 60%), radial-gradient(100% 80% at 100% 100%, oklch(0.55 0.2 ${String((hue + 80) % 360)}), transparent 55%), #0d0f16`
}

export default function StudioFlutter() {
  const flutter = profile('flutter')
  const projects = projectsFor('flutter')
  const posts = postsFor('flutter')

  return (
    <main className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
      <nav className="flex justify-between pt-8 font-mono text-xs text-muted">
        <Link href="/directions/studio" className="hover:text-fg">
          ← cd ..
        </Link>
        <span>flutter</span>
      </nav>

      <header className="relative grid items-center gap-10 py-16 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <h1 className="gradient-text font-display text-[clamp(3.5rem,12vw,9rem)] leading-[0.9] font-semibold tracking-[-0.05em]">
            Flutter
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted">{flutter.tagline}</p>
        </div>
        <div aria-hidden className="relative mx-auto hidden size-72 lg:block">
          <div className="absolute inset-[38%] rounded-full bg-[radial-gradient(circle,var(--accent),transparent_70%)] blur-md" />
          <div className="orbit absolute inset-0 rounded-full border border-line">
            {allPlatforms.map((platform, i) => {
              const angle = (i / allPlatforms.length) * 2 * Math.PI
              return (
                <span
                  key={platform}
                  className="glass absolute rounded-full px-3 py-1 font-mono text-[11px]"
                  style={{
                    left: `${String(50 + 50 * Math.cos(angle))}%`,
                    top: `${String(50 + 50 * Math.sin(angle))}%`,
                    translate: '-50% -50%',
                  }}
                >
                  {platformLabel[platform]}
                </span>
              )
            })}
          </div>
        </div>
      </header>

      <section id="st-cases" aria-labelledby="st-cases-title">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2
            id="st-cases-title"
            className="font-mono text-xs tracking-widest text-accent uppercase"
          >
            Case studies
          </h2>
          <PlatformFilter
            scope="st-cases"
            legend="Filter by platform"
            className="glass flex flex-wrap gap-1 rounded-full p-1 font-mono text-xs"
            optionClassName="cursor-pointer [&>span]:block [&>span]:rounded-full [&>span]:px-3 [&>span]:py-1.5 [&>span]:text-muted [&>input:checked+span]:bg-fg [&>input:checked+span]:text-bg [&>input:focus-visible+span]:outline-2 [&>input:focus-visible+span]:outline-accent"
          />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <article
              key={project.id}
              data-platforms={project.platforms.join(' ')}
              className={`glass group flex flex-col overflow-hidden rounded-3xl transition hover:-translate-y-1 hover:border-accent ${index === 0 ? 'sm:col-span-2' : ''}`}
            >
              <div
                className="h-40 transition-transform duration-700 group-hover:scale-105"
                style={{ background: art(project.id) }}
              />
              <div className="flex flex-1 flex-col gap-3 p-6">
                <div className="flex items-center justify-between gap-3 font-mono text-[11px] text-muted">
                  <span>{formatMonth(project.start)}</span>
                  <span className="rounded-full border border-accent/50 px-2 py-0.5 text-accent">
                    {demoStatusLabel[project.demoStatus]}
                  </span>
                </div>
                <h3 className="font-display text-2xl leading-tight font-semibold">
                  {project.title}
                </h3>
                {project.summary && (
                  <p className="text-sm leading-relaxed text-muted">{project.summary}</p>
                )}
                <p className="mt-auto pt-2 font-mono text-[11px] text-fg/70">
                  {project.platforms.map((p) => platformLabel[p]).join(' · ')}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-20 grid gap-10 lg:grid-cols-[1fr_1.1fr]" aria-labelledby="st-lab">
        <div>
          <h2 id="st-lab" className="font-mono text-xs tracking-widest text-accent uppercase">
            Demo lab
          </h2>
          <p className="mt-5 font-display text-3xl leading-tight font-semibold">
            Run the apps right here.
          </p>
          <p className="mt-4 max-w-md text-muted">
            Flutter web builds sit behind a poster and load only on click. The first demo arrives in
            Phase 2.
          </p>
        </div>
        <div className="mx-auto w-64 rounded-[2.6rem] border border-line bg-[#0d0f16] p-3 shadow-[0_30px_80px_-30px_var(--accent)]">
          <div
            className="grid aspect-[9/19] place-items-center rounded-[2rem]"
            style={{ background: art(7) }}
          >
            <button
              type="button"
              disabled
              className="glass rounded-full px-5 py-2.5 font-mono text-xs disabled:cursor-not-allowed"
            >
              tap to load
            </button>
          </div>
        </div>
      </section>

      {posts.length > 0 && (
        <section className="mt-20" aria-labelledby="st-writing">
          <h2 id="st-writing" className="font-mono text-xs tracking-widest text-accent uppercase">
            Writing
          </h2>
          <ul className="mt-5 divide-y divide-line border-y border-line font-mono text-sm">
            {posts.map((post) => (
              <li key={post.id} className="flex flex-wrap justify-between gap-2 py-4">
                <span className="text-fg">{post.title}</span>
                <span className="text-muted">
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
