// The public demo admin's read-only login. It is published on the demo's banner, so it
// is not a secret; the nightly reset restores it if anything changes.
export const demoReviewer = {
  email: 'reviewer@example.com',
  password: 'mosaic-demo-reviewer',
} as const
