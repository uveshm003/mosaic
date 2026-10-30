import { buildSnapshot, productionSnapshotError, SNAPSHOT_PATH } from '@mosaic/content/snapshot'
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'
import { parseCmsEnv } from '../src/env'
import config from '../src/payload.config'

// `payload run scripts/export.ts drafts` includes drafts, for local preview only.
const drafts = process.argv.slice(2).includes('drafts')
const env = parseCmsEnv(process.env)

const payload = await getPayload({ config })
const snapshot = await buildSnapshot(payload, { appEnv: env.APP_ENV, drafts })
await payload.destroy()

if (env.APP_ENV === 'production') {
  const error = productionSnapshotError(snapshot)
  if (error) throw new Error(error)
}

const file = path.resolve(import.meta.dirname, '../../..', SNAPSHOT_PATH)
mkdirSync(path.dirname(file), { recursive: true })
writeFileSync(file, `${JSON.stringify(snapshot, null, 2)}\n`)
const counts = Object.entries(snapshot.collections).map(
  ([name, docs]) => `${name} ${String(docs.length)}`,
)
console.log(`Wrote ${SNAPSHOT_PATH}${drafts ? ' (with drafts)' : ''}: ${counts.join(', ')}`)
process.exit(0)
