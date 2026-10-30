import { Fraunces, Inter } from 'next/font/google'
import type { ReactNode } from 'react'
import './theme.css'

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display-family',
  axes: ['opsz', 'SOFT'],
})
const body = Inter({ subsets: ['latin'], variable: '--font-body-family' })

export default function EditorialLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`dir-editorial ${display.variable} ${body.variable} min-h-screen bg-bg font-body text-fg antialiased selection:bg-accent selection:text-accent-fg`}
    >
      {children}
    </div>
  )
}
