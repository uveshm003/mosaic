import { globals } from '@mosaic/content/payload'
import type { Field, Payload } from 'payload'
import sharp from 'sharp'
import { SeedData, type SeedVariant } from './data'

// Dependents first, so nothing points at a deleted document mid-purge.
const seededCollections = [
  'testimonials',
  'projects',
  'posts',
  'services',
  'inquiries',
  'experience',
  'education',
  'skills',
  'tech',
  'media',
] as const

type Counts = Record<string, number>

function blankValues(fields: Field[]): Record<string, unknown> {
  const values: Record<string, unknown> = {}
  for (const field of fields) {
    if ('name' in field) {
      if (field.type === 'array') values[field.name] = []
      else if (field.type === 'group') values[field.name] = blankValues(field.fields)
      else if (field.type === 'checkbox') values[field.name] = false
      else values[field.name] = null
    } else if ('fields' in field) {
      Object.assign(values, blankValues(field.fields))
    }
  }
  return values
}

export async function purge(payload: Payload): Promise<Counts> {
  const counts: Counts = {}
  for (const collection of seededCollections) {
    const { docs, errors } = await payload.delete({
      collection,
      where: { _seed: { equals: true } },
    })
    if (errors.length > 0) {
      throw new Error(`Purge failed for ${collection}: ${JSON.stringify(errors)}`)
    }
    counts[collection] = docs.length
  }
  for (const global of globals) {
    const slug = global.slug as 'person' | 'profiles' | 'brandSettings' | 'siteSettings'
    const current = await payload.findGlobal({ slug, draft: true })
    if (current._seed) {
      const data = blankValues(global.fields)
      await payload.updateGlobal({
        slug,
        data: global.versions ? { ...data, _status: 'published' } : data,
      })
      counts[slug] = 1
    }
  }
  return counts
}

async function image(
  index: number,
): Promise<{ data: Buffer; mimetype: string; name: string; size: number }> {
  const hue = (index * 67) % 360
  const data = await sharp({
    create: { width: 1600, height: 1000, channels: 3, background: `hsl(${String(hue)}, 45%, 55%)` },
  })
    .png()
    .toBuffer()
  return { data, mimetype: 'image/png', name: `seed-${String(index + 1)}.png`, size: data.length }
}

async function createAll<T>(items: T[], create: (item: T) => Promise<{ id: number }>) {
  const ids: number[] = []
  for (const item of items) ids.push((await create(item)).id)
  return ids
}

/** Purges earlier seed data, then writes a fresh deterministic set. */
export async function seed(payload: Payload, variant: SeedVariant): Promise<Counts> {
  await purge(payload)
  const data = new SeedData(variant)
  const counts: Counts = {}

  const techIds = await createAll(data.tech(), (doc) =>
    payload.create({ collection: 'tech', data: doc }),
  )
  const mediaIds = await createAll([0, 1, 2, 3], async (index) =>
    payload.create({
      collection: 'media',
      data: { alt: data.label(`Placeholder image ${String(index + 1)}`), _seed: true },
      file: await image(index),
    }),
  )
  const projectIds = await createAll(data.projects(techIds, mediaIds), (doc) =>
    payload.create({ collection: 'projects', data: doc, draft: doc._status === 'draft' }),
  )
  const postIds = await createAll(data.posts(mediaIds), (doc) =>
    payload.create({ collection: 'posts', data: doc, draft: doc._status === 'draft' }),
  )
  const serviceIds = await createAll(data.services(), (doc) =>
    payload.create({ collection: 'services', data: doc }),
  )
  const testimonialIds = await createAll(data.testimonials(projectIds), (doc) =>
    payload.create({ collection: 'testimonials', data: doc, draft: doc._status === 'draft' }),
  )
  const inquiryIds = await createAll(data.inquiries(), (doc) =>
    payload.create({ collection: 'inquiries', data: doc }),
  )
  const experienceIds = await createAll(data.experience(), (doc) =>
    payload.create({ collection: 'experience', data: doc }),
  )
  const educationIds = await createAll(data.education(), (doc) =>
    payload.create({ collection: 'education', data: doc }),
  )
  const skillIds = await createAll(data.skills(), (doc) =>
    payload.create({ collection: 'skills', data: doc }),
  )

  await payload.updateGlobal({ slug: 'person', data: data.person() })
  await payload.updateGlobal({ slug: 'profiles', data: data.profiles() })
  await payload.updateGlobal({ slug: 'brandSettings', data: data.brandSettings() })
  await payload.updateGlobal({ slug: 'siteSettings', data: data.siteSettings() })

  Object.assign(counts, {
    tech: techIds.length,
    media: mediaIds.length,
    projects: projectIds.length,
    posts: postIds.length,
    services: serviceIds.length,
    testimonials: testimonialIds.length,
    inquiries: inquiryIds.length,
    experience: experienceIds.length,
    education: educationIds.length,
    skills: skillIds.length,
  })
  return counts
}
