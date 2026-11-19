import { expect, test } from '@playwright/test'
import { builtPages } from './pages'

// Phase 2: full keyboard use. Tabbing through every page reaches the end without getting
// trapped, and every stop is on screen with a visible focus ring (WCAG 2.4.7). Text fields
// are the exception: they show focus with a caret, and the forms add an accent border.
const MAX_STOPS = 250

test('every page can be tabbed through, with focus always visible', async ({ page }) => {
  test.setTimeout(300_000)
  const problems: string[] = []
  for (const path of builtPages().filter((p) => !p.endsWith('.xml'))) {
    await page.goto(path, { waitUntil: 'networkidle' })
    let stops = 0
    for (; stops < MAX_STOPS; stops++) {
      await page.keyboard.press('Tab')
      const focus = await page.evaluate(() => {
        const el = document.activeElement
        if (!el || el === document.body) return null
        const style = getComputedStyle(el)
        const box = el.getBoundingClientRect()
        return {
          label: `${el.tagName.toLowerCase()} ${el.getAttribute('href') ?? el.textContent.trim().slice(0, 40)}`,
          text: el.matches('input:not([type=checkbox],[type=radio],[type=submit]), textarea'),
          ring:
            (style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0) ||
            style.boxShadow !== 'none',
          onScreen: box.width > 0 && box.height > 0,
        }
      })
      if (!focus) break
      if (!focus.onScreen) problems.push(`${path}: focus is off screen on ${focus.label}`)
      else if (!focus.ring && !focus.text) problems.push(`${path}: no focus ring on ${focus.label}`)
    }
    if (stops === MAX_STOPS) problems.push(`${path}: focus never left the page`)
  }
  expect(problems).toEqual([])
})
