import type { Metadata } from 'next'
import { Inter, Unbounded } from 'next/font/google'
import { StudioMark } from '../../../components/StudioHero'
import { YouTubeFacade } from '../../../components/YouTubeFacade'
import {
  brandName,
  brandPosts,
  displayTitle,
  excerpt,
  typeLabel,
  typesWithPosts,
  personalSiteUrl,
} from '../../../lib/content'
import { automaticLabel } from '../../../lib/labels'
import { typeColor } from '../../../lib/palette'

const display = Unbounded({ subsets: ['latin'], variable: '--font-display-family' })
const body = Inter({ subsets: ['latin'], variable: '--font-body-family' })

export const metadata: Metadata = { title: 'Direction C: Studio 3D' }

const date = (iso: string | null | undefined) =>
  iso
    ? new Date(iso).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      })
    : ''

// Direction C: a studio front with a 3D mark you can turn, then a Swiss index of
// everything written.
export default function Studio() {
  const posts = brandPosts().filter((p) => p._status !== 'draft')
  const types = typesWithPosts(posts)
  const name = displayTitle(brandName())
  const featured = posts.find((p) => p.type === 'brand-breakdown')
  const video = posts.find((p) => p.type === 'video' && p.youtubeUrl)
  const featuredLabel = featured ? automaticLabel(featured.type) : null

  return (
    <div
      className={`dir-studio ${display.variable} ${body.variable} min-h-svh bg-bg font-body text-fg`}
    >
      <header className="flex items-center justify-between border-b border-line px-5 py-4 text-sm sm:px-10">
        <span className="font-display font-semibold">{name}</span>
        <span className="text-muted">Brand · Advertising · Growth</span>
      </header>

      <section className="grid min-h-[calc(100svh-3.5rem)] gap-8 px-5 py-10 sm:px-10 lg:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col justify-between gap-10">
          <h1 className="font-display text-[clamp(2.6rem,6.4vw,6.4rem)] leading-[0.95] font-semibold tracking-[-0.03em]">
            Brand thinking, <span className="text-accent">out loud.</span>
          </h1>
          <div className="grid gap-6 sm:grid-cols-2">
            <p className="text-lg">
              Breakdowns of brands that work, campaign concepts nobody asked for, and essays that
              pick a side.
            </p>
            <p className="text-muted">
              Turn the mark. Hover a kind of post and it changes colour; every kind has its own.
            </p>
          </div>
        </div>
        <StudioMark
          kinds={types.map((t) => ({ key: t, label: typeLabel[t], color: typeColor[t].bg }))}
        />
      </section>

      {featured && (
        <section
          aria-labelledby="featured"
          className="reveal grid gap-8 border-t border-line px-5 py-20 sm:px-10 lg:grid-cols-[1fr_2fr]"
        >
          <p id="featured" className="font-display text-sm font-semibold tracking-wide uppercase">
            Featured breakdown
          </p>
          <div>
            <h2 className="font-display text-[clamp(2rem,4.4vw,4rem)] leading-[1] font-semibold tracking-tight">
              {displayTitle(featured.title)}
            </h2>
            <p className="mt-6 max-w-2xl text-xl text-muted">{excerpt(featured, 260)}</p>
            {featuredLabel && (
              <p className="mt-6 inline-block bg-fg px-3 py-1 text-sm text-bg">{featuredLabel}</p>
            )}
          </div>
        </section>
      )}

      {/* The index: every post, grouped by kind. */}
      <section aria-labelledby="index" className="border-t border-line px-5 py-20 sm:px-10">
        <h2
          id="index"
          className="font-display text-[clamp(2.5rem,8vw,7rem)] leading-none font-semibold tracking-[-0.04em]"
        >
          Index
        </h2>
        {types.map((t) => {
          const label = automaticLabel(t)
          return (
            <div key={t} id={t} className="reveal mt-14 scroll-mt-6">
              <div className="sticky top-0 z-10 flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-fg bg-bg py-3">
                <h3 className="flex items-center gap-3 font-display text-xl font-semibold">
                  <span
                    className="size-4 ring-1 ring-fg/30"
                    style={{ background: typeColor[t].bg }}
                  />
                  {typeLabel[t]}
                </h3>
                {label && <p className="text-xs text-muted">{label}</p>}
              </div>
              <ol>
                {posts
                  .filter((p) => p.type === t)
                  .map((p, i) => (
                    <li key={p.id} className="border-b border-line">
                      <a
                        href="#"
                        className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 py-4 transition-[padding] hover:pl-3"
                      >
                        <span className="text-sm text-muted tabular-nums">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="text-lg font-medium sm:text-2xl">
                          {displayTitle(p.title)}
                          {p.series && (
                            <span className="ml-3 text-sm text-muted">
                              {displayTitle(p.series)}
                            </span>
                          )}
                        </span>
                        <span className="text-sm text-muted tabular-nums">
                          {date(p.publishedAt)}
                        </span>
                      </a>
                    </li>
                  ))}
              </ol>
            </div>
          )
        })}
      </section>

      {video?.youtubeUrl && (
        <section aria-label="Video" className="reveal border-t border-line px-5 py-20 sm:px-10">
          <YouTubeFacade
            url={video.youtubeUrl}
            title={displayTitle(video.title)}
            className="bg-surface"
          />
          <p className="mt-4 font-display text-xl font-semibold">{displayTitle(video.title)}</p>
        </section>
      )}

      <footer className="flex flex-wrap justify-between gap-4 border-t border-line px-5 py-8 text-sm sm:px-10">
        <span className="font-display font-semibold">{name}</span>
        <span className="flex gap-6">
          <a href="#">RSS</a>
          <a href="#">YouTube</a>
          <a href={personalSiteUrl}>Uvesh Menpurwala ↗</a>
        </span>
      </footer>
    </div>
  )
}
