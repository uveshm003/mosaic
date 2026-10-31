import '@mosaic/tokens/fullstack.css'
import { themeClass } from '@mosaic/tokens'
import { Geist, Geist_Mono } from 'next/font/google'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { CrossLinks } from '../../../components/CrossLinks'
import { CommandPalette, type Command } from '../../../components/fullstack/CommandPalette'
import { StackProvider } from '../../../components/fullstack/StackContext'
import { demoAdminUrl, isEnabled, person, projectsFor, techCatalog } from '../../../lib/content'
import { fullstackSections as sections, strip } from '../../../lib/fullstack'

const sans = Geist({ subsets: ['latin'], variable: '--font-body-family' })
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono-family' })

// Full-stack experience: an app shell with developer-tool panes.
export default function FullstackLayout({ children }: { children: ReactNode }) {
  const enabled = isEnabled('fullstack')
  const projects = enabled ? projectsFor('fullstack') : []
  const me = enabled ? person() : null
  const github = me?.contactLinks?.find((l) => l.url.includes('github.com'))?.url
  const demo = enabled ? demoAdminUrl() : null
  const commands: Command[] = [
    ...sections.map(([id, label]) => ({ group: 'Go to', label, href: `/fullstack#${id}` })),
    ...projects.map((p) => ({
      group: 'Case studies',
      label: strip(p.title),
      hint: p.tech.slice(0, 2).join(' · '),
      href: `/fullstack/${p.slug}`,
    })),
    ...techCatalog(projects).flatMap((g) =>
      g.tech.map((t) => ({
        group: 'Where is it used?',
        label: t.name,
        hint: `${String(t.count)} project${t.count === 1 ? '' : 's'}`,
        tech: t.name,
      })),
    ),
    ...(github
      ? [{ group: 'Links', label: 'GitHub', hint: 'opens in a new tab', href: github }]
      : []),
    ...(demo ? [{ group: 'Links', label: 'Demo admin', hint: 'read-only login', href: demo }] : []),
  ]

  return (
    <StackProvider>
      <div
        className={`${themeClass.fullstack} ${sans.variable} ${mono.variable} min-h-screen bg-bg font-body text-fg antialiased lg:grid lg:grid-cols-[15rem_1fr]`}
      >
        <aside className="border-line max-lg:border-b lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-r">
          <div className="flex items-center justify-between gap-3 px-4 py-4">
            <Link href="/fullstack" className="flex items-center gap-2 font-semibold">
              <span
                aria-hidden
                className="grid size-7 place-items-center rounded-md bg-fg font-mono text-xs text-bg"
              >
                {'{}'}
              </span>
              {strip(me?.name ?? 'Full-stack')}
            </Link>
          </div>
          <nav aria-label="Sections" className="px-2 pb-3 max-lg:overflow-x-auto">
            <ul className="flex gap-1 lg:flex-col">
              {sections.map(([id, label]) => (
                <li key={id}>
                  <a
                    href={`/fullstack#${id}`}
                    className="block rounded-md px-3 py-1.5 text-sm whitespace-nowrap text-muted hover:bg-surface hover:text-fg"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            {projects.length > 0 && (
              <div className="mt-6 max-lg:hidden">
                <p className="px-3 pb-1 font-mono text-[10px] text-muted uppercase">Case studies</p>
                <ul>
                  {projects.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/fullstack/${p.slug}`}
                        className="block truncate rounded-md px-3 py-1.5 text-sm text-muted hover:bg-surface hover:text-fg"
                      >
                        {strip(p.title)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </nav>
        </aside>
        <div className="min-w-0">
          <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-line bg-bg/85 px-4 py-2.5 backdrop-blur sm:px-6">
            <CommandPalette commands={commands} />
            <span className="flex items-center gap-2">
              {github && (
                <a
                  href={github}
                  className="rounded-lg border border-line bg-surface px-3 py-1.5 text-sm hover:border-accent"
                >
                  GitHub ↗
                </a>
              )}
            </span>
          </header>
          {children}
          <footer className="border-t border-line px-4 py-6 sm:px-6">
            <CrossLinks current="fullstack" className="text-sm text-muted" />
          </footer>
        </div>
      </div>
    </StackProvider>
  )
}
