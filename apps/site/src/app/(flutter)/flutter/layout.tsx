import '@mosaic/tokens/flutter.css'
import { themeClass } from '@mosaic/tokens'
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google'
import type { ReactNode } from 'react'
import { CrossLinks } from '../../../components/CrossLinks'

const sans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body-family',
})
const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono-family',
})

// Flutter experience: Swiss grid, mono details, data tables (design checkpoint, 2026-10-31).
export default function FlutterLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${themeClass.flutter} ${sans.variable} ${mono.variable} gridlines min-h-screen bg-bg font-body text-fg antialiased [--font-display-family:var(--font-body-family)]`}
    >
      {children}
      <footer className="mx-auto max-w-6xl px-5 pb-10 sm:px-8">
        <CrossLinks
          current="flutter"
          className="border-t border-fg pt-4 font-mono text-xs text-muted"
        />
      </footer>
    </div>
  )
}
