import { expect, test } from '@playwright/test'
import { builtPages, toPath } from './pages'

// The personal site links the brand by its production address; follow it here instead.
const PRODUCTION = 'https://uveshm003.github.io'

test('every page is reachable from the hub, with no broken links, anchors or errors', async ({
  page,
  baseURL,
}, info) => {
  test.skip(info.project.name !== 'desktop', 'One crawl is enough')
  test.setTimeout(240_000)
  const origin = new URL(baseURL ?? '').origin
  const seen = new Set<string>()
  const queue = ['/']
  const problems: string[] = []
  const pendingAnchors: [from: string, target: string, id: string][] = []
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text())
  })

  while (queue.length > 0) {
    const current = queue.shift() ?? '/'
    if (seen.has(current)) continue
    seen.add(current)
    errors.length = 0
    const response = await page.goto(current, { waitUntil: 'networkidle' })
    if (response?.status() !== 200) {
      problems.push(`${current} → ${String(response?.status())}`)
      continue
    }
    if (errors.length > 0) problems.push(`${current}: ${errors.join(' | ')}`)

    const ids = new Set(await page.locator('[id]').evaluateAll((els) => els.map((e) => e.id)))
    const hrefs = await page
      .locator('a[href]')
      .evaluateAll((as) => as.map((a) => a.getAttribute('href') ?? ''))
    for (const href of hrefs) {
      if (/^(mailto|tel):/.test(href) || href === '') continue
      if (href.startsWith('#')) {
        if (href.length > 1 && !ids.has(href.slice(1)))
          problems.push(`${current}: missing anchor ${href}`)
        continue
      }
      const url = new URL(href.replace(PRODUCTION, origin), origin + current)
      if (url.origin !== origin || url.pathname.startsWith('/flutter/demos/')) continue
      const target = toPath(url.pathname)
      if (url.hash.length > 1) pendingAnchors.push([current, target, url.hash.slice(1)])
      if (!seen.has(target)) queue.push(target)
    }
  }

  for (const [from, target, id] of pendingAnchors) {
    await page.goto(target, { waitUntil: 'domcontentloaded' })
    if ((await page.locator(`[id="${id}"]`).count()) === 0)
      problems.push(`${from}: missing ${target}#${id}`)
  }

  expect(problems).toEqual([])
  const unreachable = builtPages().filter((p) => !seen.has(p) && !p.endsWith('.xml'))
  expect(unreachable, 'built pages nothing links to').toEqual([])
})

test('no page scrolls sideways on a phone', async ({ page }, info) => {
  test.skip(info.project.name !== 'phone', 'Phone widths only')
  test.setTimeout(240_000)
  const wide: string[] = []
  for (const path of builtPages().filter((p) => !p.endsWith('.xml'))) {
    await page.goto(path, { waitUntil: 'networkidle' })
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    )
    if (overflow > 0) wide.push(`${path} (+${String(overflow)}px)`)
  }
  expect(wide).toEqual([])
})
