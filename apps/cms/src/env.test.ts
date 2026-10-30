import { describe, expect, it } from 'vitest'
import { allowsSchemaPush, parseCmsEnv } from './env'

const base = {
  DATABASE_URL: 'postgres://user:pass@localhost:5432/db',
  PAYLOAD_SECRET: 'x'.repeat(32),
}

describe('parseCmsEnv', () => {
  it('accepts dev when launched as dev', () => {
    expect(parseCmsEnv({ ...base, APP_ENV: 'dev', MOSAIC_CMS_TARGET: 'dev' }).APP_ENV).toBe('dev')
  })

  it.each(['dev', 'production'])('refuses %s without its launch command', (appEnv) => {
    expect(() => parseCmsEnv({ ...base, APP_ENV: appEnv })).toThrow(/pnpm cms:dev/)
  })

  it('refuses production settings launched as dev', () => {
    expect(() => parseCmsEnv({ ...base, APP_ENV: 'production', MOSAIC_CMS_TARGET: 'dev' })).toThrow(
      /MOSAIC_CMS_TARGET/,
    )
  })

  it('refuses a test env file launched as production', () => {
    expect(() =>
      parseCmsEnv({ ...base, APP_ENV: 'test', MOSAIC_CMS_TARGET: 'production' }),
    ).toThrow(/MOSAIC_CMS_TARGET/)
  })

  it('accepts test without a launch command', () => {
    expect(parseCmsEnv({ ...base, APP_ENV: 'test' }).APP_ENV).toBe('test')
  })

  it('requires APP_ENV', () => {
    expect(() => parseCmsEnv(base)).toThrow(/APP_ENV/)
  })

  it('rejects a non-postgres URL', () => {
    expect(() =>
      parseCmsEnv({ ...base, APP_ENV: 'test', DATABASE_URL: 'mysql://localhost/db' }),
    ).toThrow(/DATABASE_URL/)
  })

  it('rejects a short secret', () => {
    expect(() => parseCmsEnv({ ...base, APP_ENV: 'test', PAYLOAD_SECRET: 'short' })).toThrow(
      /PAYLOAD_SECRET/,
    )
  })
})

describe('allowsSchemaPush', () => {
  it.each([
    ['dev', true],
    ['test', true],
    ['production', false],
    ['demo', false],
  ] as const)('%s -> %s', (appEnv, expected) => {
    const env = parseCmsEnv({ ...base, APP_ENV: appEnv, MOSAIC_CMS_TARGET: appEnv })
    expect(allowsSchemaPush(env)).toBe(expected)
  })
})
