import { describe, expect, it } from 'vitest'
import { appEnvSchema, profileKeySchema } from './index'

describe('appEnvSchema', () => {
  it('accepts every environment', () => {
    for (const env of ['dev', 'production', 'demo', 'test']) {
      expect(appEnvSchema.parse(env)).toBe(env)
    }
  })

  it('rejects unknown environments', () => {
    expect(appEnvSchema.safeParse('prod').success).toBe(false)
  })
})

describe('profileKeySchema', () => {
  it('rejects the brand, which is its own app', () => {
    expect(profileKeySchema.safeParse('brand').success).toBe(false)
  })
})
