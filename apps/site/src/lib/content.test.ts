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
      product: { enabled: false },
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
    // Freelance is enabled but has no pages yet, so nothing may link to it.
    expect(content.enabledProfiles().map(({ key }) => key)).toEqual(['flutter'])
    expect(content.isEnabled('root')).toBe(true)
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
