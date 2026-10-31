import { RichText } from '@mosaic/ui'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PosterWall } from '../../../components/PosterWall'
import { YouTubeFacade } from '../../../components/YouTubeFacade'
import {
  allSeries,
  brandPosts,
  displayTitle,
  excerpt,
  formatDate,
  postPath,
  typeFromSlug,
  typeLabel,
  typeSingular,
  typeSlug,
} from '../../../lib/content'
import { automaticLabel } from '../../../lib/labels'
import { typeColor } from '../../../lib/palette'
import { toPoster } from '../../../lib/posters'
import { BRAND_URL } from '../../../lib/site'

interface Props {
  params: Promise<{ kind: string; slug: string }>
}

export function generateStaticParams() {
  const paths = brandPosts().map((p) => ({ kind: typeSlug[p.type], slug: p.slug }))
  return paths.length > 0 ? paths : [{ kind: '_', slug: '_' }]
}

export const dynamicParams = false

function find(kind: string, slug: string) {
  const type = typeFromSlug(kind)
  return brandPosts().find((p) => p.type === type && p.slug === slug) ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kind, slug } = await params
  const post = find(kind, slug)
  if (!post) return {}
  const description = excerpt(post, 160)
  return {
    title: displayTitle(post.title),
    description,
    openGraph: {
      type: 'article',
      title: displayTitle(post.title),
      description,
      url: `${BRAND_URL}${postPath(post)}`,
    },
  }
}

// One post, coloured by its kind. Concepts and analysis carry their labels; videos lead
// with the player; research and book notes list their sources.
export default async function PostPage({ params }: Props) {
  const { kind, slug } = await params
  const post = find(kind, slug)
  if (!post) notFound()

  const color = typeColor[post.type]
  const label = automaticLabel(post.type, post.subject)
  const series = post.series
    ? allSeries(brandPosts()).find((s) => s.name === post.series)
    : undefined
  const place = series ? series.posts.findIndex((p) => p.id === post.id) : -1
  const previous = series && place > 0 ? series.posts[place - 1] : undefined
  const next = series && place >= 0 ? series.posts[place + 1] : undefined
  const more = brandPosts()
    .filter((p) => p.type === post.type && p.id !== post.id)
    .slice(0, 3)
  const references = post.references ?? []

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': post.type === 'video' ? 'VideoObject' : 'Article',
    headline: post.title,
    name: post.title,
    datePublished: post.publishedAt ?? undefined,
    uploadDate: post.type === 'video' ? (post.publishedAt ?? undefined) : undefined,
    author: { '@type': 'Person', name: 'Uvesh Menpurwala' },
    url: `${BRAND_URL}${postPath(post)}`,
  }

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header
        className="mx-5 rounded-[1.5rem] px-6 pt-10 pb-12 sm:mx-10 sm:px-12 sm:pt-14"
        style={{ background: color.bg, color: color.fg }}
      >
        <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold tracking-wide uppercase">
          <Link href={`/${typeSlug[post.type]}`} className="hover:underline">
            {typeSingular[post.type]}
          </Link>
          <span>{formatDate(post.publishedAt)}</span>
          {post._status === 'draft' && <span>Draft</span>}
        </p>
        <h1 className="mt-8 max-w-[20ch] font-serif text-[clamp(2.6rem,7vw,6.5rem)] leading-[0.95] italic">
          {displayTitle(post.title)}
        </h1>
        {label && (
          <p className="mt-8 inline-block border border-current px-2 py-0.5 text-sm font-semibold">
            {label}
          </p>
        )}
        {series && (
          <p className="mt-4 text-sm font-semibold">
            Part {place + 1} of {series.posts.length} in{' '}
            <Link href={`/series/${series.slug}`} className="underline underline-offset-4">
              {displayTitle(series.name)}
            </Link>
          </p>
        )}
      </header>

      {post.type === 'video' && post.youtubeUrl && (
        <div className="mx-auto mt-10 max-w-5xl px-5">
          <YouTubeFacade
            url={post.youtubeUrl}
            title={displayTitle(post.title)}
            className="rounded-[1.25rem] bg-surface"
          />
        </div>
      )}

      <div className="prose-brand mx-auto max-w-[46rem] px-5 py-14">
        <RichText value={post.body} />
      </div>

      {references.length > 0 && (
        <aside
          aria-labelledby="sources"
          className="mx-auto max-w-[46rem] border-t-2 border-fg px-5 pt-6 pb-10"
        >
          <h2 id="sources" className="font-serif text-3xl italic">
            Sources
          </h2>
          <ul className="mt-4 space-y-2">
            {references.map((r) => (
              <li key={r.url}>
                <a href={r.url} className="underline decoration-accent underline-offset-4">
                  {displayTitle(r.title)}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      )}

      {post.tags && post.tags.length > 0 && (
        <ul className="mx-auto flex max-w-[46rem] flex-wrap gap-2 px-5 pb-12" aria-label="Tags">
          {post.tags.map((tag) => (
            <li key={tag} className="rounded-full border border-line px-3 py-1 text-sm text-muted">
              {tag}
            </li>
          ))}
        </ul>
      )}

      {(previous ?? next) && (
        <nav
          aria-label="In this series"
          className="mx-5 grid gap-4 border-y-2 border-fg py-6 sm:mx-10 sm:grid-cols-2"
        >
          {previous ? (
            <Link href={postPath(previous)} className="group">
              <span className="text-sm text-muted">← Previous in the series</span>
              <span className="mt-1 block font-serif text-2xl italic group-hover:underline">
                {displayTitle(previous.title)}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={postPath(next)} className="group sm:text-right">
              <span className="text-sm text-muted">Next in the series →</span>
              <span className="mt-1 block font-serif text-2xl italic group-hover:underline">
                {displayTitle(next.title)}
              </span>
            </Link>
          )}
        </nav>
      )}

      {more.length > 0 && (
        <section aria-labelledby="more" className="px-5 py-16 sm:px-10">
          <h2 id="more" className="mb-8 font-serif text-[clamp(2.2rem,5vw,4rem)] italic">
            More {typeLabel[post.type].toLowerCase()}
          </h2>
          <PosterWall types={[]} posters={more.map(toPoster)} />
        </section>
      )}
    </article>
  )
}
