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

export const metadata: Metadata = { title: 'Flutter · Direction C · Spec sheet' }

export default function SpecFlutter() {
  const flutter = profile('flutter')
  const projects = projectsFor('flutter')
  const posts = postsFor('flutter')
  const tech = [...new Set(projects.flatMap((p) => p.tech))]
  const platformsUsed = new Set(projects.flatMap((p) => p.platforms)).size

  return (
    <main className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
      <nav className="flex justify-between pt-8 font-mono text-xs text-muted">
        <Link href="/directions/spec" className="hover:text-fg">
          ← INDEX
        </Link>
        <span>PROFILE 01 / FLUTTER</span>
      </nav>

      <header className="grid gap-6 border-b border-fg pt-10 pb-10 lg:grid-cols-12">
        <h1 className="text-[clamp(3rem,10vw,7.5rem)] leading-[0.9] font-semibold tracking-[-0.045em] lg:col-span-7">
          Flutter
        </h1>
        <div className="flex flex-col justify-end gap-4 lg:col-span-5">
          <p className="text-lg">{flutter.tagline}</p>
          <dl className="grid grid-cols-3 border-t border-line pt-3 font-mono text-xs">
            <div>
              <dt className="text-muted">PROJECTS</dt>
              <dd className="mt-1 text-2xl">{projects.length}</dd>
            </div>
            <div>
              <dt className="text-muted">PLATFORMS</dt>
              <dd className="mt-1 text-2xl">{platformsUsed}</dd>
            </div>
            <div>
              <dt className="text-muted">WRITING</dt>
              <dd className="mt-1 text-2xl">{posts.length}</dd>
            </div>
          </dl>
        </div>
      </header>

      <section id="spec-cases" className="py-12" aria-labelledby="spec-cases-title">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 id="spec-cases-title" className="font-mono text-xs text-muted">
            [01] CASE STUDIES
          </h2>
          <PlatformFilter
            scope="spec-cases"
            legend="Filter by platform"
            className="flex max-w-full overflow-x-auto border border-fg font-mono text-[11px] whitespace-nowrap"
            optionClassName="cursor-pointer border-r border-fg last:border-r-0 [&>span]:block [&>span]:px-2.5 [&>span]:py-1.5 [&>input:checked+span]:bg-fg [&>input:checked+span]:text-bg [&>input:focus-visible+span]:outline-2 [&>input:focus-visible+span]:-outline-offset-4 [&>input:focus-visible+span]:outline-accent"
          />
        </div>

        <table className="mt-6 w-full border-collapse text-left max-md:block">
          <caption className="sr-only">Flutter case studies with platforms and demo status</caption>
          <thead className="border-y border-fg font-mono text-[11px] text-muted max-md:hidden">
            <tr>
              <th scope="col" className="py-2 pr-4 font-normal">
                PROJECT
              </th>
              <th scope="col" className="py-2 pr-4 font-normal">
                PERIOD
              </th>
              {allPlatforms.map((p) => (
                <th key={p} scope="col" className="w-12 py-2 text-center font-normal">
                  {platformLabel[p]?.slice(0, 3).toUpperCase()}
                </th>
              ))}
              <th scope="col" className="py-2 pl-4 text-right font-normal">
                STATUS
              </th>
            </tr>
          </thead>
          <tbody className="max-md:block">
            {projects.map((project) => (
              <tr
                key={project.id}
                data-platforms={project.platforms.join(' ')}
                className="border-b border-line align-top max-md:block max-md:py-4"
              >
                <th scope="row" className="py-4 pr-4 font-normal max-md:block max-md:py-0">
                  <span className="block text-lg font-medium">{project.title}</span>
                  {project.summary && (
                    <span className="mt-1 block max-w-md text-sm text-muted">
                      {project.summary}
                    </span>
                  )}
                </th>
                <td className="py-4 pr-4 font-mono text-xs whitespace-nowrap max-md:block max-md:py-1">
                  {formatMonth(project.start)} – {formatMonth(project.end)}
                </td>
                {allPlatforms.map((p) => (
                  <td key={p} className="py-4 text-center font-mono max-md:hidden">
                    {project.platforms.includes(p) ? (
                      <span className="text-accent" aria-label={platformLabel[p]}>
                        ✓
                      </span>
                    ) : (
                      <span className="text-line" aria-hidden>
                        ·
                      </span>
                    )}
                  </td>
                ))}
                <td className="py-4 pl-4 text-right font-mono text-xs max-md:block max-md:p-0 max-md:text-left">
                  <span className="md:hidden">
                    {project.platforms.map((p) => platformLabel[p]).join(', ')} ·{' '}
                  </span>
                  <span className="inline-block border border-fg px-1.5 py-0.5 whitespace-nowrap">
                    {demoStatusLabel[project.demoStatus].toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section
        className="grid gap-8 border-t border-line py-12 lg:grid-cols-12"
        aria-labelledby="spec-native"
      >
        <h2 id="spec-native" className="font-mono text-xs text-muted lg:col-span-3">
          [02] NATIVE &amp; TOOLING
        </h2>
        <ul className="flex flex-wrap gap-2 lg:col-span-9">
          {tech.map((name) => (
            <li key={name} className="border border-line bg-surface px-2.5 py-1 font-mono text-xs">
              {name}
            </li>
          ))}
        </ul>
      </section>

      <section
        className="grid gap-8 border-t border-line py-12 lg:grid-cols-12"
        aria-labelledby="spec-lab"
      >
        <h2 id="spec-lab" className="font-mono text-xs text-muted lg:col-span-3">
          [03] DEMO LAB
        </h2>
        <div className="lg:col-span-9">
          <div className="grid aspect-[16/8] place-items-center border border-fg bg-surface">
            <button
              type="button"
              disabled
              className="border border-fg bg-bg px-4 py-2 font-mono text-xs disabled:cursor-not-allowed"
            >
              LOAD DEMO ▸
            </button>
          </div>
          <p className="mt-3 font-mono text-[11px] text-muted">
            FIG. 1 — FLUTTER WEB BUILD, LOADS ON CLICK. FIRST DEMO IN PHASE 2.
          </p>
        </div>
      </section>

      {posts.length > 0 && (
        <section
          className="grid gap-8 border-t border-line py-12 lg:grid-cols-12"
          aria-labelledby="spec-writing"
        >
          <h2 id="spec-writing" className="font-mono text-xs text-muted lg:col-span-3">
            [04] WRITING
          </h2>
          <ul className="border-t border-fg lg:col-span-9">
            {posts.map((post) => (
              <li
                key={post.id}
                className="grid grid-cols-[6rem_1fr] gap-4 border-b border-line py-3"
              >
                <span className="font-mono text-xs text-muted">
                  {post.publishedAt ? formatMonth(post.publishedAt).toUpperCase() : ''}
                </span>
                <span>{post.title}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
