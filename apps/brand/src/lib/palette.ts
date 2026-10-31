import type { BrandPostType } from './content'

/** One loud colour per post type, with the ink that reads on it. */
export const typeColor: Record<BrandPostType, { bg: string; fg: string }> = {
  essay: { bg: '#ff3b1f', fg: '#ffffff' },
  'brand-breakdown': { bg: '#2f43ff', fg: '#ffffff' },
  'campaign-concept': { bg: '#c8ff3d', fg: '#0e0e0e' },
  'book-notes': { bg: '#ffb800', fg: '#0e0e0e' },
  'research-note': { bg: '#ff6fae', fg: '#0e0e0e' },
  video: { bg: '#0e0e0e', fg: '#f3f0e8' },
  teardown: { bg: '#7b2cff', fg: '#ffffff' },
  'improvement-proposal': { bg: '#00b37e', fg: '#0e0e0e' },
  'case-study': { bg: '#f3f0e8', fg: '#0e0e0e' },
}
