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
    { name: 'phone', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'node server.mjs',
    url: `http://localhost:${String(port)}/`,
    env: { PORT: String(port) },
    reuseExistingServer: !process.env.CI,
  },
})
