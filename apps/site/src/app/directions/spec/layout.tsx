import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google'
import type { ReactNode } from 'react'
import './theme.css'

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

export default function SpecLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`dir-spec ${sans.variable} ${mono.variable} gridlines min-h-screen bg-bg font-body text-fg antialiased [--font-display-family:var(--font-body-family)]`}
    >
      {children}
    </div>
  )
}
