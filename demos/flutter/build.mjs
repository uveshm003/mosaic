// Builds every Flutter demo into the site's public folder, each with its own base href,
// so the site can embed it at /flutter/demos/<slug>/. `check` runs analyze and tests instead.
import { spawnSync } from 'node:child_process'
import { cpSync, existsSync, readFileSync, readdirSync, renameSync, rmSync } from 'node:fs'
import path from 'node:path'

const here = import.meta.dirname
const out = path.resolve(here, '../../apps/site/public/flutter/demos')
const mode = process.argv[2] ?? 'build'

// demo_kit is a shared package, not a demo.
const packages = readdirSync(here, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && existsSync(path.join(here, entry.name, 'pubspec.yaml')))
  .map((entry) => entry.name)
const demos = packages.filter((name) => name !== 'demo_kit')

function flutter(cwd, ...args) {
  console.log(`\n$ (${path.basename(cwd)}) flutter ${args.join(' ')}`)
  const { status } = spawnSync('flutter', args, { cwd, stdio: 'inherit' })
  if (status !== 0) process.exit(status ?? 1)
}

if (mode === 'check') {
  for (const name of packages) {
    const cwd = path.join(here, name)
    flutter(cwd, 'pub', 'get')
    flutter(cwd, 'analyze', '--fatal-infos')
    flutter(cwd, 'test')
  }
} else if (mode === 'build') {
  rmSync(out, { recursive: true, force: true })
  for (const slug of demos) {
    flutter(
      path.join(here, slug),
      'build',
      'web',
      '--release',
      '--wasm',
      // Self-host the engine files instead of loading them from Google's CDN.
      '--no-web-resources-cdn',
      `--base-href=/flutter/demos/${slug}/`,
      `--output=${path.join(out, slug)}`,
    )
    // Every demo is built by the same Flutter, so the engine is identical: keep one copy
    // (each demo's flutter_bootstrap.js points at it) and drop debug symbols.
    const engine = path.join(out, slug, 'canvaskit')
    if (existsSync(path.join(out, 'engine'))) rmSync(engine, { recursive: true })
    else renameSync(engine, path.join(out, 'engine'))
    rmSync(path.join(out, slug, 'flutter_service_worker.js'), { force: true })
  }
  // The engine always loads Roboto; serve the copy in engine-fonts (see each demo's
  // flutter_bootstrap.js) and fail if a Flutter upgrade asks for a different file.
  for (const slug of demos) {
    const main = readFileSync(path.join(out, slug, 'main.dart.js'), 'utf8')
    for (const font of new Set(main.match(/roboto\/v\d+\/[\w-]+\.woff2/g) ?? [])) {
      if (!existsSync(path.join(here, 'engine-fonts', font))) {
        console.error(`${slug} needs ${font}; add it to demos/flutter/engine-fonts.`)
        process.exit(1)
      }
    }
  }
  cpSync(path.join(here, 'engine-fonts'), path.join(out, 'engine', 'fonts'), { recursive: true })
  for (const entry of readdirSync(path.join(out, 'engine'), { recursive: true })) {
    if (String(entry).endsWith('.symbols')) rmSync(path.join(out, 'engine', String(entry)))
  }
} else {
  console.error('Usage: build.mjs [build|check]')
  process.exit(1)
}
