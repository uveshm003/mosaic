import type { Metadata } from 'next'
import Link from 'next/link'
import { RichText } from '../../../components/RichText'
import { listingProfiles, person, profile } from '../../../lib/content'

export const metadata: Metadata = { title: 'Direction B · Night studio' }

export default function StudioHome() {
  const me = person()
  return (
    <main className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
      <section className="flex min-h-[88vh] flex-col justify-center py-16">
        <p className="font-mono text-xs text-muted">
          <span className="text-accent">~/</span>
          {me.location?.toLowerCase().replaceAll(' ', '-')}
        </p>
        <h1 className="gradient-text mt-5 font-display text-[clamp(3rem,10vw,8.5rem)] leading-[0.92] font-semibold tracking-[-0.045em]">
          {me.name}
        </h1>
        <p className="caret mt-6 font-mono text-[clamp(0.95rem,2vw,1.2rem)] text-muted">
          {me.headlines?.[0]?.text}
        </p>
        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/directions/studio/flutter"
            className="rounded-full bg-fg px-6 py-3 text-sm font-semibold text-bg transition hover:shadow-[0_0_40px_-6px_var(--accent)]"
          >
            Explore Flutter work
          </Link>
          <a
            href="#about"
            className="glass rounded-full px-6 py-3 text-sm transition hover:border-accent"
          >
            About
          </a>
        </div>
      </section>

      <section
        id="about"
        className="glass grid gap-8 rounded-3xl p-7 sm:p-12 lg:grid-cols-[1fr_2fr]"
      >
        <h2 className="font-mono text-xs tracking-widest text-accent uppercase">About</h2>
        <div className="space-y-5 text-lg leading-relaxed text-fg/85">
          <RichText value={me.about} />
        </div>
      </section>

      <nav aria-label="Profiles" className="mt-16">
        <h2 className="font-mono text-xs tracking-widest text-accent uppercase">Profiles</h2>
        <ul className="mt-6 grid auto-rows-[minmax(7.5rem,auto)] gap-4 sm:grid-cols-3">
          {listingProfiles.map(({ key, label }) => {
            const built = key === 'flutter'
            return (
              <li key={key} className={built ? 'sm:col-span-2 sm:row-span-3' : ''}>
                {built ? (
                  <Link
                    href="/directions/studio/flutter"
                    className="glass group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-7 transition hover:border-accent focus-visible:outline-2 focus-visible:outline-accent"
                  >
                    <span
                      aria-hidden
                      className="absolute -right-16 -bottom-24 size-72 rounded-full bg-[radial-gradient(circle,var(--accent),var(--accent-2)_45%,transparent_70%)] opacity-50 blur-2xl transition-transform duration-700 group-hover:scale-110"
                    />
                    <span className="font-mono text-xs text-muted">profile / 01</span>
                    <span className="relative">
                      <span className="block font-display text-5xl font-semibold tracking-tight sm:text-7xl">
                        {label}
                      </span>
                      <span className="mt-3 block max-w-md text-muted">{profile(key).tagline}</span>
                    </span>
                  </Link>
                ) : (
                  <div className="glass flex h-full flex-col justify-between rounded-3xl p-6 opacity-50">
                    <span className="font-mono text-xs text-muted">not in preview</span>
                    <span className="font-display text-2xl font-semibold">{label}</span>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      <footer className="mt-20 flex justify-between font-mono text-xs text-muted">
        <span>direction-b // night-studio</span>
        <Link href="/directions" className="hover:text-fg">
          all directions →
        </Link>
      </footer>
    </main>
  )
}
