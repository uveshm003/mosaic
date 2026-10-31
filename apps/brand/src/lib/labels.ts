import type { Post } from '@mosaic/content/payload-types'

// Labels come from the post type, never from content, so a concept can't pass for
// commissioned work and analysis can't read as endorsed (spec: Content ground rules).
export function automaticLabel(type: Post['type'], subject?: string | null): string | null {
  switch (type) {
    case 'campaign-concept':
      return 'Concept, not commissioned work.'
    case 'brand-breakdown':
    case 'teardown':
    case 'improvement-proposal': {
      const name = subject?.trim() || 'the companies discussed'
      return `Independent analysis. Not affiliated with ${name}${name.endsWith('.') ? '' : '.'}`
    }
    default:
      return null
  }
}
