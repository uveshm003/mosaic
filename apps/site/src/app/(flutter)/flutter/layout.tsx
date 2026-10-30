import '@mosaic/tokens/flutter.css'
import { themeClass } from '@mosaic/tokens'
import localFont from 'next/font/local'
import type { ReactNode } from 'react'
import { Reveal } from '../../../components/Reveal'

// Pilcrow Rounded by the Indian Type Foundry, self-hosted (Fontshare free licence).
const pilcrow = localFont({
  src: [
    { path: '../../../fonts/pilcrow/pilcrow-rounded-400.woff2', weight: '400', style: 'normal' },
    { path: '../../../fonts/pilcrow/pilcrow-rounded-500.woff2', weight: '500', style: 'normal' },
    { path: '../../../fonts/pilcrow/pilcrow-rounded-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-display-family',
  display: 'swap',
})

// Flutter experience: "The split stage", blush, sage and slate (design interview, 2026-10-31).
export default function FlutterLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${themeClass.flutter} ${pilcrow.variable} min-h-screen bg-bg font-display text-[length:var(--step-body)] text-fg antialiased [--font-body-family:var(--font-display-family)] selection:bg-accent selection:text-accent-fg`}
    >
      <script
        dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
      />
      {children}
      <Reveal />
    </div>
  )
}
