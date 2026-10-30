import { assertSeedAllowed, seed } from '@mosaic/seed'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { seedTarget } from './seed-target'

const target = seedTarget()
// Checked before connecting, so a refused run never touches the database.
assertSeedAllowed(target)

const payload = await getPayload({ config })
const counts = await seed(payload, target.appEnv === 'demo' ? 'demo' : 'dev')
console.table(counts)
await payload.destroy()
process.exit(0)
