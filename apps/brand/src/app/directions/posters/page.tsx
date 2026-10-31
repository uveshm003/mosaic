import type { Metadata } from 'next'
import { Instrument_Serif, Inter_Tight } from 'next/font/google'
import { PosterWall } from '../../../components/PosterWall'
import { RotatingWord } from '../../../components/RotatingWord'
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

const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif-family',
})
const sans = Inter_Tight({ subsets: ['latin'], variable: '--font-body-family' })

export const metadata: Metadata = { title: 'Direction B: Poster wall' }

const month = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : ''

// Direction B: every post a poster on a wall, a manifesto that won't sit still,
// and serif italics against a tight grotesk.
export default function Posters() {
  const posts = brandPosts().filter((p) => p._status !== 'draft')
  const types = typesWithPosts(posts)
  const name = displayTitle(brandName())
  const video = posts.find((p) => p.type === 'video' && p.youtubeUrl)
  const series = [...new Set(posts.map((p) => p.series).filter((s): s is string => Boolean(s)))]

  return (
    <div
      className={`dir-posters ${serif.variable} ${sans.variable} min-h-svh bg-bg font-body text-fg`}
    >
      <header className="flex items-center justify-between px-5 py-5 sm:px-10">
        <span className="font-serif text-2xl italic">{name}</span>
        <a href="#wall" className="rounded-full bg-fg px-4 py-2 text-sm font-semibold text-bg">
          Read the wall ↓
        </a>
      </header>

      <section className="px-5 pt-[10svh] pb-16 sm:px-10">
        <h1 className="max-w-[16ch] text-[clamp(3rem,9vw,8.5rem)] leading-[0.92] font-semibold tracking-[-0.045em]">
          Brands are
          <span className="block font-serif font-normal text-accent italic">
            <RotatingWord words={['promises,', 'habits,', 'rituals,', 'arguments,']} />
          </span>
          kept in public.
        </h1>
        <div className="mt-10 grid gap-6 border-t-2 border-fg pt-6 sm:grid-cols-3">
          <p className="text-lg sm:col-span-2 sm:max-w-xl">
            Notes on positioning, naming and advertising. Breakdowns of brands that get it right,
            concepts nobody commissioned, and the books behind the thinking.
          </p>
          <dl className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <dt className="text-muted">Posts</dt>
              <dd className="font-serif text-4xl italic">{posts.length}</dd>
            </div>
            <div>
              <dt className="text-muted">Kinds</dt>
              <dd className="font-serif text-4xl italic">{types.length}</dd>
            </div>
            <div>
              <dt className="text-muted">Series</dt>
              <dd className="font-serif text-4xl italic">{series.length}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section id="wall" aria-label="Posts" className="scroll-mt-4 px-5 pb-20 sm:px-10">
        <PosterWall
          types={types.map((t) => ({ key: t, label: typeLabel[t] }))}
          posters={posts.map((p) => ({
            id: p.id,
            title: displayTitle(p.title),
            type: p.type,
            typeLabel: typeLabel[p.type],
            date: month(p.publishedAt),
            excerpt: excerpt(p, 160),
            label: automaticLabel(p.type),
            bg: typeColor[p.type].bg,
            fg: typeColor[p.type].fg,
            series: p.series ? displayTitle(p.series) : null,
          }))}
        />
      </section>

      {series.length > 0 && (
        <section aria-labelledby="series" className="reveal bg-fg px-5 py-20 text-bg sm:px-10">
          <h2 id="series" className="font-serif text-[clamp(2.5rem,6vw,5rem)] italic">
            In series
          </h2>
          <ul className="mt-8 grid gap-6 md:grid-cols-2">
            {series.map((s) => (
              <li key={s} className="border-t border-bg/30 pt-5">
                <p className="text-3xl font-semibold tracking-tight">{displayTitle(s)}</p>
                <ol className="mt-3 space-y-1 text-bg/75">
                  {posts
                    .filter((p) => p.series === s)
                    .map((p, i) => (
                      <li key={p.id}>
                        {i + 1}. {displayTitle(p.title)}
                      </li>
                    ))}
                </ol>
              </li>
            ))}
          </ul>
        </section>
      )}

      {video?.youtubeUrl && (
        <section
          aria-labelledby="watch"
          className="reveal grid gap-8 px-5 py-20 sm:px-10 lg:grid-cols-[1fr_2fr] lg:items-center"
        >
          <div>
            <h2 id="watch" className="font-serif text-[clamp(2.5rem,6vw,5rem)] leading-none italic">
              Watch
            </h2>
            <p className="mt-4 text-2xl font-semibold tracking-tight">
              {displayTitle(video.title)}
            </p>
          </div>
          <YouTubeFacade
            url={video.youtubeUrl}
            title={displayTitle(video.title)}
            className="rounded-[1.25rem]"
          />
        </section>
      )}

      <footer className="flex flex-wrap items-end justify-between gap-6 border-t-2 border-fg px-5 py-10 sm:px-10">
        <p className="font-serif text-[clamp(2.5rem,7vw,6rem)] leading-none italic">{name}</p>
        <span className="flex gap-6 text-sm font-semibold">
          <a href="#">RSS</a>
          <a href="#">YouTube</a>
          <a href={personalSiteUrl}>Uvesh Menpurwala ↗</a>
        </span>
      </footer>
    </div>
  )
}
