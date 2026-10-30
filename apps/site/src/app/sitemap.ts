import type { MetadataRoute } from 'next'
import { SITE_URL } from '../lib/site'

export const dynamic = 'force-static'

// The personal site only; /brand stays out while it is noindex (ADR 0002).
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${SITE_URL}/` }]
}
