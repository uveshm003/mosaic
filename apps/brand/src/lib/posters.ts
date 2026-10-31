import type { Post } from '@mosaic/content/payload-types'
import type { Poster } from '../components/PosterWall'
import { displayTitle, excerpt, formatDate, postPath, typeLabel } from './content'
import { automaticLabel } from './labels'
import { typeColor } from './palette'

export function toPoster(p: Post): Poster {
  return {
    id: p.id,
    href: postPath(p),
    draft: p._status === 'draft',
    title: displayTitle(p.title),
    type: p.type,
    typeLabel: typeLabel[p.type],
    date: formatDate(p.publishedAt, 'month'),
    excerpt: excerpt(p, 160),
    label: automaticLabel(p.type, p.subject),
    bg: typeColor[p.type].bg,
    fg: typeColor[p.type].fg,
    series: p.series ? displayTitle(p.series) : null,
  }
}
