'use client'

import { useState } from 'react'

function videoId(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname === 'youtu.be') return u.pathname.slice(1) || null
    return u.searchParams.get('v')
  } catch {
    return null
  }
}

// Nothing from YouTube loads until the visitor presses play.
export function YouTubeFacade({
  url,
  title,
  className,
}: {
  url: string
  title: string
  className?: string
}) {
  const [playing, setPlaying] = useState(false)
  const id = videoId(url)
  if (!id) return null
  return (
    <div className={`relative aspect-video overflow-hidden ${className ?? ''}`}>
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 size-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 grid place-items-center bg-[repeating-linear-gradient(135deg,transparent_0_14px,rgb(127_127_127/0.08)_14px_28px)]"
          aria-label={`Play video: ${title}`}
        >
          <span className="grid size-20 place-items-center rounded-full bg-[#ff3b1f] text-3xl text-white transition group-hover:scale-110">
            ▶
          </span>
          <span className="absolute bottom-3 left-4 text-xs">Plays from YouTube</span>
        </button>
      )}
    </div>
  )
}
