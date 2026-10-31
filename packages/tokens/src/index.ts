// Each experience has its own theme: CSS custom properties on a wrapper class, read by the
// site's Tailwind tokens (apps/site/src/app/globals.css). Import the CSS per route group.
export const themeClass = {
  root: 'theme-root',
  flutter: 'theme-flutter',
  freelance: 'theme-freelance',
  fullstack: 'theme-fullstack',
  product: 'theme-product',
  brand: 'theme-brand',
} as const
