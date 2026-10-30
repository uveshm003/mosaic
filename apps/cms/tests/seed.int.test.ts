import { purge, seed } from '@mosaic/seed'
import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import config from '../src/payload.config'

let payload: Payload

beforeAll(async () => {
  payload = await getPayload({ config })
})

afterAll(async () => {
  await purge(payload)
  await payload.destroy()
})

const seeded = { _seed: { equals: true } } as const

describe('seed', () => {
  it('fills every seeded collection and global', async () => {
    const counts = await seed(payload, 'dev')
    for (const [collection, count] of Object.entries(counts)) {
      expect(count, collection).toBeGreaterThan(0)
    }
    const person = await payload.findGlobal({ slug: 'person' })
    expect(person._seed).toBe(true)
    expect(person.name).toMatch(/^Sample: /)
  })

  it('replaces earlier seed data instead of duplicating it', async () => {
    const before = await payload.count({ collection: 'projects', where: seeded })
    await seed(payload, 'dev')
    const after = await payload.count({ collection: 'projects', where: seeded })
    expect(after.totalDocs).toBe(before.totalDocs)
  })

  it('generates image sizes for seeded media', async () => {
    const { docs } = await payload.find({ collection: 'media', where: seeded, limit: 1 })
    expect(docs[0]?.sizes?.w768?.width).toBe(768)
  })
})

describe('purge', () => {
  it('removes every seeded document and blanks seeded globals', async () => {
    const real = await payload.create({
      collection: 'tech',
      data: { name: 'Real tech entry', kind: 'tool' },
    })
    await purge(payload)
    for (const collection of ['projects', 'posts', 'media', 'tech', 'inquiries'] as const) {
      const { totalDocs } = await payload.count({ collection, where: seeded })
      expect(totalDocs, collection).toBe(0)
    }
    const person = await payload.findGlobal({ slug: 'person' })
    expect(person._seed).toBe(false)
    expect(person.name).toBeNull()
    // Real content survives.
    const kept = await payload.findByID({ collection: 'tech', id: real.id })
    expect(kept.name).toBe('Real tech entry')
    await payload.delete({ collection: 'tech', id: real.id })
  })
})
