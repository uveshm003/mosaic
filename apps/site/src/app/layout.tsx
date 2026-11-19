import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { getSnapshot } from '../lib/snapshot'
import { shareImages } from '../lib/seo'
import { SITE_NAME, SITE_URL } from '../lib/site'
import './globals.css'

// Pages set their own tags through pageMetadata (lib/seo.ts); these are the fallbacks.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
  openGraph: { type: 'website', siteName: SITE_NAME, images: shareImages('root') },
  twitter: { card: 'summary_large_image', images: shareImages('root') },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  // Runs the production guard on every build, before any page reads content.
  getSnapshot()
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
