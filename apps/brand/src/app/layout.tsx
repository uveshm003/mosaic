import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { getSnapshot } from '../lib/snapshot'
import './globals.css'

export const metadata: Metadata = {
  title: 'Coming soon',
  // Stays noindex until the brand-name checkpoint.
  robots: { index: false, follow: false },
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
