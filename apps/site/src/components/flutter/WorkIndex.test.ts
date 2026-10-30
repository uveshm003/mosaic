import { describe, expect, it } from 'vitest'
import { shortName } from './WorkIndex'

describe('shortName', () => {
  it('drops the seed prefix and keeps short names whole', () => {
    expect(shortName('Sample: TidyHome')).toBe('TidyHome')
  })

  it('cuts long names at a word boundary', () => {
    const short = shortName('An offline-first field inspection platform for utility crews')
    expect(short).toBe('An offline-first field…')
    expect(short.length).toBeLessThanOrEqual(29)
  })
})
