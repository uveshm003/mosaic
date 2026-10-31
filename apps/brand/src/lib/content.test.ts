import type { Post } from '@mosaic/content/payload-types'
import { describe, expect, it } from 'vitest'
import {
  allSeries,
  excerpt,
  postPath,
  slugify,
  typeFromSlug,
  typeSlug,
  typesWithPosts,
} from './content'
import { buildRss } from './rss'

const body = (text: string): NonNullable<Post['body']> => ({
  root: {
    type: 'root',
    direction: null,
    format: '',
    indent: 0,
    version: 1,
    children: [{ type: 'paragraph', version: 1, children: [{ type: 'text', text, version: 1 }] }],
  },
})

function post(fields: Partial<Post>): Post {
  return {
    id: 1,
    title: 'A post',
    slug: 'a-post',
    site: 'brand',
    type: 'essay',
    publishedAt: '2026-05-01T00:00:00.000Z',
    _status: 'published',
    updatedAt: '',
    createdAt: '',
    ...fields,
  }
}

describe('brand content', () => {
  it('lists only types that have posts, in navigation order', () => {
    const posts = [post({ type: 'video' }), post({ type: 'essay' }), post({ type: 'video' })]
    expect(typesWithPosts(posts)).toEqual(['essay', 'video'])
  })

  it('maps every type to a unique URL segment and back', () => {
    const slugs = Object.values(typeSlug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const [type, slug] of Object.entries(typeSlug)) expect(typeFromSlug(slug)).toBe(type)
    expect(typeFromSlug('nope')).toBeNull()
    expect(postPath(post({ type: 'brand-breakdown', slug: 'x' }))).toBe('/breakdowns/x')
  })

  it('groups series and orders each oldest first', () => {
    const series = allSeries([
      post({ id: 2, series: 'Sample: Sameness', publishedAt: '2026-06-01T00:00:00Z' }),
      post({ id: 1, series: 'Sample: Sameness', publishedAt: '2026-01-01T00:00:00Z' }),
      post({ id: 3 }),
    ])
    expect(series).toHaveLength(1)
    expect(series[0]?.slug).toBe('sameness')
    expect(series[0]?.posts.map((p) => p.id)).toEqual([1, 2])
  })

  it('slugifies names with ampersands and punctuation', () => {
    expect(slugify('Kettle & Co.: Rituals!')).toBe('kettle-and-co-rituals')
  })

  it('takes the first paragraph as the excerpt and trims it', () => {
    expect(excerpt(post({ body: body('Short.') }))).toBe('Short.')
    expect(excerpt(post({ body: body('x'.repeat(50)) }), 10)).toBe(`${'x'.repeat(9)}…`)
    expect(excerpt(post({ body: null }))).toBe('')
  })
})

describe('buildRss', () => {
  const feed = { title: 'Studio & Co', url: 'https://example.com/brand', description: 'Notes' }

  it('escapes text and links each published post', () => {
    const xml = buildRss(
      [
        post({
          title: 'Tea <and> "rituals"',
          type: 'brand-breakdown',
          slug: 'tea',
          body: body('A & B'),
        }),
      ],
      feed,
    )
    expect(xml).toContain('<title>Studio &amp; Co</title>')
    expect(xml).toContain('<title>Tea &lt;and&gt; &quot;rituals&quot;</title>')
    expect(xml).toContain('<link>https://example.com/brand/breakdowns/tea</link>')
    expect(xml).toContain('<description>A &amp; B</description>')
  })

  it('leaves out drafts and undated posts', () => {
    const xml = buildRss([post({ _status: 'draft' }), post({ publishedAt: null })], feed)
    expect(xml).not.toContain('<item>')
  })
})
