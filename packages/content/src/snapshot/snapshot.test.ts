import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { referencedMediaIds } from './export'
import { productionSnapshotError, seedDocuments } from './guard'
import { loadSnapshot } from './load'
import { parseSnapshot, SNAPSHOT_VERSION } from './schema'

function snapshot(
  overrides: { seedProject?: boolean; seedPerson?: boolean; drafts?: boolean } = {},
) {
  return {
    version: SNAPSHOT_VERSION,
    generatedAt: '2026-10-30T12:00:00.000Z',
    appEnv: 'production',
    drafts: overrides.drafts ?? false,
    collections: {
      projects: [
        { id: 1, title: 'Real', _seed: false },
        { id: 2, title: 'Seeded', _seed: overrides.seedProject ?? false },
      ],
      posts: [],
      services: [],
      testimonials: [],
      experience: [],
      education: [],
      skills: [],
      tech: [],
      media: [],
    },
    globals: {
      person: { name: 'Person', _seed: overrides.seedPerson ?? false },
      profiles: {},
      brandSettings: {},
      siteSettings: {},
    },
  }
}

function write(json: unknown): string {
  const file = path.join(mkdtempSync(path.join(tmpdir(), 'snapshot-')), 'snapshot.json')
  writeFileSync(file, JSON.stringify(json))
  return file
}

describe('parseSnapshot', () => {
  it('accepts a valid snapshot and keeps document fields', () => {
    expect(parseSnapshot(snapshot()).collections.projects[0]?.title).toBe('Real')
  })

  it('rejects a missing collection', () => {
    const bad = snapshot() as { collections: Partial<Record<string, unknown>> }
    delete bad.collections.media
    expect(() => parseSnapshot(bad)).toThrow()
  })

  it('rejects another version', () => {
    expect(() => parseSnapshot({ ...snapshot(), version: 2 })).toThrow()
  })
})

describe('seedDocuments', () => {
  it('lists seeded documents and globals', () => {
    const parsed = parseSnapshot(snapshot({ seedProject: true, seedPerson: true }))
    expect(seedDocuments(parsed)).toEqual(['projects#2', 'person'])
  })
})

describe('productionSnapshotError', () => {
  it('passes real, published content', () => {
    expect(productionSnapshotError(parseSnapshot(snapshot()))).toBeNull()
  })

  it('fails on seed data', () => {
    expect(productionSnapshotError(parseSnapshot(snapshot({ seedProject: true })))).toMatch(
      /seed data \(projects#2\)/,
    )
  })

  it('fails on drafts', () => {
    expect(productionSnapshotError(parseSnapshot(snapshot({ drafts: true })))).toMatch(/drafts/)
  })
})

describe('loadSnapshot', () => {
  it('refuses seed data in a production build', () => {
    const file = write(snapshot({ seedPerson: true }))
    expect(() => loadSnapshot(file, { production: true })).toThrow(/seed data/)
  })

  it('allows seed data outside production', () => {
    const file = write(snapshot({ seedPerson: true }))
    expect(loadSnapshot(file, { production: false }).globals.person._seed).toBe(true)
  })

  it('explains a missing snapshot', () => {
    expect(() => loadSnapshot('/nonexistent/snapshot.json', { production: false })).toThrow(
      /pnpm content:export/,
    )
  })
})

describe('referencedMediaIds', () => {
  it('collects ids from populated and unpopulated refs, once each', () => {
    const projects = [{ media: [{ id: 1 }, 2] }, { media: null }] as unknown as Parameters<
      typeof referencedMediaIds
    >[0]
    const posts = [{ cover: 2 }, { cover: { id: 3 } }, { cover: null }] as unknown as Parameters<
      typeof referencedMediaIds
    >[1]
    expect(referencedMediaIds(projects, posts)).toEqual([1, 2, 3])
  })
})
