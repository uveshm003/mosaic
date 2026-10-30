import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    // CI and docker-compose.yml both expose this database.
    env: {
      APP_ENV: 'test',
      DATABASE_URL:
        process.env.DATABASE_URL ?? 'postgres://mosaic:mosaic@localhost:5432/mosaic_test',
      PAYLOAD_SECRET: 'test-secret-that-is-at-least-32-chars',
    },
    hookTimeout: 60_000,
    testTimeout: 30_000,
  },
})
