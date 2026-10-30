import { loadBuildSnapshot, type Snapshot } from '@mosaic/content/snapshot'
import path from 'node:path'

let cached: Snapshot | null | undefined

// Builds run from the app's folder; the snapshot sits at the repo root.
export function getSnapshot(): Snapshot | null {
  cached ??= loadBuildSnapshot({ repoRoot: path.resolve(process.cwd(), '../..'), env: process.env })
  return cached
}
