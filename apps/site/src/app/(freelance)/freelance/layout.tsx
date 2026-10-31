import '@mosaic/tokens/freelance.css'
import { themeClass } from '@mosaic/tokens'
import { DM_Mono, DM_Sans } from 'next/font/google'
import type { ReactNode } from 'react'
import { CrossLinks } from '../../../components/CrossLinks'

const sans = DM_Sans({ subsets: ['latin'], variable: '--font-body-family' })
const mono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono-family' })

// Freelance experience: a friendly blueprint for founders and small teams.
export default function FreelanceLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${themeClass.freelance} ${sans.variable} ${mono.variable} min-h-screen bg-bg font-body text-fg antialiased selection:bg-accent selection:text-accent-fg`}
    >
      {children}
      <footer className="mx-auto max-w-6xl border-t border-line px-5 py-8 sm:px-8">
        <CrossLinks current="freelance" className="text-sm text-muted" />
      </footer>
    </div>
  )
}
