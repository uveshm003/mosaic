import { purge } from '@mosaic/seed'
import { getPayload } from 'payload'
import config from '../src/payload.config'

// Removes only documents marked _seed, so it is safe anywhere.
const payload = await getPayload({ config })
console.table(await purge(payload))
await payload.destroy()
process.exit(0)
