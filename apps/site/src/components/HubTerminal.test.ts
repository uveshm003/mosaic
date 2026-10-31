import { describe, expect, it } from 'vitest'
import { resolveCd } from './HubTerminal'

const portfolios = [
  { key: 'flutter', label: 'Flutter', description: '', href: '/flutter' },
  { key: 'product', label: 'Product', description: '', href: null },
]

describe('resolveCd', () => {
  it('opens a built portfolio, with or without a trailing slash', () => {
    expect(resolveCd('flutter', portfolios)).toEqual({
      href: '/flutter',
      message: 'Opening Flutter…',
    })
    expect(resolveCd('flutter/', portfolios).href).toBe('/flutter')
  })

  it('does not navigate to a portfolio that is not built yet', () => {
    expect(resolveCd('product', portfolios)).toEqual({
      href: null,
      message: 'Product is coming later.',
    })
  })

  it('rejects unknown names and a bare cd', () => {
    expect(resolveCd('brand', portfolios).href).toBeNull()
    expect(resolveCd(undefined, portfolios).message).toContain('no such portfolio')
  })
})
