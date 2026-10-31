import { demoReviewer } from '@mosaic/content/payload'
import type { Payload } from 'payload'
import { seed } from './run'

/**
 * Nightly reset of the public demo: fresh demo seed data and exactly one user, the
 * read-only reviewer, with its published password.
 */
export async function resetDemo(payload: Payload): Promise<Record<string, number>> {
  const counts = await seed(payload, 'demo')
  await payload.delete({
    collection: 'users',
    where: { email: { not_equals: demoReviewer.email } },
  })
  const { docs } = await payload.find({
    collection: 'users',
    where: { email: { equals: demoReviewer.email } },
    limit: 1,
  })
  const data = { ...demoReviewer, role: 'reviewer' as const }
  const [existing] = docs
  if (existing) {
    await payload.update({ collection: 'users', id: existing.id, data })
  } else {
    await payload.create({ collection: 'users', data, context: { keepRole: true } })
  }
  return counts
}
