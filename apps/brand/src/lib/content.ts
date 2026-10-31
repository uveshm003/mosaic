import type { Post } from '@mosaic/content/payload-types'
import type { Snapshot } from '@mosaic/content/snapshot'
import { getSnapshot } from './snapshot'

function snapshot(): Snapshot {
  const loaded = getSnapshot()
  if (!loaded) throw new Error('No content snapshot. Run `pnpm preview` to export dev content.')
  return loaded
}

export type BrandPostType = Post['type']

/** Brand-site posts, newest first. Drafts appear only in preview snapshots. */
export function brandPosts(): Post[] {
  return snapshot()
    .collections.posts.filter((p) => p.site === 'brand')
    .sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''))
}

export function brandName(): string {
  return getSnapshot()?.globals.brandSettings.name ?? 'Studio'
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

/** Post types in navigation order, keeping only those with posts. */
export function typesWithPosts(posts: Post[]): BrandPostType[] {
  const present = new Set(posts.map((p) => p.type))
  return (Object.keys(typeLabel) as BrandPostType[]).filter((t) => present.has(t))
}

/** The first paragraph of a post's body as plain text. */
export function excerpt(post: Post, max = 180): string {
  const root = (post.body as { root?: { children?: unknown[] } } | null | undefined)?.root
  for (const node of root?.children ?? []) {
    const children = (node as { type?: string; children?: { text?: string }[] }).children
    const text = (children ?? []).map((c) => c.text ?? '').join('')
    if (text) return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text
  }
  return ''
}

/** Strips the dev seed's "Sample: " prefix for display-heavy layouts. */
export const displayTitle = (title: string) => title.replace(/^Sample: /, '')

/** The personal site, outside the brand's /brand base path. */
export const personalSiteUrl = 'https://uveshm003.github.io/'
