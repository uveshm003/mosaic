import { describe, expect, it } from 'vitest'
import { parseCmsEnv } from './env'

const valid = {
  DATABASE_URL: 'postgres://user:pass@localhost:5432/db',
  PAYLOAD_SECRET: 'x'.repeat(32),
}

describe('parseCmsEnv', () => {
  it('accepts a postgres URL and a long secret', () => {
    expect(parseCmsEnv(valid)).toEqual(valid)
  })

  it('rejects a non-postgres URL', () => {
    expect(() => parseCmsEnv({ ...valid, DATABASE_URL: 'mysql://localhost/db' })).toThrow(
      /DATABASE_URL/,
    )
  })

  it('rejects a short secret', () => {
    expect(() => parseCmsEnv({ ...valid, PAYLOAD_SECRET: 'short' })).toThrow(/PAYLOAD_SECRET/)
  })
})
