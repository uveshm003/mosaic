// Lighthouse CI on one page of every template, on mobile, with the spec's budgets
// (lighthouserc.json). Personal site: Performance, Accessibility and Best Practices 95+,
// SEO 100. Brand: Performance 85+, Accessibility 95+, and no SEO score while it is noindex.
// Run after `pnpm assemble`. Reports land in e2e/.lighthouseci.
//
// Each page runs three times and is judged on its best run. Keep it at three: on a fresh CI
// runner the first run of all starts Chrome cold and has scored 74 where the next two scored
// 99 and 100, so a single run fails at random.
import { spawnSync } from 'node:child_process'
import { readdirSync, statSync } from 'node:fs'
import path from 'node:path'

const dist = path.join(import.meta.dirname, '.dist')
const origin = 'http://localhost:4317'

// Each page template, as the route it is built from.
const templates = [
  /^\/$/,
  /^\/flutter$/,
  /^\/flutter\/[^/]+$/,
  /^\/freelance$/,
  /^\/freelance\/[^/]+$/,
  /^\/fullstack$/,
  /^\/fullstack\/[^/]+$/,
  /^\/product$/,
  /^\/product\/[^/]+\/[^/]+$/,
  /^\/brand\/$/,
  /^\/brand\/(?!series\/)[^/]+$/,
  /^\/brand\/series\/[^/]+$/,
  /^\/brand\/(?!videos\/|series\/)[^/]+\/[^/]+$/,
  /^\/brand\/videos\/[^/]+$/,
]

function pages() {
  const found = []
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const full = path.join(dir, name)
      if (statSync(full).isDirectory()) {
        if (!/\/_next$|\/flutter\/demos$/.test(full)) walk(full)
      } else if (name.endsWith('.html')) {
        const route = `/${path.relative(dist, full)}`.replace(/\.html$/, '').replace(/index$/, '')
        if (!/(^|\/)(404|_not-found|_)$/.test(route)) found.push(route)
      }
    }
  }
  walk(dist)
  return found.sort()
}

const all = pages()
const urls = templates.flatMap((t) => {
  const first = all.find((p) => t.test(p))
  return first ? [origin + first] : []
})
console.log(`Lighthouse on ${String(urls.length)} templates:\n${urls.join('\n')}`)

const { status } = spawnSync(
  'lhci',
  ['autorun', '--config=lighthouserc.json', ...urls.map((u) => `--collect.url=${u}`)],
  { cwd: import.meta.dirname, stdio: 'inherit' },
)
process.exit(status ?? 1)
