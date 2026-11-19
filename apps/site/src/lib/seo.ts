import type { Metadata } from 'next'
import { SITE_NAME } from './site'

/** Social preview images in public/og/, rendered by `pnpm --filter @mosaic/e2e og:images`. */
export type ShareImage = 'root' | 'flutter' | 'product' | 'freelance' | 'fullstack'

const shareAlt: Record<ShareImage, string> = {
  root: `${SITE_NAME}: portfolio`,
  flutter: `${SITE_NAME}: Flutter portfolio`,
  product: `${SITE_NAME}: Product portfolio`,
  freelance: `${SITE_NAME}: Freelance portfolio`,
  fullstack: `${SITE_NAME}: Full-stack portfolio`,
}

export function shareImages(image: ShareImage) {
  return [{ url: `/og/${image}.png`, width: 1200, height: 630, alt: shareAlt[image] }]
}

interface PageSeo {
  /** The page's own title; the root layout's template appends the site name in <title>. */
  title: string
  description?: string | null
  /** Path from the site root, for the canonical URL and og:url. */
  path: string
  image: ShareImage
  /** For the home page, whose title is already the site name. */
  absolute?: boolean
}

/** Title, description, canonical URL and link-preview tags for one page. */
export function pageMetadata({
  title,
  description,
  path,
  image,
  absolute = false,
}: PageSeo): Metadata {
  const fullTitle = absolute ? title : `${title} · ${SITE_NAME}`
  const desc = description ?? undefined
  const images = shareImages(image)
  return {
    title: absolute ? { absolute: title } : title,
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      url: path,
      title: fullTitle,
      description: desc,
      images,
    },
    twitter: { card: 'summary_large_image', title: fullTitle, description: desc, images },
  }
}
