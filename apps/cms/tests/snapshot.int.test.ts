import { buildSnapshot, parseSnapshot, productionSnapshotError } from '@mosaic/content/snapshot'
import { purge, seed } from '@mosaic/seed'
import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import config from '../src/payload.config'

let payload: Payload

beforeAll(async () => {
  payload = await getPayload({ config })
  await seed(payload, 'dev')
})

afterAll(async () => {
  await purge(payload)
  await payload.destroy()
})

describe('buildSnapshot', () => {
  it('exports published documents only', async () => {
    const snapshot = await buildSnapshot(payload, { appEnv: 'test', drafts: false })
    const docs = [...snapshot.collections.projects, ...snapshot.collections.posts]
    expect(docs.length).toBeGreaterThan(0)
    expect(docs.every((doc) => doc._status === 'published')).toBe(true)
    expect(snapshot.collections.projects.every((doc) => doc.confidentiality === 'public')).toBe(
      true,
    )
  })

  it('exports only testimonials with consent', async () => {
    const snapshot = await buildSnapshot(payload, { appEnv: 'test', drafts: false })
    expect(snapshot.collections.testimonials.length).toBeGreaterThan(0)
    expect(snapshot.collections.testimonials.every((doc) => doc.consentConfirmed)).toBe(true)
  })

  it('never exports inquiries or users', async () => {
    const snapshot = await buildSnapshot(payload, { appEnv: 'test', drafts: false })
    expect(Object.keys(snapshot.collections)).not.toContain('inquiries')
    expect(Object.keys(snapshot.collections)).not.toContain('users')
  })

  it('includes drafts when asked', async () => {
    const published = await buildSnapshot(payload, { appEnv: 'test', drafts: false })
    const withDrafts = await buildSnapshot(payload, { appEnv: 'test', drafts: true })
    expect(withDrafts.collections.posts.length).toBeGreaterThan(published.collections.posts.length)
  })

  it('round-trips through the schema', async () => {
    const snapshot = await buildSnapshot(payload, { appEnv: 'test', drafts: false })
    const parsed = parseSnapshot(JSON.parse(JSON.stringify(snapshot)))
    expect(parsed.collections.projects.length).toBe(snapshot.collections.projects.length)
  })

  it('is refused for production while it holds seed data, and passes once purged', async () => {
    const seeded = await buildSnapshot(payload, { appEnv: 'production', drafts: false })
    expect(productionSnapshotError(seeded)).toMatch(/seed data/)
    await purge(payload)
    const clean = await buildSnapshot(payload, { appEnv: 'production', drafts: false })
    expect(productionSnapshotError(clean)).toBeNull()
  })
})
