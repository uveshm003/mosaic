import { expect, test } from '@playwright/test'

// One smoke test per experience: it loads, it links onward, and its signature interaction works.

test('hub: links to every live portfolio and the brand, and the terminal opens them', async ({
  page,
}) => {
  await page.goto('/')
  const portfolios = page.locator('#portfolios')
  for (const href of ['/flutter', '/product', '/freelance', '/fullstack', '/brand/']) {
    await expect(portfolios.locator(`a[href="${href}"]`)).toHaveCount(1)
  }
  await page.getByRole('button', { name: 'cd flutter', exact: true }).click()
  await expect(page).toHaveURL(/\/flutter$/)
})

test('flutter: the terminal answers and the demo lab is ready to run', async ({ page }) => {
  await page.goto('/flutter')
  await page.getByRole('button', { name: 'help', exact: true }).click()
  await expect(page.getByText('projects', { exact: false }).first()).toBeVisible()
  await expect(page.getByRole('button', { name: /^▶ Run / })).toBeVisible()
})

test('freelance: services, the process and the enquiry are all there', async ({ page }) => {
  await page.goto('/freelance')
  await expect(page.locator('#services li').first()).toBeVisible()
  await expect(page.locator('#process ol > li').first()).toBeVisible()
  const form = page.locator('#contact form')
  const notice = page.getByText('The contact form is set up at deploy time.')
  await expect(form.or(notice)).toBeVisible()
})

test('full-stack: the stack explorer, request tracer and command palette work', async ({
  page,
}, info) => {
  await page.goto('/fullstack')
  const firstTech = page.locator('#stack button').first()
  await firstTech.click()
  await expect(page.locator('tbody tr.opacity-30').first()).toBeAttached()
  await firstTech.click()

  const tracer = page.getByRole('button', { name: '▶ Send request' }).first()
  await tracer.click()
  await expect(page.getByText(/^hop 1\//)).toBeVisible()

  test.skip(info.project.name !== 'desktop', 'Keyboard shortcut is for desktop')
  await page.keyboard.press('Control+k')
  await expect(page.getByRole('dialog', { name: 'Command palette' })).toBeVisible()
  await page.keyboard.type('overview')
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/fullstack#overview$/)
})

test('product: the journey map moves and teardowns carry the analysis label', async ({ page }) => {
  await page.goto('/product')
  const journey = page.locator('section[aria-labelledby=journey]')
  const note = journey.getByText('It hurts').locator('..')
  const before = await note.textContent()
  await journey.getByRole('button', { name: '2', exact: true }).click()
  await expect(note).not.toHaveText(before ?? '')

  await page.getByRole('button', { name: /^Teardowns/ }).click()
  await page.locator('section[aria-labelledby=work] li a').first().click()
  await expect(page).toHaveURL(/\/product\/teardowns\//)
  await expect(
    page.locator('article header').getByText(/^Independent analysis\. Not affiliated with /),
  ).toBeVisible()
})

test('brand: the poster wall filters, posts are labelled, and RSS is valid', async ({
  page,
  request,
}) => {
  await page.goto('/brand/')
  const posters = page.locator('#wall li')
  const all = await posters.count()
  await page.getByRole('button', { name: 'Concepts', exact: true }).click()
  await expect.poll(() => posters.count()).toBeLessThan(all)
  await posters.first().locator('a').click()
  await expect(page).toHaveURL(/\/brand\/concepts\//)
  await expect(
    page.locator('article header').getByText('Concept, not commissioned work.'),
  ).toBeVisible()
  await expect(page.locator('meta[name=robots]')).toHaveAttribute('content', /noindex/)

  const rss = await request.get('/brand/rss.xml')
  expect(rss.ok()).toBe(true)
  expect(await rss.text()).toMatch(/^<\?xml[\s\S]*<rss version="2.0"[\s\S]*<item>/)
})
