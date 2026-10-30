import type { MetadataRoute } from 'next'
import { SITE_URL } from '../lib/site'

export const dynamic = 'force-static'

// /brand isn't disallowed: crawlers need to reach it to see its noindex tag.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
