import { z } from 'zod'
import type {
  BrandSetting,
  Education,
  Experience,
  Media,
  Person,
  Post,
  Profile,
  Project,
  Service,
  SiteSetting,
  Skill,
  Tech,
  Testimonial,
} from '../payload-types'
import { appEnvSchema } from '../env'

export const SNAPSHOT_VERSION = 1

/** Snapshot location relative to the repo root. Generated in CI, never committed. */
export const SNAPSHOT_PATH = 'packages/content/snapshot/snapshot.json'

export interface Snapshot {
  version: typeof SNAPSHOT_VERSION
  generatedAt: string
  appEnv: z.infer<typeof appEnvSchema>
  drafts: boolean
  collections: {
    projects: Project[]
    posts: Post[]
    services: Service[]
    testimonials: Testimonial[]
    experience: Experience[]
    education: Education[]
    skills: Skill[]
    tech: Tech[]
    media: Media[]
  }
  globals: {
    person: Person
    profiles: Profile
    brandSettings: BrandSetting
    siteSettings: SiteSetting
  }
}

export const snapshotCollections = [
  'projects',
  'posts',
  'services',
  'testimonials',
  'experience',
  'education',
  'skills',
  'tech',
  'media',
] as const satisfies readonly (keyof Snapshot['collections'])[]

export const snapshotGlobals = [
  'person',
  'profiles',
  'brandSettings',
  'siteSettings',
] as const satisfies readonly (keyof Snapshot['globals'])[]

const doc = z.looseObject({ id: z.number(), _seed: z.boolean().nullish() })
const global = z.looseObject({ _seed: z.boolean().nullish() })

// Checks the envelope and the fields the build guards rely on. Document bodies come
// from Payload's generated types and are trusted as written by the export.
export const snapshotSchema = z.object({
  version: z.literal(SNAPSHOT_VERSION),
  generatedAt: z.iso.datetime(),
  appEnv: appEnvSchema,
  drafts: z.boolean(),
  collections: z.object(
    Object.fromEntries(snapshotCollections.map((name) => [name, z.array(doc)])) as Record<
      (typeof snapshotCollections)[number],
      z.ZodArray<typeof doc>
    >,
  ),
  globals: z.object(
    Object.fromEntries(snapshotGlobals.map((name) => [name, global])) as Record<
      (typeof snapshotGlobals)[number],
      typeof global
    >,
  ),
})

export function parseSnapshot(json: unknown): Snapshot {
  return snapshotSchema.parse(json) as unknown as Snapshot
}
