import { readdirSync, statSync } from 'node:fs'
import path from 'node:path'

const dist = path.join(import.meta.dirname, '..', '.dist')

/** Every built page, as the path a visitor would use (no .html, no index). */
export function builtPages(): string[] {
  const pages: string[] = []
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const full = path.join(dir, name)
      if (statSync(full).isDirectory()) {
        if (!/\/_next$|\/flutter\/demos$/.test(full)) walk(full)
      } else if (name.endsWith('.html')) {
        pages.push(toPath(`/${path.relative(dist, full)}`))
      }
    }
  }
  walk(dist)
  // Not-found pages and the "_" placeholders static export needs when a list is empty.
  return pages.filter((p) => !/(^|\/)(404|_not-found|_)$/.test(p)).sort()
}

/** Normalises a URL path the way GitHub Pages resolves it. */
export function toPath(url: string): string {
  let p = url.split(/[?#]/)[0] ?? '/'
  p = p.replace(/\.html$/, '').replace(/\/index$/, '/')
  if (p === '/brand') return '/brand/'
  if (p.length > 1 && p.endsWith('/') && p !== '/brand/') p = p.slice(0, -1)
  return p || '/'
}
