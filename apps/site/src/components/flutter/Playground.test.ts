import { describe, expect, it } from 'vitest'
import { oklchToHex } from './Playground'

describe('oklchToHex', () => {
  it('converts known colours', () => {
    expect(oklchToHex(1, 0, 0)).toBe('ffffff')
    expect(oklchToHex(0, 0, 0)).toBe('000000')
    // oklch(0.628 0.2577 29.23) is sRGB red.
    expect(oklchToHex(0.627955, 0.257683, 29.2339)).toBe('ff0000')
  })

  it('clamps out-of-gamut colours into range', () => {
    expect(oklchToHex(0.9, 0.4, 140)).toMatch(/^[0-9a-f]{6}$/)
  })
})
