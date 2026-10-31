import { themeClass } from '@mosaic/tokens'
import '@mosaic/tokens/brand.css'
import type { Metadata } from 'next'
import { Instrument_Serif, Inter_Tight } from 'next/font/google'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { brandName, brandPosts, typeLabel, typeSlug, typesWithPosts } from '../lib/content'
import { BRAND_URL, personalSiteUrl } from '../lib/site'
import { getSnapshot } from '../lib/snapshot'
import './globals.css'

const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif-family',
})
const sans = Inter_Tight({ subsets: ['latin'], variable: '--font-body-family' })

export function generateMetadata(): Metadata {
  const name = brandName()
  return {
    metadataBase: new URL(`${BRAND_URL}/`),
    title: { default: name, template: `%s · ${name}` },
    description: 'Brands, campaigns and the thinking behind them.',
    alternates: { types: { 'application/rss+xml': `${BRAND_URL}/rss.xml` } },
    // Stays noindex until the brand-name checkpoint.
    robots: { index: false, follow: false },
  }
}

export default function RootLayout({ children }: { children: ReactNode }) {
  // Runs the production guard on every build, before any page reads content.
  getSnapshot()
  const name = brandName()
  const types = typesWithPosts(brandPosts())

  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className={`${themeClass.brand} min-h-svh bg-bg font-body text-fg antialiased`}>
        <a
          href="#main"
          className="sr-only z-50 bg-fg px-4 py-2 text-bg focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
        >
          Skip to content
        </a>
        <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-5 sm:px-10">
          <Link href="/" className="font-serif text-2xl italic">
            {name}
          </Link>
          {types.length > 0 && (
            <nav aria-label="Kinds of post">
              <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold">
                {types.map((t) => (
                  <li key={t}>
                    <Link href={`/${typeSlug[t]}`} className="hover:text-accent">
                      {typeLabel[t]}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </header>
        <main id="main">{children}</main>
        <footer className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t-2 border-fg px-5 py-10 sm:px-10">
          <p className="font-serif text-[clamp(2.5rem,7vw,6rem)] leading-none italic">{name}</p>
          <ul className="flex gap-6 text-sm font-semibold">
            <li>
              <a href={`${BRAND_URL}/rss.xml`} className="hover:text-accent">
                RSS
              </a>
            </li>
            <li>
              <a href={personalSiteUrl} className="hover:text-accent">
                Uvesh Menpurwala ↗
              </a>
            </li>
          </ul>
        </footer>
      </body>
    </html>
  )
}
