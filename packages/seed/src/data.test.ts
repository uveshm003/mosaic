import { listingProfileKeys } from '@mosaic/content'
import { demoStatuses, postTypes, richTextBlocks } from '@mosaic/content/payload'
import { describe, expect, it } from 'vitest'
import { SeedData } from './data'

const techIds = [1, 2, 3, 4, 5, 6]
const mediaIds = [10, 11, 12, 13]

describe('SeedData', () => {
  it('is deterministic', () => {
    expect(new SeedData('dev').projects(techIds, mediaIds)).toEqual(
      new SeedData('dev').projects(techIds, mediaIds),
    )
  })

  it('prefixes dev titles with "Sample:" and leaves demo titles plain', () => {
    const dev = new SeedData('dev')
    const demo = new SeedData('demo')
    for (const doc of [...dev.projects(techIds, mediaIds), ...dev.posts(mediaIds)]) {
      expect(doc.title).toMatch(/^Sample: /)
    }
    expect(demo.projects(techIds, mediaIds).some((doc) => doc.title.startsWith('Sample:'))).toBe(
      false,
    )
  })

  it('marks every document as seeded', () => {
    const data = new SeedData('dev')
    const docs = [
      ...data.tech(),
      ...data.projects(techIds, mediaIds),
      ...data.posts(mediaIds),
      ...data.services(),
      ...data.testimonials([1, 2, 3, 4]),
      ...data.inquiries(),
      ...data.experience(),
      ...data.education(),
      ...data.skills(),
      data.person(),
      data.profiles(),
      data.brandSettings(),
      data.siteSettings(),
    ]
    expect(docs.every((doc) => doc._seed === true)).toBe(true)
  })

  it('covers every profile, demo status and post type', () => {
    const data = new SeedData('dev')
    const projects = data.projects(techIds, mediaIds)
    const posts = data.posts(mediaIds)
    for (const profile of listingProfileKeys) {
      expect(projects.some((doc) => doc.profiles?.includes(profile))).toBe(true)
    }
    expect(new Set(projects.map((doc) => doc.demoStatus))).toEqual(new Set(demoStatuses))
    expect(new Set(posts.map((doc) => doc.type))).toEqual(new Set(postTypes))
  })

  it('puts every rich-text block in one post', () => {
    const [first] = new SeedData('dev').posts(mediaIds)
    const blockTypes = (first?.body?.root.children ?? []).flatMap((node) =>
      'fields' in node && typeof node.fields === 'object' && node.fields !== null
        ? [(node.fields as { blockType?: unknown }).blockType]
        : [],
    )
    expect(new Set(blockTypes)).toEqual(new Set(richTextBlocks.map((b) => b.slug)))
  })

  it('includes the edge cases', () => {
    const data = new SeedData('dev')
    const projects = data.projects(techIds, mediaIds)
    const posts = data.posts(mediaIds)
    expect(projects.some((doc) => doc.title.length > 100)).toBe(true)
    expect(projects.some((doc) => doc.media?.length === 0)).toBe(true)
    expect(projects.some((doc) => doc.tech?.length === techIds.length)).toBe(true)
    expect(projects.some((doc) => doc.summary === null && doc.body === null)).toBe(true)
    expect(posts.some((doc) => (doc.tags?.length ?? 0) >= 30)).toBe(true)
  })

  it('never publishes a restricted project or an unconsented testimonial', () => {
    const data = new SeedData('dev')
    for (const doc of data.projects(techIds, mediaIds)) {
      if (doc._status === 'published') expect(doc.confidentiality).toBe('public')
    }
    for (const doc of data.testimonials([1, 2, 3, 4])) {
      if (doc._status === 'published') expect(doc.consentConfirmed).toBe(true)
    }
  })
})
