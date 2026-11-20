import { expect, test, type Request } from '@playwright/test'
import { builtPages } from './pages'

// Phase 2: at most 150 KB of JavaScript, gzipped, when a page first loads. The Flutter demos
// and Turnstile load only when a visitor asks for them, so they don't count.
const BUDGET_KB = 150

test('every page loads at most 150 KB of JavaScript, gzipped', async ({ page }) => {
  test.setTimeout(240_000)
  let sizes: Promise<number>[] = []
  page.on('requestfinished', (request: Request) => {
    if (request.resourceType() === 'script')
      sizes.push(request.sizes().then((s) => s.responseBodySize))
  })

  const over: string[] = []
  for (const path of builtPages().filter((p) => !p.endsWith('.xml'))) {
    sizes = []
    await page.goto(path, { waitUntil: 'networkidle' })
    const kb = (await Promise.all(sizes)).reduce((a, b) => a + b, 0) / 1024
    if (kb > BUDGET_KB) over.push(`${path}: ${kb.toFixed(1)} KB`)
  }
  expect(over).toEqual([])
})
