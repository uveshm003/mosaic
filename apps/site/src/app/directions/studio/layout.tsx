import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import type { ReactNode } from 'react'
import { Spotlight } from '../../../components/Spotlight'
import './theme.css'

const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display-family' })
const body = Inter({ subsets: ['latin'], variable: '--font-body-family' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono-family' })

export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`dir-studio ${display.variable} ${body.variable} ${mono.variable} relative min-h-screen overflow-hidden bg-bg font-body text-fg antialiased`}
    >
      <div
        aria-hidden
        className="aurora pointer-events-none absolute -inset-x-1/4 -top-1/3 h-[110vh] opacity-60"
      />
      <Spotlight className="pointer-events-none fixed inset-0 transition-opacity duration-700" />
      <div className="relative">{children}</div>
    </div>
  )
}
