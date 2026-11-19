import { expect, test } from '@playwright/test'
import { builtPages } from './pages'

// Phase 2: prefers-reduced-motion turns motion off. The config asks every test for reduced
// motion; here nothing may still be animating once a page has loaded and been scrolled. This
// sees CSS animations, transitions and the Web Animations API, not motion drawn by script.
test('with reduced motion, nothing animates on any page', async ({ page }) => {
  test.setTimeout(240_000)
  const moving: string[] = []
  for (const path of builtPages().filter((p) => !p.endsWith('.xml'))) {
    await page.goto(path, { waitUntil: 'networkidle' })
    await page.mouse.wheel(0, 3000)
    const running = await page.evaluate(() =>
      document
        .getAnimations()
        .filter((a) => a.playState === 'running')
        .map((a) => {
          const name =
            a instanceof CSSAnimation
              ? a.animationName
              : a instanceof CSSTransition
                ? a.transitionProperty
                : 'script'
          const target = a.effect instanceof KeyframeEffect ? a.effect.target : null
          return `${name} on ${target?.tagName.toLowerCase() ?? '?'}`
        }),
    )
    if (running.length > 0) moving.push(`${path}: ${[...new Set(running)].join(', ')}`)
  }
  expect(moving).toEqual([])
})
