import type { Metadata } from 'next'
import Link from 'next/link'
import { RichText } from '../../components/RichText'
import { NameMosaic, type Slice } from '../../components/hub/NameMosaic'
import { enabledProfiles, isEnabled, person, profile, profileHref } from '../../lib/content'
import { pictures, type Picture } from '../../lib/pictures'
import { SITE_URL } from '../../lib/site'

export function generateMetadata(): Metadata {
  if (!isEnabled('root')) return {}
  const seo = profile('root')
  return { title: seo.title ?? person().name ?? undefined, description: seo.tagline ?? undefined }
}

function Placeholder() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-24">
      <h1 className="text-4xl">Uvesh Menpurwala</h1>
      <p className="mt-4 text-muted">This site is being built.</p>
    </main>
  )
}

// What each portfolio holds comes from the spec, not from content.
const portfolioMeta = [
  { key: 'flutter', label: 'Flutter', contents: 'Case studies, demo lab, writing' },
  { key: 'product', label: 'Product', contents: 'Case studies, teardowns, proposals' },
  { key: 'freelance', label: 'Freelance', contents: 'Services, selected work, contact' },
  { key: 'fullstack', label: 'Full-stack', contents: 'Systems, architecture, demo admin' },
  { key: 'brand', label: 'Brand', contents: 'Essays, breakdowns, concepts' },
] as const

const margin = 'px-[clamp(16px,1.6vw,28px)]'

