import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { productionSnapshotError } from './guard'
import { parseSnapshot, SNAPSHOT_PATH, type Snapshot } from './schema'

export function loadSnapshot(file: string, options: { production: boolean }): Snapshot {
  let json: unknown
  try {
    json = JSON.parse(readFileSync(file, 'utf8'))
  } catch (error) {
    throw new Error(`Can't read the content snapshot at ${file}. Run \`pnpm content:export\`.`, {
      cause: error,
    })
  }
  const snapshot = parseSnapshot(json)
  if (options.production) {
    const error = productionSnapshotError(snapshot)
    if (error) throw new Error(error)
  }
  return snapshot
}

/**
 * The snapshot a site build reads, from the repo root. `APP_ENV=production` turns on the
 * production guard and requires the file, unless MOSAIC_ALLOW_MISSING_SNAPSHOT is set
 * (only until the production database exists, #13).
 */
export function loadBuildSnapshot(options: {
  repoRoot: string
  env: Record<string, string | undefined>
}): Snapshot | null {
  const file = path.resolve(options.repoRoot, SNAPSHOT_PATH)
  const production = options.env.APP_ENV === 'production'
  if (!existsSync(file)) {
    if (production && options.env.MOSAIC_ALLOW_MISSING_SNAPSHOT !== '1') {
      throw new Error(
        `Production builds need a snapshot at ${SNAPSHOT_PATH}. Run \`pnpm content:export\`.`,
      )
    }
    return null
  }
  return loadSnapshot(file, { production })
}
