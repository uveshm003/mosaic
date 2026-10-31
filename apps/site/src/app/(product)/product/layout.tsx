import '@mosaic/tokens/product.css'
import { themeClass } from '@mosaic/tokens'
import { Figtree, IBM_Plex_Mono, Newsreader } from 'next/font/google'
import type { ReactNode } from 'react'
import { CrossLinks } from '../../../components/CrossLinks'

const serif = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-display-family',
})
const sans = Figtree({ subsets: ['latin'], variable: '--font-body-family' })
const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono-family',
})

// Product experience: memo pages with a canvas underneath.
export default function ProductLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${themeClass.product} ${serif.variable} ${sans.variable} ${mono.variable} min-h-screen bg-bg font-body text-fg antialiased selection:bg-accent-2 selection:text-[var(--sticky-fg)]`}
    >
      {children}
      <footer className="mx-auto max-w-5xl border-t border-line px-5 py-8">
        <CrossLinks current="product" className="text-sm text-muted" />
      </footer>
    </div>
  )
}
