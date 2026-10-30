import type { Payload } from 'payload'
import type { AppEnv } from '../env'
import { mediaFieldsByBlock } from '../payload/block-media'
import type { Person, Post, Project } from '../payload-types'
import { SNAPSHOT_VERSION, type Snapshot } from './schema'

function mediaId(ref: unknown): number | null {
  if (typeof ref === 'number') return ref
  if (typeof ref === 'object' && ref !== null && 'id' in ref && typeof ref.id === 'number') {
    return ref.id
  }
  return null
}

/** Media referenced by image and Flutter demo blocks anywhere in a Lexical document. */
export function richTextMediaRefs(value: unknown): unknown[] {
  const refs: unknown[] = []
  const visit = (node: unknown): void => {
    if (typeof node !== 'object' || node === null) return
    const { type, fields, children, root } = node as Record<string, unknown>
    if (type === 'block' && typeof fields === 'object' && fields !== null) {
      const blockFields = fields as Record<string, unknown>
      for (const name of mediaFieldsByBlock[String(blockFields.blockType)] ?? []) {
        refs.push(blockFields[name])
      }
    }
    if (Array.isArray(children)) children.forEach(visit)
    visit(root)
  }
  visit(value)
  return refs
}

// Only images that exported content uses leave the admin, so uploads for restricted or
// draft work stay private.
export function referencedMediaIds(content: {
  projects: Project[]
  posts: Post[]
  person: Person
}): number[] {
  const refs: unknown[] = [
    ...content.projects.flatMap((project) => [
      ...(project.media ?? []),
      ...richTextMediaRefs(project.body),
    ]),
    ...content.posts.flatMap((post) => [post.cover, ...richTextMediaRefs(post.body)]),
    ...richTextMediaRefs(content.person.about),
  ]
  const ids = refs.map(mediaId).filter((id): id is number => id !== null)
  return [...new Set(ids)]
}

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

  const [projects, posts, services, testimonials, experience, education, skills, tech] =
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
    ])
  const [person, profiles, brandSettings, siteSettings] = await Promise.all([
    payload.findGlobal({ slug: 'person', draft: drafts }),
    payload.findGlobal({ slug: 'profiles' }),
    payload.findGlobal({ slug: 'brandSettings' }),
    payload.findGlobal({ slug: 'siteSettings' }),
  ])
  const mediaIds = referencedMediaIds({ projects: projects.docs, posts: posts.docs, person })
  const media = await payload.find({
    collection: 'media',
    ...all,
    where: { id: { in: mediaIds } },
  })

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
