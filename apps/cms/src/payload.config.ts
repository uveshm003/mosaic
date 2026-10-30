import { createPayloadConfig } from '@mosaic/content/payload'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseCmsEnv } from './env'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const env = parseCmsEnv(process.env)

export default createPayloadConfig({
  databaseUrl: env.DATABASE_URL,
  secret: env.PAYLOAD_SECRET,
  importMapBaseDir: dirname,
  typesOutputFile: path.resolve(dirname, '../../../packages/content/src/payload-types.ts'),
})
