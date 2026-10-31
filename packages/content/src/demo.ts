// The public demo admin's read-only login. It is published on the demo's banner and the
// Full-stack case study, so it is not a secret; the nightly reset restores it.
export const demoReviewer = {
  email: 'reviewer@example.com',
  password: 'mosaic-demo-reviewer',
} as const
