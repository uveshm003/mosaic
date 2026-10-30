import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { referencedMediaIds } from './export'
import { productionSnapshotError, seedDocuments } from './guard'
import { loadBuildSnapshot, loadSnapshot } from './load'
import { parseSnapshot, SNAPSHOT_PATH, SNAPSHOT_VERSION } from './schema'

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
  const block = (blockType: string, fields: Record<string, unknown>) => ({
    type: 'block',
    version: 2,
    fields: { id: 'x', blockName: '', blockType, ...fields },
  })
  const doc = (...children: unknown[]) => ({ root: { type: 'root', children } })

  it('collects project media, post covers and rich-text images, once each', () => {
    const content = {
      projects: [
        {
          media: [{ id: 1 }, 2],
          body: doc({ type: 'paragraph', children: [block('image', { image: 4 })] }),
        },
        { media: null, body: null },
      ],
      posts: [
        { cover: 2, body: doc(block('flutterDemo', { poster: { id: 5 } })) },
        { cover: { id: 3 }, body: doc(block('callout', { text: 'no media' })) },
      ],
      person: { about: doc(block('image', { image: { id: 6 } })) },
    } as unknown as Parameters<typeof referencedMediaIds>[0]
    expect(referencedMediaIds(content).sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6])
  })
})

describe('loadBuildSnapshot', () => {
  function repoWith(json: unknown): string {
    const root = mkdtempSync(path.join(tmpdir(), 'repo-'))
    const file = path.join(root, SNAPSHOT_PATH)
    mkdirSync(path.dirname(file), { recursive: true })
    writeFileSync(file, JSON.stringify(json))
    return root
  }
  const emptyRepo = () => mkdtempSync(path.join(tmpdir(), 'repo-'))

  it('fails a production build on seed data', () => {
    const repoRoot = repoWith(snapshot({ seedProject: true }))
    expect(() => loadBuildSnapshot({ repoRoot, env: { APP_ENV: 'production' } })).toThrow(
      /seed data/,
    )
  })

  it('requires a snapshot in production unless explicitly allowed', () => {
    const repoRoot = emptyRepo()
    expect(() => loadBuildSnapshot({ repoRoot, env: { APP_ENV: 'production' } })).toThrow(
      /need a snapshot/,
    )
    expect(
      loadBuildSnapshot({
        repoRoot,
        env: { APP_ENV: 'production', MOSAIC_ALLOW_MISSING_SNAPSHOT: '1' },
      }),
    ).toBeNull()
  })

  it('returns null without a snapshot outside production', () => {
    expect(loadBuildSnapshot({ repoRoot: emptyRepo(), env: {} })).toBeNull()
  })
})
