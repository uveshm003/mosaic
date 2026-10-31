import { describe, expect, it } from 'vitest'
import { automaticLabel } from './labels'

describe('automaticLabel', () => {
  it('uses the spec wording for concepts', () => {
    expect(automaticLabel('campaign-concept')).toBe('Concept, not commissioned work.')
  })

  it('names the company for analysis when known', () => {
    expect(automaticLabel('teardown', 'Kettle & Co.')).toBe(
      'Independent analysis. Not affiliated with Kettle & Co.',
    )
    expect(automaticLabel('brand-breakdown')).toBe(
      'Independent analysis. Not affiliated with the companies discussed.',
    )
    expect(automaticLabel('improvement-proposal', '  ')).toMatch(/companies discussed/)
  })

  it('leaves other types unlabelled', () => {
    for (const type of ['essay', 'book-notes', 'research-note', 'video'] as const) {
      expect(automaticLabel(type)).toBeNull()
    }
  })
})
