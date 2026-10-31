// The Flutter demos built from demos/flutter by `pnpm demos:build`. They are code in this
// repo, not CMS content, so the list lives here.
export interface FlutterDemo {
  slug: string
  title: string
  blurb: string
  shows: string[]
}

export const flutterDemos: FlutterDemo[] = [
  {
    slug: 'animations',
    title: 'Animation lab',
    blurb:
      'Curves, implicit animations, Hero transitions and a staggered list, each with the Dart that drives it.',
    shows: ['AnimationController', 'Hero', 'PageRouteBuilder', 'CustomPainter'],
  },
]

export const demoSrc = (slug: string) => `/flutter/demos/${slug}/index.html`
export const demoPoster = (slug: string) => `/flutter/posters/${slug}.webp`
