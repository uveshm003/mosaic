import '@mosaic/tokens/flutter.css'
import { themeClass } from '@mosaic/tokens'
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from 'next/font/google'
import type { ReactNode } from 'react'
import { CrossLinks } from '../../../components/CrossLinks'

const display = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-display-family' })
const body = Inter({ subsets: ['latin'], variable: '--font-body-family' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono-family' })

// Flutter experience: playful developer portfolio, moved from the root (2026-10-31).
export default function FlutterLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${themeClass.flutter} ${display.variable} ${body.variable} ${mono.variable} relative min-h-screen bg-bg font-body text-fg antialiased selection:bg-accent selection:text-accent-fg`}
    >
      {children}
      <footer className="relative z-10 mx-auto max-w-7xl px-6 pb-10 lg:px-12">
        <CrossLinks current="flutter" className="pt-6 text-sm text-muted" />
      </footer>
    </div>
  )
}
