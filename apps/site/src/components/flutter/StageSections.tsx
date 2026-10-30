'use client'

import { useEffect } from 'react'
import { setFlutter, type StageScene } from './store'

// Sections marked data-scene tell the stage what to show while they are being read.
export function StageSections() {
  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>('[data-scene]')]
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        const top = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        const scene = top?.target.getAttribute('data-scene') as StageScene | null
        if (scene) setFlutter({ scene })
      },
      { rootMargin: '-40% 0px -50% 0px' },
    )
    sections.forEach((s) => io.observe(s))
    return () => {
      io.disconnect()
    }
  }, [])
  return null
}
