import '@mosaic/tokens/root.css'
import { themeClass } from '@mosaic/tokens'
import { Fraunces, Inter } from 'next/font/google'
import type { ReactNode } from 'react'

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display-family',
  axes: ['opsz', 'SOFT'],
})
const body = Inter({ subsets: ['latin'], variable: '--font-body-family' })

// Root experience: editorial, warm paper, serif display (design checkpoint, 2026-10-31).
export default function RootExperienceLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${themeClass.root} ${display.variable} ${body.variable} min-h-screen bg-bg font-body text-fg antialiased selection:bg-accent selection:text-accent-fg`}
    >
      {children}
    </div>
  )
}
