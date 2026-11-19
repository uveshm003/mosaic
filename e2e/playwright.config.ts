import { defineConfig, devices } from '@playwright/test'

const port = 4317

// Runs against both static exports, assembled like the deploy (pnpm assemble).
export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: `http://localhost:${String(port)}`, reducedMotion: 'reduce' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    // Colours, markup and scripts are the same on a phone, so these run on desktop only.
    {
      name: 'phone',
      use: { ...devices['Pixel 7'] },
      testIgnore: ['a11y.spec.ts', 'budget.spec.ts'],
    },
  ],
  webServer: {
    command: 'node server.mjs',
    url: `http://localhost:${String(port)}/`,
    env: { PORT: String(port) },
    reuseExistingServer: !process.env.CI,
  },
})
