// Puts the two static exports together the way the deploy does: the personal site at the
// root and the brand under /brand. Build both first.
import { cpSync, existsSync, rmSync } from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const dist = path.join(import.meta.dirname, '.dist')
for (const app of ['site', 'brand']) {
  if (!existsSync(path.join(root, 'apps', app, 'out'))) {
    console.error(`apps/${app}/out is missing. Build it first.`)
    process.exit(1)
  }
}
rmSync(dist, { recursive: true, force: true })
cpSync(path.join(root, 'apps/site/out'), dist, { recursive: true })
cpSync(path.join(root, 'apps/brand/out'), path.join(dist, 'brand'), { recursive: true })
console.log('Assembled e2e/.dist')
