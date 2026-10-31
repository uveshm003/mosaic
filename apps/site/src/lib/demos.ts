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
  {
    slug: 'dashboard',
    title: 'Device dashboard',
    blurb:
      'A simulated fleet of field sensors: live charts, threshold alerts, and an offline queue that syncs when the connection returns.',
    shows: ['ChangeNotifier', 'CustomPainter', 'Adaptive layout', 'Offline-first'],
  },
  {
    slug: 'state',
    title: 'State visualiser',
    blurb:
      'A small shop on Riverpod beside a live graph of its providers. See what recomputes, and what select saves.',
    shows: ['Riverpod 3', 'ProviderObserver', 'select', 'Derived state'],
  },
  {
    slug: 'game',
    title: 'Hot reload',
    blurb:
      'A small Flame arcade game: squash the bugs before they reach your build, with Flutter menus over the game canvas.',
    shows: ['Flame', 'Components', 'Particles', 'Overlays'],
  },
]

export const demoSrc = (slug: string) => `/flutter/demos/${slug}/index.html`
export const demoPoster = (slug: string) => `/flutter/posters/${slug}.webp`
