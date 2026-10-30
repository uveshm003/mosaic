export interface SeedTarget {
  appEnv: string
  databaseUrl: string
  /** DATABASE_URL from apps/cms/.env.prod, when that file exists. */
  productionDatabaseUrl?: string | undefined
}

const seedableEnvs = new Set(['dev', 'demo', 'test'])

function host(url: string): string | null {
  try {
    const { hostname, port } = new URL(url)
    return `${hostname}:${port}`
  } catch {
    return null
  }
}

// Returns why seeding must not run against this target, or null when it may.
export function seedRefusal(target: SeedTarget): string | null {
  if (target.appEnv === 'production') return 'Refusing to seed: APP_ENV is production.'
  if (!seedableEnvs.has(target.appEnv)) {
    return `Refusing to seed: APP_ENV "${target.appEnv}" is not dev, demo or test.`
  }
  if (target.productionDatabaseUrl) {
    const targetHost = host(target.databaseUrl)
    if (targetHost === null || targetHost === host(target.productionDatabaseUrl)) {
      return 'Refusing to seed: the database host matches the production database.'
    }
  }
  return null
}

export function assertSeedAllowed(target: SeedTarget): void {
  const refusal = seedRefusal(target)
  if (refusal) throw new Error(refusal)
}
