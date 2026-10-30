import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Design directions', robots: { index: false } }

const directions = [
  {
    slug: 'editorial',
    name: 'A · Editorial',
    note: 'Warm paper, big serif type, magazine rhythm. Calm and personal; reads like a long-form profile.',
  },
  {
    slug: 'studio',
    name: 'B · Night studio',
    note: 'Dark, immersive, gradient light and motion. Product-launch energy; most "wow", most visual noise.',
  },
  {
    slug: 'spec',
    name: 'C · Spec sheet',
    note: 'Swiss grid, mono details, data tables. Precise and technical; lets the work speak.',
  },
]

// Review page for picking a direction. Lives on a branch only; never deployed.
export default function Directions() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16 font-sans">
      <h1 className="text-3xl font-semibold">Design directions</h1>
      <p className="mt-3 text-neutral-600">
        Root page and Flutter profile in three directions, on seed data. Pick one, or mix parts.
      </p>
      <ul className="mt-10 space-y-4">
        {directions.map((d) => (
          <li key={d.slug} className="rounded-xl border border-neutral-300 p-5">
            <h2 className="text-xl font-medium">{d.name}</h2>
            <p className="mt-1 text-neutral-600">{d.note}</p>
            <p className="mt-3 flex gap-4 text-sm">
              <Link className="underline" href={`/directions/${d.slug}`}>
                Root page
              </Link>
              <Link className="underline" href={`/directions/${d.slug}/flutter`}>
                Flutter profile
              </Link>
            </p>
          </li>
        ))}
      </ul>
    </main>
  )
}
