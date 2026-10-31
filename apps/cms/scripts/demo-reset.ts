// Nightly reset of the public demo admin, run by .github/workflows/demo-reset.yml.
import { assertSeedAllowed, resetDemo } from '@mosaic/seed'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { seedTarget } from './seed-target'

const target = seedTarget()
if (target.appEnv !== 'demo') throw new Error('Refusing to reset: APP_ENV is not demo.')
assertSeedAllowed(target)

const payload = await getPayload({ config })
console.table(await resetDemo(payload))
await payload.destroy()
process.exit(0)
