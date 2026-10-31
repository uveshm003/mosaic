import { demoReviewer } from '@mosaic/content/payload'
import { purge, resetDemo } from '@mosaic/seed'
import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import config from '../src/payload.config'

let payload: Payload

beforeAll(async () => {
  payload = await getPayload({ config })
  await payload.delete({ collection: 'users', where: { id: { exists: true } } })
})

afterAll(async () => {
  payload.config.custom = { demo: false }
  await purge(payload)
  await payload.delete({ collection: 'users', where: { id: { exists: true } } })
  await payload.destroy()
})

describe('demo reset', () => {
  it('leaves only the reviewer, read-only, even on an empty database', async () => {
    await payload.create({
      collection: 'users',
      data: { email: 'visitor@example.com', password: 'password-1234', role: 'reviewer' },
    })
    await resetDemo(payload)
    const { docs } = await payload.find({ collection: 'users' })
    expect(docs.map(({ email, role }) => ({ email, role }))).toEqual([
      { email: demoReviewer.email, role: 'reviewer' },
    ])
  })

  it('restores the published password and seeds demo content', async () => {
    await resetDemo(payload)
    const { user } = await payload.login({ collection: 'users', data: demoReviewer })
    expect(user?.role).toBe('reviewer')
    const { docs } = await payload.find({
      collection: 'projects',
      where: { _seed: { equals: true } },
      limit: 50,
    })
    expect(docs.length).toBeGreaterThan(0)
    expect(docs.some((doc) => doc.title.startsWith('Sample:'))).toBe(false)
  })

  it('never promotes the first user on the demo admin', async () => {
    await payload.delete({ collection: 'users', where: { id: { exists: true } } })
    payload.config.custom = { demo: true }
    const first = await payload.create({
      collection: 'users',
      data: { email: 'first@example.com', password: 'password-1234', role: 'reviewer' },
    })
    expect(first.role).toBe('reviewer')
  })
})