function Photo({
  picture,
  className,
  priority,
}: {
  picture: Picture
  className?: string
  priority?: boolean
}) {
  return (
    // Static export: no runtime optimizer; these are pre-sized WebP files.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={picture.src}
      width={picture.width}
      height={picture.height}
      alt={picture.alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={`h-full w-full object-cover ${className ?? ''}`}
    />
  )
}

function displayLink(url: string): string {
  if (url.startsWith('mailto:')) return url.slice('mailto:'.length)
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
}

export default function Home() {
  if (!isEnabled('root')) return <Placeholder />

  const me = person()
  const fullName = (me.name ?? '').trim()
  const surname = fullName.split(/\s+/).at(-1) ?? fullName
  const role = me.headlines?.[0]?.text ?? ''
  const availability = me.headlines?.[1]?.text
  const location = me.location ?? ''
  const links = me.contactLinks ?? []
  const email = links.find((link) => link.url.startsWith('mailto:'))
  const webLinks = links.filter((link) => link.url.startsWith('http'))
  const live = new Set(enabledProfiles().map(({ key }) => key))

  const portfolios = portfolioMeta.map(({ key, label, contents }) => ({
    key,
    label,
    contents,
    description:
      key === 'brand'
        ? 'Marketing, growth, branding and advertising'
        : (profile(key).tagline ?? contents),
    href: key !== 'brand' && live.has(key) ? profileHref[key] : null,
  }))
  const slices: Slice[] = portfolios.map(({ key, label, description, href }) => ({
    key,
    label,
    description,
    href,
  }))

  const credits = Object.values(pictures).map((p) => p.credit)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: fullName,
    jobTitle: role,
    homeLocation: location ? { '@type': 'Place', name: location } : undefined,
    url: SITE_URL,
    sameAs: webLinks.map((link) => link.url),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero: the name across the middle, everything else in the four corners. */}
      <header
        className={`relative grid min-h-svh grid-rows-[auto_1fr_auto] gap-6 ${margin} pt-5 pb-6`}
      >
        <div className="flex items-start justify-between gap-6">
          <div className="max-w-[36ch]">
            <p className="text-[length:var(--step-lead)] leading-snug">
              {fullName} is a {role.toLowerCase()} in {location}.
            </p>
            <a
              href="#portfolios"
              className="press mt-4 inline-block bg-fg px-5 py-3 text-bg hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent max-sm:w-full max-sm:text-center"
            >
              See the portfolios
            </a>
          </div>
          <nav aria-label="Page" className="hidden gap-5 sm:flex">
            {[
              ['#portfolios', 'Portfolios'],
              ['#about', 'About'],
              ['#contact', 'Contact'],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="press hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-col justify-center gap-6 max-sm:justify-start max-sm:pt-[8vh]">
          <NameMosaic
            surname={surname}
            fullName={fullName}
            role={role}
            slices={slices}
            idleCaption={`${role}. Based in ${location}${availability ? `, ${availability.toLowerCase()}` : ''}.`}
            captionClassName="max-w-[44ch] sm:absolute sm:bottom-6 sm:left-[clamp(16px,1.6vw,28px)]"
          />
          {/* Phone: the first picture fills the lower half, cropped by the edge. */}
          <div className="-mx-[clamp(16px,1.6vw,28px)] aspect-[4/5] overflow-hidden sm:hidden">
            <Photo picture={pictures.stepwell} priority />
          </div>
        </div>

        <div className="hidden items-end justify-end gap-6 sm:flex">
          <ul className="flex gap-5">
            {webLinks.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  className="press hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <main>
        {/* Line-up: every cell at one size; the column starts do the organising. */}
        <section
          id="portfolios"
          aria-labelledby="portfolios-title"
          className={`${margin} py-32 lg:py-48`}
        >
          <h2
            id="portfolios-title"
            data-reveal
            className="text-[length:var(--step-lead)] leading-[1.5] text-accent"
          >
            Portfolios
          </h2>
          <ul className="mt-5 text-[length:var(--step-lead)] leading-[1.5]">
            {portfolios.map((p, row) => {
              const cells = (
                <>
                  <span>{p.label}</span>
                  <span className="text-muted max-md:text-[length:var(--step-small)] max-md:leading-normal">
                    {p.contents}
                  </span>
                  <span
                    className={`text-right max-md:text-[length:var(--step-small)] ${p.href ? '' : 'text-muted'}`}
                  >
                    {p.href ? 'Open →' : 'Coming later'}
                  </span>
                </>
              )
              const grid =
                'grid grid-cols-[1fr_auto] gap-x-6 py-1 max-md:items-baseline md:grid-cols-[24%_1fr_auto] max-md:[&>*:nth-child(2)]:col-span-2 max-md:[&>*:nth-child(2)]:row-start-2'
              return (
                <li key={p.key} data-reveal style={{ ['--i' as string]: row + 1 }}>
                  {p.href ? (
                    <Link
                      href={p.href}
                      className={`press ${grid} hover:text-accent focus-visible:outline-2 focus-visible:outline-accent [&:hover>*]:text-accent`}
                    >
                      {cells}
                    </Link>
                  ) : (
                    <div className={grid}>{cells}</div>
                  )}
                </li>
              )
            })}
          </ul>
        </section>

        {/* The city the work comes from, in pictures. */}
        <section aria-labelledby="city-title" className={`${margin} pb-32 lg:pb-48`}>
          <h2
            id="city-title"
            data-reveal
            className="text-[length:var(--step-head)] leading-[1.05] tracking-[-0.025em]"
          >
            Ahmedabad
          </h2>
          <p data-reveal style={{ ['--i' as string]: 1 }} className="mt-4 max-w-[48ch]">
            The walled city on the Sabarmati, known for its carved stone, its stepwells and the
            kites that fill the sky every January.
          </p>
          <figure data-reveal style={{ ['--i' as string]: 2 }} className="mt-12">
            <div className="aspect-[16/10] overflow-clip">
              <Photo picture={pictures.jali} className="drift" />
            </div>
            <figcaption className="mt-3 text-[length:var(--step-small)] text-muted">
              Stone jali at the Sidi Saiyyed Mosque
            </figcaption>
          </figure>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <figure data-reveal style={{ ['--i' as string]: 1 }}>
              <div className="aspect-[4/5] overflow-hidden">
                <Photo picture={pictures.stepwell} />
              </div>
              <figcaption className="mt-3 text-[length:var(--step-small)] text-muted">
                Adalaj stepwell
              </figcaption>
            </figure>
            <figure data-reveal style={{ ['--i' as string]: 2 }}>
              <div className="aspect-[4/5] overflow-hidden">
                <Photo picture={pictures.polHouse} />
              </div>
              <figcaption className="mt-3 text-[length:var(--step-small)] text-muted">
                A pol house in the old city
              </figcaption>
            </figure>
          </div>
        </section>

        {/* About: one paragraph set large, with a square picture as its drop cap. */}
        <section
          id="about"
          aria-labelledby="about-title"
          className={`${margin} grid gap-10 pb-32 lg:grid-cols-12 lg:pb-48`}
        >
          <div className="lg:col-span-2">
            <h2
              id="about-title"
              data-reveal
              className="text-[length:var(--step-head)] leading-[1.05] tracking-[-0.025em]"
            >
              About
            </h2>
            <dl
              data-reveal
              style={{ ['--i' as string]: 1 }}
              className="mt-6 space-y-4 text-[length:var(--step-small)] max-lg:flex max-lg:gap-8 max-lg:space-y-0"
            >
              <div>
                <dt className="text-muted">Based in</dt>
                <dd>{location}</dd>
              </div>
              {availability && (
                <div>
                  <dt className="text-muted">Availability</dt>
                  <dd>{availability}</dd>
                </div>
              )}
              {email && (
                <div>
                  <dt className="text-muted">Email</dt>
                  <dd>
                    <a href={email.url} className="underline underline-offset-4 hover:text-accent">
                      {displayLink(email.url)}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>
          <div
            data-reveal
            style={{ ['--i' as string]: 2 }}
            className="max-w-[60ch] text-[length:var(--step-lead)] leading-[1.35] lg:col-span-10 [&>p+p]:mt-[1em]"
          >
            <div className="float-left mr-[0.5em] mb-[0.2em] size-[3.6em] overflow-hidden max-lg:size-[110px]">
              <Photo picture={pictures.kite} />
            </div>
            <RichText value={me.about} />
          </div>
        </section>

        {/* Contact: the old map printed in blue, then the ways to reach out as display rows. */}
        <section id="contact" aria-labelledby="contact-title" className="pb-32 lg:pb-48">
          <h2
            id="contact-title"
            data-reveal
            className={`${margin} text-[length:var(--step-head)] leading-[1.05] tracking-[-0.025em]`}
          >
            Contact
          </h2>
          <figure data-reveal style={{ ['--i' as string]: 1 }} className={`${margin} mt-10`}>
            <div className="print-blue aspect-[3/1] overflow-hidden max-sm:aspect-[4/3]">
              <Photo picture={pictures.map1855} />
            </div>
          </figure>
          <ul className="mt-10 text-[length:var(--step-head)] leading-none tracking-[-0.025em] max-sm:text-[7.4vw]">
            {[
              ...links.map((link) => ({
                key: link.url,
                text: displayLink(link.url),
                href: link.url,
              })),
              { key: 'city', text: location, href: null },
            ].map((row, i) => (
              <li
                key={row.key}
                data-reveal
                style={{ ['--i' as string]: i }}
                className={i % 2 === 0 ? 'bg-surface' : ''}
              >
                {row.href ? (
                  <a
                    href={row.href}
                    className={`press flex min-h-[clamp(84px,10vw,150px)] items-end pb-[0.3em] ${margin} [overflow-wrap:anywhere] hover:text-accent focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-accent`}
                  >
                    {row.text}
                  </a>
                ) : (
                  <p
                    className={`flex min-h-[clamp(84px,10vw,150px)] items-end pb-[0.3em] ${margin}`}
                  >
                    {row.text}
                  </p>
                )}
              </li>
            ))}
            {email && (
              <li data-reveal className="max-sm:bg-accent max-sm:text-accent-fg">
                <a
                  href={email.url}
                  className={`press group flex min-h-[clamp(84px,10vw,150px)] items-end gap-6 pb-[0.3em] ${margin} focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-accent`}
                >
                  Say hello
                  <span
                    aria-hidden
                    className="mb-[0.15em] grid size-[2em] shrink-0 place-items-center rounded-full bg-accent text-[0.45em] leading-none text-accent-fg transition-transform group-hover:translate-x-2 max-sm:bg-accent-fg max-sm:text-accent"
                  >
                    →
                  </span>
                </a>
              </li>
            )}
          </ul>
        </section>
      </main>

      {/* Close: inverse colours, an invitation, and the name cut by the bottom edge. */}
      <footer className="relative flex flex-col overflow-hidden bg-fg text-bg lg:min-h-svh">
        <div className={`grid gap-10 ${margin} pt-24 lg:grid-cols-12`}>
          <div className="lg:col-span-7">
            <h2 className="text-[length:var(--step-head)] leading-[1] tracking-[-0.03em] max-sm:text-[11vw]">
              Start with the work.
            </h2>
            <a
              href="#portfolios"
              className="press mt-8 inline-block bg-accent px-5 py-3 text-accent-fg hover:bg-bg hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg max-sm:w-full max-sm:text-center"
            >
              See the portfolios
            </a>
          </div>
          <ul className="space-y-2 lg:col-span-3 lg:col-start-10 max-lg:flex max-lg:flex-wrap max-lg:gap-x-5 max-lg:space-y-0">
            {links.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  className="press hover:text-accent focus-visible:outline-2 focus-visible:outline-bg"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className={`mt-auto ${margin} pt-20 pb-4 text-[length:var(--step-small)] text-bg/70`}>
          Pictures:{' '}
          {credits.map((c, i) => (
            <span key={c.page}>
              <a href={c.page} className="underline underline-offset-2 hover:text-bg">
                {c.title}
              </a>{' '}
              by {c.creator}, {c.licence}
              {i < credits.length - 1 ? '; ' : '.'}
            </span>
          ))}
        </p>
        <p
          aria-hidden
          className="pointer-events-none h-[0.62em] text-[clamp(120px,28vw,520px)] leading-[0.9] whitespace-nowrap tracking-[-0.05em] select-none max-sm:text-[34vw]"
        >
          <span className="block translate-y-[-8%] pl-[clamp(16px,1.6vw,28px)]">{surname}</span>
        </p>
      </footer>
    </>
  )
}
