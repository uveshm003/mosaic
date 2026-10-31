import { postgresAdapter } from '@payloadcms/db-postgres'
import { buildConfig, type SanitizedConfig } from 'payload'
import { richTextEditor } from './blocks'
import sharp from 'sharp'
import { Inquiries } from './collections/inquiries'
import { Media } from './collections/media'
import { Posts } from './collections/posts'
import { Projects } from './collections/projects'
import { Education, Experience, Skills } from './collections/resume'
import { Services } from './collections/services'
import { Tech } from './collections/tech'
import { Testimonials } from './collections/testimonials'
import { Users } from './collections/users'
import { demoReviewer } from './demo'
import type { CollectionConfig, GlobalConfig } from 'payload'
import { seedFlagField } from './fields'
import { BrandSettings, Person, Profiles, SiteSettings } from './globals'

export const collections: CollectionConfig[] = [
  Projects,
  Posts,
  Services,
  Testimonials,
  Inquiries,
  Experience,
  Education,
  Skills,
  Tech,
  Media,
  Users,
].map((collection) =>
  // Users are never seeded; demo reviewers are created by the demo reset.
  collection.slug === 'users'
    ? collection
    : { ...collection, fields: [...collection.fields, seedFlagField] },
)

export const globals: GlobalConfig[] = [Person, Profiles, BrandSettings, SiteSettings].map(
  (global) => ({ ...global, fields: [...global.fields, seedFlagField] }),
)

export interface MosaicPayloadOptions {
  databaseUrl: string
  secret: string
  /** Directory Payload writes its admin import map relative to. */
  importMapBaseDir: string
  /** Where `payload generate:types` writes. */
  typesOutputFile: string
  /** Sync the schema on startup. Only for throwaway databases; the rest use migrations. */
  push: boolean
  /** Where Payload reads and writes migrations. */
  migrationDir: string
  /** Admin components shown below the dashboard, as Payload component paths. */
  afterDashboard?: string[]
  /** Admin components shown above every signed-in admin view. */
  header?: string[]
  /** Admin components shown above the login form. */
  beforeLogin?: string[]
  /** The public demo admin: no first-user promotion, and the reviewer login is prefilled. */
  demo?: boolean
}

export function createPayloadConfig(options: MosaicPayloadOptions): Promise<SanitizedConfig> {
  return buildConfig({
    admin: {
      user: Users.slug,
      importMap: { baseDir: options.importMapBaseDir },
      components: {
        afterDashboard: options.afterDashboard ?? [],
        header: options.header ?? [],
        beforeLogin: options.beforeLogin ?? [],
      },
      ...(options.demo ? { autoLogin: { ...demoReviewer, prefillOnly: true } } : {}),
    },
    custom: { demo: options.demo ?? false },
    collections,
    globals,
    editor: richTextEditor,
    // Sites read a build-time snapshot, so nothing needs GraphQL.
    graphQL: { disable: true },
    secret: options.secret,
    typescript: { outputFile: options.typesOutputFile },
    db: postgresAdapter({
      pool: { connectionString: options.databaseUrl },
      push: options.push,
      migrationDir: options.migrationDir,
    }),
    sharp,
  })
}
