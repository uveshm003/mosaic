import type { Metadata } from 'next'
import Link from 'next/link'
import { RichText } from '../../../components/RichText'
import { listingProfiles, person, profile } from '../../../lib/content'

export const metadata: Metadata = { title: 'Direction C · Spec sheet' }

export default function SpecHome() {
  const me = person()
  return (
    <main className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
      <header className="grid gap-8 border-b border-fg pt-10 pb-10 sm:pt-16 lg:grid-cols-12">
        <h1 className="text-[clamp(2.6rem,7.5vw,6rem)] leading-[0.95] font-semibold tracking-[-0.035em] lg:col-span-8">
          {me.name}
        </h1>
        <dl className="grid grid-cols-[6rem_1fr] content-end gap-y-2 font-mono text-xs lg:col-span-4">
          <dt className="text-muted">ROLE</dt>
          <dd>{me.headlines?.[0]?.text}</dd>
          <dt className="text-muted">BASED</dt>
          <dd>{me.location}</dd>
          <dt className="text-muted">PROFILES</dt>
          <dd>{listingProfiles.length}</dd>
        </dl>
      </header>

      <section
        className="grid gap-8 border-b border-line py-12 lg:grid-cols-12"
        aria-labelledby="spec-about"
      >
        <h2 id="spec-about" className="font-mono text-xs text-muted lg:col-span-3">
          [01] ABOUT
        </h2>
        <div className="max-w-prose space-y-4 text-[1.05rem] leading-[1.7] lg:col-span-7">
          <RichText value={me.about} />
        </div>
      </section>

      <nav className="grid gap-8 py-12 lg:grid-cols-12" aria-labelledby="spec-profiles">
        <h2 id="spec-profiles" className="font-mono text-xs text-muted lg:col-span-3">
          [02] PROFILES
        </h2>
        <ul className="border-t border-fg lg:col-span-9">
          {listingProfiles.map(({ key, label }, index) => {
            const built = key === 'flutter'
            const cells = (
              <>
                <span className="font-mono text-xs text-muted">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-xl font-medium">{label}</span>
                <span className="hidden text-sm text-muted md:block">
                  {built ? profile(key).tagline : '—'}
                </span>
                <span className="text-right font-mono text-xs">{built ? 'OPEN →' : 'N/A'}</span>
              </>
            )
            const layout =
              'grid grid-cols-[2.5rem_1fr_5rem] items-center gap-4 border-b border-line px-1 py-4 md:grid-cols-[2.5rem_12rem_1fr_5rem]'
            return (
              <li key={key}>
                {built ? (
                  <Link
                    href="/directions/spec/flutter"
                    className={`row-link ${layout} focus-visible:outline-2 focus-visible:outline-accent`}
                  >
                    {cells}
                  </Link>
                ) : (
                  <div className={`${layout} text-muted`}>{cells}</div>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      <footer className="flex justify-between border-t border-fg pt-4 font-mono text-xs text-muted">
        <span>DIRECTION C / SPEC SHEET</span>
        <Link href="/directions" className="hover:text-fg">
          ALL DIRECTIONS
        </Link>
      </footer>
    </main>
  )
}
