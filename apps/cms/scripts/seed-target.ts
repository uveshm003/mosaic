import type { SeedTarget } from '@mosaic/seed'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { parseEnv } from 'node:util'

// The production URL comes from .env.prod when it exists, so the guard knows which
// host to refuse without any extra setting.
export function seedTarget(): SeedTarget {
  const prodFile = path.resolve(import.meta.dirname, '..', '.env.prod')
  const productionDatabaseUrl = existsSync(prodFile)
    ? parseEnv(readFileSync(prodFile, 'utf8')).DATABASE_URL
    : undefined
  return {
    appEnv: process.env.APP_ENV ?? '',
    databaseUrl: process.env.DATABASE_URL ?? '',
    productionDatabaseUrl,
  }
}
