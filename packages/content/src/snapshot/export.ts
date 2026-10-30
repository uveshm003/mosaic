import type { Payload } from 'payload'
import type { AppEnv } from '../env'
import { SNAPSHOT_VERSION, type Snapshot } from './schema'

/**
 * Reads content through the Local API. Published only by default; `drafts` gives the
 * latest version of everything for local preview. Inquiries and users never leave the admin.
 */
export async function buildSnapshot(
  payload: Payload,
  options: { appEnv: AppEnv; drafts: boolean },
): Promise<Snapshot> {
  const { drafts } = options
  const published = drafts ? {} : { _status: { equals: 'published' } as const }
  const all = { depth: 1, pagination: false } as const
  const versioned = { ...all, draft: drafts, where: published }

  const [projects, posts, services, testimonials, experience, education, skills, tech, media] =
    await Promise.all([
      payload.find({ collection: 'projects', ...versioned }),
      payload.find({ collection: 'posts', ...versioned }),
      payload.find({ collection: 'services', ...versioned }),
      payload.find({
        collection: 'testimonials',
        ...versioned,
        where: { ...published, consentConfirmed: { equals: true } },
      }),
      payload.find({ collection: 'experience', ...all }),
      payload.find({ collection: 'education', ...all }),
      payload.find({ collection: 'skills', ...all }),
      payload.find({ collection: 'tech', ...all }),
      payload.find({ collection: 'media', ...all }),
    ])
  const [person, profiles, brandSettings, siteSettings] = await Promise.all([
    payload.findGlobal({ slug: 'person', draft: drafts }),
    payload.findGlobal({ slug: 'profiles' }),
    payload.findGlobal({ slug: 'brandSettings' }),
    payload.findGlobal({ slug: 'siteSettings' }),
  ])

  return {
    version: SNAPSHOT_VERSION,
    generatedAt: new Date().toISOString(),
    appEnv: options.appEnv,
    drafts,
    collections: {
      projects: projects.docs,
      posts: posts.docs,
      services: services.docs,
      testimonials: testimonials.docs,
      experience: experience.docs,
      education: education.docs,
      skills: skills.docs,
      tech: tech.docs,
      media: media.docs,
    },
    globals: { person, profiles, brandSettings, siteSettings },
  }
}
