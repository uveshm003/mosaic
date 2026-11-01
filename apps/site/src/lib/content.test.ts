import { describe, expect, it, vi } from 'vitest'
import * as content from './content'

const fixture = {
  globals: {
    person: { name: 'Person' },
    profiles: {
      root: { enabled: true },
      flutter: {
        enabled: true,
        tagline: 'Flutter tagline',
        primaryAction: { label: 'GitHub', url: 'https://github.com' },
      },
      product: { enabled: true },
      freelance: { enabled: true },
      fullstack: {},
    },
  },
  collections: {
    projects: [
      {
        id: 1,
        slug: 'one',
        title: 'Base title',
        summary: 'Base summary',
        profiles: ['flutter', 'freelance'],
        platforms: ['android'],
        tech: [{ id: 9, name: 'Dart' }, 10],
        demoStatus: 'live',
        kind: 'work',
        overrides: [
          { profile: 'freelance', title: 'Freelance title', highlights: [{ text: 'Shipped' }] },
        ],
      },
      {
        id: 2,
        slug: 'two',
        title: 'Product only',
        profiles: ['product'],
        demoStatus: 'private',
        kind: 'personal',
      },
    ],
    posts: [
      { id: 1, title: 'Older', profiles: ['flutter'], publishedAt: '2026-01-01T00:00:00Z' },
      { id: 2, title: 'Newer', profiles: ['flutter'], publishedAt: '2026-06-01T00:00:00Z' },
      { id: 3, title: 'Brand', profiles: [] },
    ],
    experience: [
      {
        id: 1,
        title: 'Engineer',
        employer: 'Older Co',
        period: { start: '2024-01-01T00:00:00Z' },
        highlights: [{ text: 'Everywhere' }, { text: 'Flutter wording', variants: ['flutter'] }],
      },
      {
        id: 2,
        title: 'Engineer',
        employer: 'Newer Co',
        period: { start: '2025-01-01T00:00:00Z' },
        highlights: [{ text: 'Broad wording', variants: ['broad'] }],
      },
      { id: 3, title: 'Engineer', employer: 'Product only', variants: ['product-company'] },
    ],
    skills: [
      { id: 1, name: 'Kotlin', category: 'Languages', order: 2, variants: ['flutter'] },
      { id: 2, name: 'Dart', category: 'Languages', order: 1 },
      { id: 3, name: 'Kotlin', category: 'Languages', order: 0, variants: ['broad'] },
    ],
  },
}

// Hoisted above the import by Vitest.
vi.mock('./snapshot', () => ({ getSnapshot: () => fixture }))

describe('projects', () => {
  it('lists a profile’s projects with base wording', () => {
    const [project] = content.projectsFor('flutter')
    expect(project).toMatchObject({
      title: 'Base title',
      summary: 'Base summary',
      tech: ['Dart'],
      highlights: [],
    })
    expect(content.projectsFor('flutter')).toHaveLength(1)
  })

  it('applies the profile’s override and falls back for missing fields', () => {
    expect(content.projectFor('freelance', 'one')).toMatchObject({
      title: 'Freelance title',
      summary: 'Base summary',
      highlights: ['Shipped'],
    })
  })

  it('returns null for a slug outside the profile', () => {
    expect(content.projectFor('flutter', 'two')).toBeNull()
  })
})

describe('profiles', () => {
  it('defaults unset settings', () => {
    expect(content.profile('fullstack')).toEqual({
      enabled: false,
      title: null,
      tagline: null,
      primaryAction: { label: null, url: null },
    })
  })

  it('lists only profiles that are enabled and built', () => {
    // Full-stack is built but disabled in this fixture, so nothing may link to it.
    expect(content.enabledProfiles().map(({ key }) => key)).toEqual([
      'flutter',
      'product',
      'freelance',
    ])
    expect(content.isEnabled('root')).toBe(true)
  })
})

describe('resume entries', () => {
  it('keeps one variant’s roles and bullets, newest first', () => {
    expect(
      content.experience('flutter').map((r) => [r.employer, r.highlights?.map((h) => h.text)]),
    ).toEqual([
      ['Newer Co', []],
      ['Older Co', ['Everywhere', 'Flutter wording']],
    ])
  })

  it('groups one variant’s skills in order', () => {
    expect(content.skillsByCategory('flutter')).toMatchObject([
      { category: 'Languages', skills: [{ name: 'Dart' }, { name: 'Kotlin', id: 1 }] },
    ])
  })
})

describe('postsFor', () => {
  it('returns the profile’s posts, newest first', () => {
    expect(content.postsFor('flutter').map((post) => post.title)).toEqual(['Newer', 'Older'])
  })
})

describe('visibleTestimonials', () => {
  const base = { id: 1, quote: 'Q', name: 'N', updatedAt: '', createdAt: '' }

  it('hides the section when nothing is published with consent', () => {
    expect(
      content.visibleTestimonials([
        { ...base, consentConfirmed: false, _status: 'published' },
        { ...base, consentConfirmed: true, _status: 'draft' },
      ]),
    ).toEqual([])
  })

  it('keeps consented, published quotes, and filters by project when asked', () => {
    const ok = { ...base, consentConfirmed: true, _status: 'published' as const }
    const list = [
      { ...ok, id: 1, project: 7 },
      { ...ok, id: 2, project: 9 },
      { ...ok, id: 3, project: null },
    ]
    expect(content.visibleTestimonials(list).map((t) => t.id)).toEqual([1, 2, 3])
    expect(content.visibleTestimonials(list, [7]).map((t) => t.id)).toEqual([1, 3])
  })
})

describe('product helpers', () => {
  it('labels teardowns and proposals, never case studies', () => {
    expect(content.productLabel({ kind: 'teardown', subject: 'FreshCart' })).toBe(
      'Independent analysis. Not affiliated with FreshCart.',
    )
    expect(content.productLabel({ kind: 'proposal', subject: null })).toMatch(/companies discussed/)
    expect(content.productLabel({ kind: 'case-study', subject: 'X' })).toBeNull()
  })

  it('maps a canvas, keeps only absolute images, and drops an empty one', () => {
    const canvas = content.canvasOf({
      journey: [{ stage: 'Sign up', pain: 'Too many steps' }],
      decisions: [{ question: 'Q?', options: [{ text: 'A' }, { text: 'B' }], chosen: 'B' }],
      comparison: {
        before: [{ text: 'old' }],
        after: [{ text: 'new' }],
        beforeImage: { id: 1, url: '/api/media/file/a.png' },
        afterImage: { id: 2, url: 'https://cdn.example.com/b.png' },
      },
    } as Parameters<typeof content.canvasOf>[0])
    expect(canvas?.journey[0]).toEqual({
      stage: 'Sign up',
      userDoes: null,
      pain: 'Too many steps',
      fix: null,
    })
    expect(canvas?.decisions[0]?.options).toEqual(['A', 'B'])
    expect(canvas?.comparison?.beforeImage).toBeNull()
    expect(canvas?.comparison?.afterImage).toBe('https://cdn.example.com/b.png')
    expect(content.canvasOf({ journey: [], decisions: [], comparison: {} })).toBeNull()
  })
})

describe('formatPeriod', () => {
  it('is empty without a start, so the row can be left out', () => {
    expect(content.formatPeriod(null, null)).toBe('')
    expect(content.formatPeriod('2025-01-01T00:00:00Z', null)).toBe('Jan 2025 – Now')
  })
})
