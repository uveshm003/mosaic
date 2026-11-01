// The brand lives under /brand on the personal site's address (ADR 0002).
export const SITE_ORIGIN = 'https://uveshm003.github.io'
export const BRAND_URL = `${SITE_ORIGIN}/brand`

/** The personal site, outside the brand's base path; its own dev server in development. */
export const personalSiteUrl =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000/' : `${SITE_ORIGIN}/`
