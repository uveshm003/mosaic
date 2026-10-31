'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

interface StackState {
  tech: string | null
  setTech: (tech: string | null) => void
}

const StackContext = createContext<StackState>({ tech: null, setTech: () => undefined })

// The technology picked in the stack explorer (or the command palette); diagrams and
// project rows light up where it is used.
export function StackProvider({ children }: { children: ReactNode }) {
  const [tech, setTech] = useState<string | null>(null)
  return <StackContext value={{ tech, setTech }}>{children}</StackContext>
}

export const useStack = () => useContext(StackContext)

/** Dimmed when a technology is picked and this thing doesn't use it. */
export function useDimmed(uses: (string | null)[]): boolean {
  const { tech } = useStack()
  return tech !== null && !uses.includes(tech)
}
