import type { Post } from '@mosaic/content/payload-types'
import type { Snapshot } from '@mosaic/content/snapshot'
import { getSnapshot } from './snapshot'

export type BrandPostType = Post['type']

/** Brand-site posts, newest first. Drafts appear only in preview snapshots. */
export function brandPosts(source: Snapshot | null = getSnapshot()): Post[] {
  return (source?.collections.posts ?? [])
    .filter((p) => p.site === 'brand')
    .sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''))
}

/** The brand's name, a setting until the brand-name checkpoint. */
export function brandName(): string {
  return displayTitle(getSnapshot()?.globals.brandSettings.name ?? '') || 'Studio'
}

export const typeLabel: Record<BrandPostType, string> = {
  essay: 'Essays',
  'brand-breakdown': 'Breakdowns',
  'campaign-concept': 'Concepts',
  'book-notes': 'Book notes',
  'research-note': 'Research',
  video: 'Videos',
  teardown: 'Teardowns',
  'improvement-proposal': 'Proposals',
  'case-study': 'Case studies',
}

/** One of a type, for a post's own page. */
export const typeSingular: Record<BrandPostType, string> = {
  essay: 'Essay',
  'brand-breakdown': 'Breakdown',
  'campaign-concept': 'Concept',
  'book-notes': 'Book notes',
  'research-note': 'Research note',
  video: 'Video',
  teardown: 'Teardown',
  'improvement-proposal': 'Proposal',
  'case-study': 'Case study',
}

/** The URL segment for each type: /brand/<segment>/<post>. */
export const typeSlug: Record<BrandPostType, string> = {
  essay: 'essays',
  'brand-breakdown': 'breakdowns',
  'campaign-concept': 'concepts',
  'book-notes': 'book-notes',
  'research-note': 'research',
  video: 'videos',
  teardown: 'teardowns',
  'improvement-proposal': 'proposals',
  'case-study': 'case-studies',
}

export function typeFromSlug(slug: string): BrandPostType | null {
  const entry = Object.entries(typeSlug).find(([, s]) => s === slug)
  return entry ? (entry[0] as BrandPostType) : null
}

/** Post types in navigation order, keeping only those with posts. */
export function typesWithPosts(posts: Post[]): BrandPostType[] {
  const present = new Set(posts.map((p) => p.type))
  return (Object.keys(typeLabel) as BrandPostType[]).filter((t) => present.has(t))
}

export const postPath = (post: Pick<Post, 'type' | 'slug'>) =>
  `/${typeSlug[post.type]}/${post.slug}`

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export interface Series {
  name: string
  slug: string
  posts: Post[]
}

/** Every series, its posts oldest first so they read in order. */
export function allSeries(posts: Post[]): Series[] {
  const byName = new Map<string, Post[]>()
  for (const p of posts) {
    if (p.series) byName.set(p.series, [...(byName.get(p.series) ?? []), p])
  }
  return [...byName].map(([name, list]) => ({
    name,
    slug: slugify(displayTitle(name)),
    posts: [...list].sort((a, b) => (a.publishedAt ?? '').localeCompare(b.publishedAt ?? '')),
  }))
}

/** The first paragraph of a post's body as plain text. */
export function excerpt(post: Pick<Post, 'body'>, max = 180): string {
  const root = (post.body as { root?: { children?: unknown[] } } | null | undefined)?.root
  for (const node of root?.children ?? []) {
    const children = (node as { children?: { text?: string }[] }).children
    const text = (children ?? []).map((c) => c.text ?? '').join('')
    if (text) return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text
  }
  return ''
}

/** Drops the dev seed's "Sample: " prefix where display type would repeat it. */
export const displayTitle = (title: string) => title.replace(/^Sample: /, '')

export const formatDate = (iso: string | null | undefined, style: 'long' | 'month' = 'long') =>
  iso
    ? new Date(iso).toLocaleDateString(
        'en-GB',
        style === 'long'
          ? { day: 'numeric', month: 'long', year: 'numeric' }
          : { month: 'short', year: 'numeric' },
      )
    : ''
