import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import config from '../src/payload.config'

let payload: Payload

const project = {
  title: 'Sample: Project',
  slug: 'sample-project',
  demoStatus: 'repo-only',
  kind: 'personal',
} as const

beforeAll(async () => {
  payload = await getPayload({ config })
  for (const collection of ['testimonials', 'projects', 'users'] as const) {
    await payload.delete({ collection, where: { id: { exists: true } } })
  }
})

afterAll(async () => {
  await payload.destroy()
})

describe('users', () => {
  it('makes the first user an admin and later users reviewers', async () => {
    const first = await payload.create({
      collection: 'users',
      data: { email: 'admin@example.com', password: 'password-1234', role: 'reviewer' },
    })
    const second = await payload.create({
      collection: 'users',
      data: { email: 'reviewer@example.com', password: 'password-1234', role: 'reviewer' },
    })
    expect(first.role).toBe('admin')
    expect(second.role).toBe('reviewer')
  })

  it('refuses anonymous reads', async () => {
    await expect(payload.find({ collection: 'users', overrideAccess: false })).rejects.toThrow(
      /not allowed/,
    )
  })

  it('stops reviewers from writing', async () => {
    const { docs } = await payload.find({
      collection: 'users',
      where: { email: { equals: 'reviewer@example.com' } },
    })
    const [user] = docs
    if (!user) throw new Error('reviewer not created')
    const reviewer = { ...user, collection: 'users' as const }
    await expect(
      payload.create({
        collection: 'projects',
        data: { ...project, slug: 'reviewer-attempt' },
        overrideAccess: false,
        user: reviewer,
      }),
    ).rejects.toThrow(/not allowed/)
  })
})

describe('projects', () => {
  it('defaults to restricted and saves as a draft', async () => {
    const doc = await payload.create({ collection: 'projects', data: project, draft: true })
    expect(doc.confidentiality).toBe('restricted')
    expect(doc._status).toBe('draft')
  })

  it('refuses to publish a restricted project', async () => {
    await expect(
      payload.create({
        collection: 'projects',
        data: { ...project, slug: 'restricted-published', _status: 'published' },
      }),
    ).rejects.toThrow(/Restricted projects/)
  })

  it('publishes a public project', async () => {
    const doc = await payload.create({
      collection: 'projects',
      data: {
        ...project,
        slug: 'public-published',
        confidentiality: 'public',
        _status: 'published',
      },
    })
    expect(doc._status).toBe('published')
  })

  it('rejects two overrides for one profile', async () => {
    await expect(
      payload.create({
        collection: 'projects',
        data: {
          ...project,
          slug: 'duplicate-overrides',
          confidentiality: 'public',
          _status: 'published',
          overrides: [{ profile: 'flutter' }, { profile: 'flutter' }],
        },
      }),
    ).rejects.toThrow(/Overrides/)
  })
})

describe('testimonials', () => {
  const testimonial = { quote: 'Sample quote', name: 'Sample Person' }

  it('refuses to publish without consent', async () => {
    await expect(
      payload.create({
        collection: 'testimonials',
        data: { ...testimonial, _status: 'published' },
      }),
    ).rejects.toThrow(/consent/)
  })

  it('publishes once consent is confirmed', async () => {
    const doc = await payload.create({
      collection: 'testimonials',
      data: { ...testimonial, consentConfirmed: true, _status: 'published' },
    })
    expect(doc._status).toBe('published')
  })
})
