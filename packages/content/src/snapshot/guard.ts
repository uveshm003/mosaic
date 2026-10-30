import { snapshotCollections, snapshotGlobals, type Snapshot } from './schema'

/** Every seeded document in the snapshot, as `collection#id` or the global's slug. */
export function seedDocuments(snapshot: Snapshot): string[] {
  const found: string[] = []
  for (const name of snapshotCollections) {
    for (const doc of snapshot.collections[name]) {
      if (doc._seed) found.push(`${name}#${String(doc.id)}`)
    }
  }
  for (const name of snapshotGlobals) {
    if (snapshot.globals[name]._seed) found.push(name)
  }
  return found
}

/** Production builds take only published, real content. */
export function productionSnapshotError(snapshot: Snapshot): string | null {
  const seeded = seedDocuments(snapshot)
  if (seeded.length > 0) {
    const listed = seeded.slice(0, 5).join(', ')
    const more = seeded.length > 5 ? ` and ${String(seeded.length - 5)} more` : ''
    return `Snapshot contains seed data (${listed}${more}). Production builds take real content only.`
  }
  if (snapshot.drafts)
    return 'Snapshot includes drafts. Production builds take published content only.'
  return null
}
