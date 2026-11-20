import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { builtPages } from './pages'

// WCAG 2.2 AA (Phase 2), plus axe's best practices (one main landmark, unique landmarks and
// so on), on every built page in both colour schemes: every profile but the hub and Flutter
// follows the visitor's light or dark setting.
const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']

for (const path of builtPages().filter((p) => !p.endsWith('.xml'))) {
  test(`${path} meets WCAG 2.2 AA`, async ({ page }) => {
    const problems: string[] = []
    for (const colorScheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme })
      await page.goto(path, { waitUntil: 'networkidle' })
      const { violations } = await new AxeBuilder({ page }).withTags(tags).analyze()
      for (const v of violations) {
        const targets = v.nodes.slice(0, 3).map((n) => n.target.join(' '))
        problems.push(
          `${colorScheme}: ${v.id} (${v.impact ?? ''}) ${v.help} → ${targets.join(', ')}`,
        )
      }
    }
    expect(problems).toEqual([])
  })
}
