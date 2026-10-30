import { describe, expect, it } from 'vitest'
import { wordWidthEm } from './erode-metrics'
import { splitWord } from './NameMosaic'

describe('splitWord', () => {
  it('cuts a word into even, contiguous pieces that rebuild it', () => {
    const pieces = splitWord('Menpurwala', 5)
    expect(pieces).toEqual(['Me', 'np', 'ur', 'wa', 'la'])
    expect(pieces.join('')).toBe('Menpurwala')
  })

  it('spreads uneven letters without losing any', () => {
    const pieces = splitWord('Walker', 5)
    expect(pieces).toHaveLength(5)
    expect(pieces.join('')).toBe('Walker')
  })
})

describe('wordWidthEm', () => {
  it('matches widths measured in a browser within 3%', () => {
    // Whole words set in Erode 500 at -0.04em tracking, measured with Playwright.
    for (const [word, perLetter] of [
      ['Menpurwala', 0.491],
      ['Walker', 0.452],
      ['Uvesh', 0.478],
    ] as const) {
      const measured = perLetter * word.length
      expect(Math.abs(wordWidthEm(word) - measured) / measured).toBeLessThan(0.03)
    }
  })
})
