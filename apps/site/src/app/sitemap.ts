import type { MetadataRoute } from 'next'
import { isEnabled, projectsFor } from '../lib/content'
import { SITE_URL } from '../lib/site'

export const dynamic = 'force-static'

// Enabled pages of the personal site only; /brand stays out while it is noindex (ADR 0002).
export default function sitemap(): MetadataRoute.Sitemap {
  const urls = ['/']
  if (isEnabled('flutter')) {
    urls.push('/flutter', ...projectsFor('flutter').map(({ slug }) => `/flutter/${slug}`))
  }
  return urls.map((path) => ({ url: `${SITE_URL}${path}` }))
}
