'use client'

import { useSyncExternalStore } from 'react'

// Shared state for the split stage: what the fixed half shows follows the reading column.
export type StageScene = 'run' | 'work' | 'lab' | 'devices'

export interface FlutterState {
  scene: StageScene
  project: number | null
  count: number
  hue: number
  radius: number
  dark: boolean
}

let state: FlutterState = {
  scene: 'run',
  project: null,
  count: 0,
  hue: 145,
  radius: 16,
  dark: false,
}
const listeners = new Set<() => void>()

export function setFlutter(
  patch: Partial<FlutterState> | ((s: FlutterState) => Partial<FlutterState>),
) {
  state = { ...state, ...(typeof patch === 'function' ? patch(state) : patch) }
  for (const listener of listeners) listener()
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function useFlutter<T>(select: (s: FlutterState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => select(state),
    () => select(state),
  )
}
