import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { getSnapshot } from '../lib/snapshot'
import { SITE_URL } from '../lib/site'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Uvesh Menpurwala',
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
