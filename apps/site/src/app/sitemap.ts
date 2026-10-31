import type { MetadataRoute } from 'next'
import { isEnabled, productKindSlug, productWork, projectsFor } from '../lib/content'
import { SITE_URL } from '../lib/site'

export const dynamic = 'force-static'

// Enabled pages of the personal site only; /brand stays out while it is noindex (ADR 0002).
export default function sitemap(): MetadataRoute.Sitemap {
  const urls = ['/']
  if (isEnabled('flutter')) {
    urls.push('/flutter', ...projectsFor('flutter').map(({ slug }) => `/flutter/${slug}`))
  }
  if (isEnabled('freelance')) {
    urls.push('/freelance', ...projectsFor('freelance').map(({ slug }) => `/freelance/${slug}`))
  }
  if (isEnabled('fullstack')) {
    urls.push('/fullstack', ...projectsFor('fullstack').map(({ slug }) => `/fullstack/${slug}`))
  }
  if (isEnabled('product')) {
    urls.push(
      '/product',
      ...productWork().map((w) => `/product/${productKindSlug[w.kind]}/${w.slug}`),
    )
  }
  return urls.map((path) => ({ url: `${SITE_URL}${path}` }))
}
