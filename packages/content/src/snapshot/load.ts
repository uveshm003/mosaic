import { readFileSync } from 'node:fs'
import { productionSnapshotError } from './guard'
import { parseSnapshot, type Snapshot } from './schema'

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
