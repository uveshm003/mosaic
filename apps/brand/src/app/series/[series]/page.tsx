import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  allSeries,
  brandPosts,
  displayTitle,
  excerpt,
  formatDate,
  postPath,
  typeSingular,
} from '../../../lib/content'
import { typeColor } from '../../../lib/palette'

interface Props {
  params: Promise<{ series: string }>
}

export function generateStaticParams() {
  const series = allSeries(brandPosts()).map((s) => ({ series: s.slug }))
  return series.length > 0 ? series : [{ series: '_' }]
}

export const dynamicParams = false

const find = (slug: string) => allSeries(brandPosts()).find((s) => s.slug === slug) ?? null

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const series = find((await params).series)
  return series ? { title: displayTitle(series.name) } : {}
}

// A series reads in order, so its posts are numbered oldest first.
export default async function SeriesPage({ params }: Props) {
  const series = find((await params).series)
  if (!series) notFound()

  return (
    <>
      <section className="px-5 pt-[6svh] pb-12 sm:px-10">
        <p className="text-sm font-semibold tracking-wide uppercase">
          Series · {series.posts.length} parts
        </p>
        <h1 className="mt-4 font-serif text-[clamp(3.5rem,11vw,9rem)] leading-[0.9] italic">
          {displayTitle(series.name)}
        </h1>
      </section>
      <ol className="mx-5 border-t-2 border-fg sm:mx-10">
        {series.posts.map((p, i) => (
          <li key={p.id} className="reveal border-b-2 border-fg">
            <Link
              href={postPath(p)}
              className="group grid grid-cols-[3rem_1fr] gap-x-6 gap-y-2 py-8 sm:grid-cols-[5rem_1fr_12rem]"
            >
              <span className="font-serif text-5xl italic" style={{ color: typeColor[p.type].bg }}>
                {i + 1}
              </span>
              <span>
                <span className="block text-[clamp(1.6rem,3vw,2.6rem)] leading-tight font-semibold tracking-tight group-hover:underline">
                  {displayTitle(p.title)}
                </span>
                <span className="mt-2 block max-w-2xl text-muted">{excerpt(p, 200)}</span>
              </span>
              <span className="text-sm text-muted max-sm:col-start-2 sm:text-right">
                {typeSingular[p.type]} · {formatDate(p.publishedAt, 'month')}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </>
  )
}
