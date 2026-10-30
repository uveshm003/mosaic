import type { Metadata } from 'next'
import Link from 'next/link'
import { RichText } from '../../../components/RichText'
import { listingProfiles, person, profile } from '../../../lib/content'

export const metadata: Metadata = { title: 'Direction A · Editorial' }

export default function EditorialHome() {
  const me = person()
  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
      <header className="border-b border-line pt-10 pb-12 sm:pt-16">
        <p className="text-xs tracking-[0.25em] text-muted uppercase">
          {[me.headlines?.[0]?.text, me.location].filter(Boolean).join(' · ')}
        </p>
        <h1 className="mt-6 font-display text-[clamp(3.2rem,11vw,9.5rem)] leading-[0.88] font-light tracking-[-0.03em] [font-variation-settings:'opsz'_144,'SOFT'_50]">
          {me.name}
        </h1>
      </header>

      <section className="reveal grid gap-10 border-b border-line py-14 lg:grid-cols-[1fr_2fr]">
        <h2 className="font-display text-2xl italic">About</h2>
        <div className="dropcap max-w-prose space-y-5 text-lg leading-relaxed text-fg/90">
          <RichText value={me.about} />
        </div>
      </section>

      <nav aria-label="Profiles" className="reveal py-14">
        <h2 className="font-display text-2xl italic">Profiles</h2>
        <ol className="mt-8 divide-y divide-line border-y border-line">
          {listingProfiles.map(({ key, label }, index) => {
            const built = key === 'flutter'
            const row = (
              <>
                <span className="font-display text-sm text-accent tabular-nums">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="font-display text-[clamp(1.8rem,5vw,3.4rem)] leading-none">
                  <span className={built ? 'sweep' : ''}>{label}</span>
                </span>
                <span className="hidden max-w-xs text-sm text-muted sm:block">
                  {built ? profile(key).tagline : 'Not built in this preview'}
                </span>
                <span
                  aria-hidden
                  className="text-2xl transition-transform group-hover:translate-x-1"
                >
                  {built ? '→' : ''}
                </span>
              </>
            )
            const layout =
              'grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 py-6 sm:grid-cols-[3rem_1fr_18rem_2rem]'
            return (
              <li key={key}>
                {built ? (
                  <Link
                    href="/directions/editorial/flutter"
                    className={`group ${layout} focus-visible:outline-2 focus-visible:outline-accent`}
                  >
                    {row}
                  </Link>
                ) : (
                  <div className={`${layout} opacity-45`}>{row}</div>
                )}
              </li>
            )
          })}
        </ol>
      </nav>

      <footer className="flex flex-wrap justify-between gap-4 border-t border-line pt-6 text-sm text-muted">
        <span>Direction A · Editorial</span>
        <Link href="/directions" className="sweep">
          All directions
        </Link>
      </footer>
    </main>
  )
}
