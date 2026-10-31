import '@mosaic/tokens/root.css'
import { themeClass } from '@mosaic/tokens'
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from 'next/font/google'
import type { ReactNode } from 'react'

const display = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-display-family' })
const body = Inter({ subsets: ['latin'], variable: '--font-body-family' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono-family' })

// Root experience: playful and interactive, developer-portfolio layout (design interview, 2026-10-31).
export default function RootExperienceLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${themeClass.root} ${display.variable} ${body.variable} ${mono.variable} relative min-h-screen bg-bg font-body text-fg antialiased selection:bg-accent selection:text-accent-fg`}
    >
      {children}
    </div>
  )
}
