import Link from 'next/link'
import { PosterWall } from '../components/PosterWall'
import { RotatingWord } from '../components/RotatingWord'
import { YouTubeFacade } from '../components/YouTubeFacade'
import {
  allSeries,
  brandPosts,
  displayTitle,
  postPath,
  typeLabel,
  typesWithPosts,
} from '../lib/content'
import { toPoster } from '../lib/posters'

// The poster wall: a manifesto, every post as a poster, then series and the latest video.
export default function Home() {
  const posts = brandPosts()
  const types = typesWithPosts(posts)
  const series = allSeries(posts)
  const video = posts.find((p) => p.type === 'video' && p.youtubeUrl)

  return (
    <>
      <section className="px-5 pt-[8svh] pb-16 sm:px-10">
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
            {[
              ['Posts', posts.length],
              ['Kinds', types.length],
              ['Series', series.length],
            ]
              .filter(([, value]) => value !== 0)
              .map(([label, value]) => (
                <div key={label}>
                  <dt className="text-muted">{label}</dt>
                  <dd className="font-serif text-4xl italic">{value}</dd>
                </div>
              ))}
          </dl>
        </div>
      </section>

      <section id="wall" aria-label="Posts" className="px-5 pb-20 sm:px-10">
        {posts.length > 0 ? (
          <PosterWall
            types={types.map((t) => ({ key: t, label: typeLabel[t] }))}
            posters={posts.map(toPoster)}
          />
        ) : (
          <p className="font-serif text-4xl italic text-muted">The first posts are on their way.</p>
        )}
      </section>

      {series.length > 0 && (
        <section aria-labelledby="series" className="reveal bg-fg px-5 py-20 text-bg sm:px-10">
          <h2 id="series" className="font-serif text-[clamp(2.5rem,6vw,5rem)] italic">
            In series
          </h2>
          <ul className="mt-8 grid gap-6 md:grid-cols-2">
            {series.map((s) => (
              <li key={s.slug} className="border-t border-bg/30 pt-5">
                <Link
                  href={`/series/${s.slug}`}
                  className="text-3xl font-semibold tracking-tight hover:underline"
                >
                  {displayTitle(s.name)}
                </Link>
                <ol className="mt-3 space-y-1 text-bg/75">
                  {s.posts.map((p, i) => (
                    <li key={p.id}>
                      <Link href={postPath(p)} className="hover:text-bg">
                        {i + 1}. {displayTitle(p.title)}
                      </Link>
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
            <Link
              href={postPath(video)}
              className="mt-4 block text-2xl font-semibold tracking-tight hover:underline"
            >
              {displayTitle(video.title)}
            </Link>
          </div>
          <YouTubeFacade
            url={video.youtubeUrl}
            title={displayTitle(video.title)}
            className="rounded-[1.25rem]"
          />
        </section>
      )}
    </>
  )
}
