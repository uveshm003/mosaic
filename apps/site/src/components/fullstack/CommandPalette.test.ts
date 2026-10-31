import { describe, expect, it } from 'vitest'
import { matches, type Command } from './CommandPalette'

const command: Command = {
  group: 'Projects',
  label: 'Mosaic: this platform',
  hint: 'case study',
  href: '/x',
}

describe('matches', () => {
  it('matches every word anywhere in the group, label or hint, ignoring case', () => {
    expect(matches(command, '')).toBe(true)
    expect(matches(command, 'mosaic')).toBe(true)
    expect(matches(command, 'PROJECTS study')).toBe(true)
    expect(matches(command, 'mosaic angular')).toBe(false)
  })
})
