import { brandName, brandPosts } from '../../lib/content'
import { buildRss } from '../../lib/rss'
import { BRAND_URL } from '../../lib/site'

export const dynamic = 'force-static'

export function GET() {
  const xml = buildRss(brandPosts(), {
    title: brandName(),
    url: BRAND_URL,
    description: 'Brands, campaigns and the thinking behind them.',
  })
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
