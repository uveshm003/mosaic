// Runs a command with the env file for one target. Values in the file win over the
// shell, so a stray `export DATABASE_URL=...` can't point the admin at the wrong database.
import { spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { parseEnv } from 'node:util'

const files = { dev: '.env.dev', production: '.env.prod' } as const

const [target, command, ...args] = process.argv.slice(2)

if (target !== 'dev' && target !== 'production') {
  console.error('Usage: with-env.ts <dev|production> <command> [...args]')
  process.exit(1)
}
if (!command) {
  console.error('with-env.ts: missing command')
  process.exit(1)
}

const file = path.resolve(import.meta.dirname, '..', files[target])
let fromFile: Record<string, string | undefined>
try {
  fromFile = parseEnv(readFileSync(file, 'utf8'))
} catch {
  console.error(`Missing ${files[target]}. Copy ${files[target]}.example and fill it in.`)
  process.exit(1)
}

const child = spawn(command, args, {
  stdio: 'inherit',
  env: { ...process.env, ...fromFile, MOSAIC_CMS_TARGET: target },
})
child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal)
  process.exit(code ?? 1)
})
