import type { WorkCard } from '../components/product/WorkIndex'
import {
  formatMonth,
  productKindLabel,
  productKindSlug,
  productLabel,
  type ProductItem,
} from './content'

/** Dev seed titles carry "Sample:"; memo headings would repeat it. */
export const strip = (text: string) => text.replace(/^Sample: /, '')

export const productHref = (item: Pick<ProductItem, 'kind' | 'slug'>) =>
  `/product/${productKindSlug[item.kind]}/${item.slug}`

/** Which canvas parts an item has, for its card. */
export function canvasParts(item: ProductItem): string[] {
  const c = item.canvas
  if (!c) return []
  return [
    ...(c.journey.length ? ['journey'] : []),
    ...(c.decisions.length ? ['decisions'] : []),
    ...(c.comparison ? ['before/after'] : []),
  ]
}

export function toCard(item: ProductItem): WorkCard {
  return {
    kind: item.kind,
    kindLabel: productKindLabel[item.kind],
    href: productHref(item),
    title: strip(item.title),
    summary: item.summary,
    // Undated work shows no date rather than "Now".
    date: item.date ? formatMonth(item.date) : '',
    label: productLabel(item),
    canvas: canvasParts(item),
  }
}
