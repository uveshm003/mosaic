import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig, type SanitizedConfig } from 'payload'
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
import { BrandSettings, Person, Profiles, SiteSettings } from './globals'

export interface MosaicPayloadOptions {
  databaseUrl: string
  secret: string
  /** Directory Payload writes its admin import map relative to. */
  importMapBaseDir: string
  /** Where `payload generate:types` writes. */
  typesOutputFile: string
  /** Sync the schema on startup. Only for throwaway databases; the rest use migrations. */
  push: boolean
}

export function createPayloadConfig(options: MosaicPayloadOptions): Promise<SanitizedConfig> {
  return buildConfig({
    admin: {
      user: Users.slug,
      importMap: { baseDir: options.importMapBaseDir },
    },
    collections: [
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
    ],
    globals: [Person, Profiles, BrandSettings, SiteSettings],
    editor: lexicalEditor(),
    // Sites read a build-time snapshot, so nothing needs GraphQL.
    graphQL: { disable: true },
    secret: options.secret,
    typescript: { outputFile: options.typesOutputFile },
    db: postgresAdapter({
      pool: { connectionString: options.databaseUrl },
      push: options.push,
    }),
    sharp,
  })
}
