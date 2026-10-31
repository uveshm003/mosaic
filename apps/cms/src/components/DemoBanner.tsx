import { demoReviewer } from '@mosaic/content/payload'
import { parseCmsEnv } from '../env'

// Shown on every view of the public demo admin, the login screen included.
export function DemoBanner() {
  if (parseCmsEnv(process.env).APP_ENV !== 'demo') return null
  return (
    <div
      role="note"
      style={{
        padding: 'calc(var(--base) / 2) var(--gutter-h)',
        background: 'var(--theme-warning-100)',
        color: 'var(--theme-warning-900)',
        textAlign: 'center',
      }}
    >
      Demo data, resets nightly. Read-only login: {demoReviewer.email} / {demoReviewer.password}
    </div>
  )
}
