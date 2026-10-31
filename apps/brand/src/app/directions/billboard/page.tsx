import type { Metadata } from 'next'
import { Archivo } from 'next/font/google'
import { VelocityMarquee } from '../../../components/VelocityMarquee'
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

const archivo = Archivo({ subsets: ['latin'], axes: ['wdth'], display: 'swap' })

export const metadata: Metadata = { title: 'Direction A: Billboard' }

const date = (iso: string | null | undefined) =>
  iso
    ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : ''

// Direction A: the name as a billboard, a ticker of headlines, and one loud colour
// band per kind of post.
export default function Billboard() {
  const posts = brandPosts().filter((p) => p._status !== 'draft')
  const types = typesWithPosts(posts)
  const name = displayTitle(brandName())
  const video = posts.find((p) => p.type === 'video' && p.youtubeUrl)

  return (
    <div
      className={`dir-billboard ${archivo.className} min-h-svh bg-bg text-fg`}
      style={{ ['--wide' as string]: '"wdth" 125' }}
    >
      <header className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 text-sm sm:px-10">
        <span className="font-black tracking-tight uppercase [font-variation-settings:var(--wide)]">
          {name}
        </span>
        <nav aria-label="Kinds of post">
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {types.map((t) => (
              <li key={t}>
                <a href={`#${t}`} className="hover:text-accent">
                  {typeLabel[t]}{' '}
                  <sup className="text-muted">{posts.filter((p) => p.type === t).length}</sup>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* The billboard: the name fills the width. */}
      <section className="px-5 pt-[8svh] pb-10 sm:px-10">
        <h1
          className="leading-[0.82] font-black tracking-[-0.04em] uppercase [font-variation-settings:var(--wide)]"
          style={{
            fontSize: `min(24vw, calc((100vw - 2.5rem) / ${(name.length * 0.74).toFixed(2)}))`,
          }}
        >
          {name.split(' ').map((word, i) => (
            <span key={i} className={`block ${i % 2 ? 'text-accent' : ''}`}>
              {word}
            </span>
          ))}
        </h1>
        <div className="mt-10 grid gap-6 sm:grid-cols-[1.2fr_1fr] sm:items-end">
          <p className="max-w-[22ch] text-[clamp(1.6rem,3.6vw,3rem)] leading-[1.02] font-extrabold tracking-tight">
            Brands, campaigns and the thinking behind them. Opinions included.
          </p>
          <p className="max-w-md text-lg text-muted sm:justify-self-end">
            Essays, breakdowns of brands that work, campaign concepts nobody asked for, and notes
            from books and research.
          </p>
        </div>
      </section>

      <VelocityMarquee className="border-y-2 border-fg bg-accent py-3 text-accent-fg">
        {posts.slice(0, 8).map((p) => (
          <span
            key={p.id}
            className="flex items-center gap-6 pr-6 text-xl font-extrabold whitespace-nowrap uppercase sm:text-2xl"
          >
            {displayTitle(p.title)}
            <span aria-hidden>✺</span>
          </span>
        ))}
      </VelocityMarquee>

      {/* Latest: big rows that flood with colour on hover. */}
      <section aria-labelledby="latest" className="px-5 py-20 sm:px-10">
        <h2 id="latest" className="mb-8 text-sm font-bold tracking-[0.2em] uppercase">
          Latest
        </h2>
        <ol className="border-t-2 border-fg">
          {posts.slice(0, 6).map((p, i) => {
            const c = typeColor[p.type]
            return (
              <li key={p.id} className="reveal border-b-2 border-fg">
                <a
                  href="#"
                  className="group relative grid grid-cols-[3rem_1fr] items-baseline gap-x-4 overflow-hidden py-6 sm:grid-cols-[4rem_10rem_1fr_8rem]"
                  style={{ ['--hover-bg' as string]: c.bg, ['--hover-fg' as string]: c.fg }}
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 origin-left scale-x-0 bg-[var(--hover-bg)] transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-x-100 motion-reduce:transition-none"
                  />
                  <span className="relative font-bold tabular-nums group-hover:text-[var(--hover-fg)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="relative text-sm font-bold uppercase group-hover:text-[var(--hover-fg)] max-sm:hidden">
                    {typeLabel[p.type]}
                  </span>
                  <span className="relative text-[clamp(1.5rem,3.4vw,2.8rem)] leading-[1.02] font-extrabold tracking-tight group-hover:text-[var(--hover-fg)]">
                    {displayTitle(p.title)}
                  </span>
                  <span className="relative text-sm text-muted group-hover:text-[var(--hover-fg)] max-sm:col-start-2 sm:text-right">
                    {date(p.publishedAt)}
                  </span>
                </a>
              </li>
            )
          })}
        </ol>
      </section>

      {/* One band per kind of post, in its own colour. */}
      {types.map((t) => {
        const c = typeColor[t]
        const ofType = posts.filter((p) => p.type === t)
        const label = automaticLabel(t)
        return (
          <section
            key={t}
            id={t}
            aria-labelledby={`${t}-title`}
            className="scroll-mt-4 px-5 py-16 sm:px-10 sm:py-24"
            style={{ background: c.bg, color: c.fg }}
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2
                id={`${t}-title`}
                className="leading-[0.85] font-black tracking-[-0.04em] uppercase [font-variation-settings:var(--wide)]"
                style={{
                  fontSize: `min(10rem, calc((100vw - 2.5rem) / ${(typeLabel[t].length * 1.0).toFixed(2)}))`,
                }}
              >
                {typeLabel[t]}
              </h2>
              {label && (
                <p className="-rotate-2 border-2 border-current px-3 py-1 text-sm font-bold">
                  {label}
                </p>
              )}
            </div>
            {t === 'video' && video?.youtubeUrl ? (
              <div className="reveal mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
                <YouTubeFacade
                  url={video.youtubeUrl}
                  title={displayTitle(video.title)}
                  className="border-2 border-current"
                />
                <ul className="space-y-6">
                  {ofType.map((p) => (
                    <li key={p.id} className="border-t-2 border-current pt-4">
                      <p className="text-2xl font-extrabold">{displayTitle(p.title)}</p>
                      <p className="mt-1 text-sm opacity-75">{date(p.publishedAt)}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <ul className="mt-10 grid gap-x-8 gap-y-10 md:grid-cols-3">
                {ofType.slice(0, 3).map((p) => (
                  <li key={p.id} className="reveal border-t-2 border-current pt-4">
                    <a href="#" className="group block">
                      <p className="text-sm font-bold opacity-75">{date(p.publishedAt)}</p>
                      <p className="mt-2 text-[clamp(1.4rem,2.4vw,2rem)] leading-[1.05] font-extrabold tracking-tight underline-offset-4 group-hover:underline">
                        {displayTitle(p.title)}
                      </p>
                      <p className="mt-3 opacity-80">{excerpt(p, 140)}</p>
                      {p.series && (
                        <p className="mt-3 text-sm font-bold">Series: {displayTitle(p.series)}</p>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )
      })}

      <footer className="px-5 pt-24 pb-10 sm:px-10">
        <p className="text-[clamp(3rem,13vw,12rem)] leading-[0.82] font-black tracking-[-0.05em] uppercase [font-variation-settings:var(--wide)]">
          Stay <span className="text-accent">curious.</span>
        </p>
        <div className="mt-12 flex flex-wrap justify-between gap-4 border-t-2 border-fg pt-4 text-sm font-bold">
          <span>{name}</span>
          <span className="flex gap-6">
            <a href="#" className="hover:text-accent">
              RSS
            </a>
            <a href="#" className="hover:text-accent">
              YouTube
            </a>
            <a href={personalSiteUrl} className="hover:text-accent">
              Uvesh Menpurwala ↗
            </a>
          </span>
        </div>
      </footer>
    </div>
  )
}
