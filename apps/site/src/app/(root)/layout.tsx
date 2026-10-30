import '@mosaic/tokens/root.css'
import { themeClass } from '@mosaic/tokens'
import localFont from 'next/font/local'
import type { ReactNode } from 'react'
import { Reveal } from '../../components/hub/Reveal'

// Erode by the Indian Type Foundry, self-hosted (Fontshare free licence).
const erode = localFont({
  src: [
    { path: '../../fonts/erode/erode-400.woff2', weight: '400', style: 'normal' },
    { path: '../../fonts/erode/erode-400-italic.woff2', weight: '400', style: 'italic' },
    { path: '../../fonts/erode/erode-500.woff2', weight: '500', style: 'normal' },
    { path: '../../fonts/erode/erode-600.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-display-family',
  display: 'swap',
})

// Root hub: "The name as a monument", stone and blueprint (design interview, 2026-10-31).
export default function RootHubLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${themeClass.root} ${erode.variable} min-h-screen bg-bg font-display text-[length:var(--step-body)] text-fg antialiased [--font-body-family:var(--font-display-family)] selection:bg-accent selection:text-accent-fg`}
    >
      <script
        dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
      />
      {children}
      <Reveal />
    </div>
  )
}
