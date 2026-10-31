import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PosterWall } from '../../components/PosterWall'
import { brandPosts, typeFromSlug, typeLabel, typeSlug, typesWithPosts } from '../../lib/content'
import { automaticLabel } from '../../lib/labels'
import { toPoster } from '../../lib/posters'

interface Props {
  params: Promise<{ kind: string }>
}

const intro: Partial<Record<string, string>> = {
  essay: 'Arguments about brands, made at length.',
  'brand-breakdown': 'How brands that work actually work, taken apart.',
  'campaign-concept': 'Campaigns nobody asked for, pitched anyway.',
  'book-notes': 'What the books said, and what was worth keeping.',
  'research-note': 'Small studies, looked at closely.',
  video: 'The same thinking, out loud.',
}

// Only kinds with posts get a page. A static export needs at least one path; the
// placeholder renders as not found.
export function generateStaticParams() {
  const kinds = typesWithPosts(brandPosts()).map((t) => ({ kind: typeSlug[t] }))
  return kinds.length > 0 ? kinds : [{ kind: '_' }]
}

export const dynamicParams = false

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const type = typeFromSlug((await params).kind)
  return type ? { title: typeLabel[type] } : {}
}

export default async function Kind({ params }: Props) {
  const type = typeFromSlug((await params).kind)
  const posts = type ? brandPosts().filter((p) => p.type === type) : []
  if (!type || posts.length === 0) notFound()
  const label = automaticLabel(type)

  return (
    <>
      <section className="px-5 pt-[6svh] pb-12 sm:px-10">
        <h1 className="font-serif text-[clamp(3.5rem,12vw,10rem)] leading-[0.9] italic">
          {typeLabel[type]}
        </h1>
        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4 border-t-2 border-fg pt-5">
          <p className="max-w-xl text-lg">{intro[type]}</p>
          {label && <p className="border border-fg px-2 py-0.5 text-xs font-semibold">{label}</p>}
        </div>
      </section>
      <section aria-label={typeLabel[type]} className="px-5 pb-20 sm:px-10">
        <PosterWall types={[]} posters={posts.map(toPoster)} />
      </section>
    </>
  )
}
