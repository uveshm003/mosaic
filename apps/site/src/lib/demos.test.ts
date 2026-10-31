import { existsSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { demoPoster, flutterDemos } from './demos'

const root = path.resolve(import.meta.dirname, '../../../..')

describe('flutterDemos', () => {
  it.each(flutterDemos.map((d) => [d.slug]))('%s has a Flutter project and a poster', (slug) => {
    expect(existsSync(path.join(root, 'demos/flutter', slug, 'pubspec.yaml'))).toBe(true)
    expect(existsSync(path.join(root, 'apps/site/public', demoPoster(slug)))).toBe(true)
  })

  it('uses unique slugs', () => {
    const slugs = flutterDemos.map((d) => d.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })
})
