import type { ResumeVariant } from '@mosaic/content'
type Maybe<T> = T | null | undefined
type Variants = Maybe<readonly string[]>
type Period = Maybe<{ start?: Maybe<string>; end?: Maybe<string> }>
type Rows = Maybe<readonly { text: string; variants?: Variants }[]>

/**
 * What the resume is built from: the same content the sites use, read from the snapshot.
 * Declared structurally, so snapshot documents fit without pulling in Payload's types.
 */
export interface ResumeContent {
  person: {
    name?: Maybe<string>
    contactLinks?: Maybe<readonly { url: string }[]>
    resume?: Maybe<{
      name?: Maybe<string>
      phone?: Maybe<string>
      languages?: Maybe<string>
      headlines?: Maybe<readonly { variant: string; text: string }[]>
    }>
  }
  experience: readonly {
    title: string
    employer: string
    employerDetail?: Maybe<string>
    location?: Maybe<string>
    period?: Period
    highlights?: Rows
    variants?: Variants
    order?: Maybe<number>
  }[]
  education: readonly {
    institution: string
    degree: string
    field?: Maybe<string>
    location?: Maybe<string>
    period?: Period
    highlights?: Rows
    variants?: Variants
    order?: Maybe<number>
  }[]
  skills: readonly { name: string; category: string; variants?: Variants; order?: Maybe<number> }[]
  projects: readonly {
    title: string
    resume?: Maybe<
      readonly {
        variants?: Variants
        title?: Maybe<string>
        order?: Maybe<number>
        tagline?: Maybe<string>
        bullets?: Maybe<readonly { text: string }[]>
      }[]
    >
  }[]
}

// Month names fixed in English: Intl gives "Sept" in some locales, the resumes say "Sep".
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const month = (iso: string) => {
  const d = new Date(iso)
  return `${MONTHS[d.getUTCMonth()] ?? ''} ${String(d.getUTCFullYear())}`
}
const year = (iso: string) => String(new Date(iso).getUTCFullYear())

function range(period: Period, format: (iso: string) => string): string {
  const start = period?.start ? format(period.start) : ''
  const end = period?.end ? format(period.end) : 'Present'
  return start ? `${start} - ${end}` : end
}

/** Includes rows flagged for the variant; rows with no flags count for every variant. */
const inVariant = (variants: Variants, variant: ResumeVariant) =>
  !variants || variants.length === 0 || variants.includes(variant)

const byOrder = <T extends { order?: Maybe<number> }>(a: T, b: T) => (a.order ?? 0) - (b.order ?? 0)

/** "github.com/name" from "https://www.github.com/name/"; the address from a mailto link. */
export function linkLabel(url: string): string {
  if (url.startsWith('mailto:')) return url.slice('mailto:'.length)
  return url
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '')
}

function bullets(rows: Rows, variant: ResumeVariant) {
  return (rows ?? [])
    .filter((row) => inVariant(row.variants, variant))
    .map((row) => `- ${row.text}`)
}

/**
 * Renders one resume variant as Markdown in the exact structure of Uvesh's existing resume
 * files: name, headline, contact line, then Professional Experience, Technical Skills,
 * Technical Projects and Education, and a closing Languages line.
 */
export function renderResume(content: ResumeContent, variant: ResumeVariant): string {
  const { person } = content
  const resume = person.resume
  const lines: string[] = []
  const block = (...more: string[]) => lines.push(...more, '')

  block(`# ${resume?.name ?? person.name ?? ''}`)
  const headline = resume?.headlines?.find((h) => h.variant === variant)?.text
  if (headline) block(`**${headline}**`)
  const contact = [
    ...(resume?.phone ? [resume.phone] : []),
    ...(person.contactLinks ?? []).map((l) => `[${linkLabel(l.url)}](${l.url})`),
  ]
  if (contact.length > 0) block(contact.join(' · '))

  const jobs = content.experience.filter((e) => inVariant(e.variants, variant)).sort(byOrder)
  if (jobs.length > 0) {
    block('## Professional Experience')
    for (const job of jobs) {
      const role = job.employerDetail ? `${job.title} · ${job.employerDetail}` : job.title
      lines.push(`**${job.employer}** | ${range(job.period, month)}  `)
      block(`*${role}*${job.location ? ` | ${job.location}` : ''}`)
      const list = bullets(job.highlights, variant)
      if (list.length > 0) block(...list)
    }
  }

  const skills = content.skills.filter((s) => inVariant(s.variants, variant)).sort(byOrder)
  if (skills.length > 0) {
    block('## Technical Skills')
    const groups = new Map<string, string[]>()
    for (const s of skills) groups.set(s.category, [...(groups.get(s.category) ?? []), s.name])
    block(...[...groups].map(([category, names]) => `- **${category}:** ${names.join(', ')}`))
  }

  const projects = content.projects
    .flatMap((p) =>
      (p.resume ?? [])
        .filter((row) => inVariant(row.variants, variant))
        .slice(0, 1)
        .map((row) => ({ ...row, name: row.title ?? p.title })),
    )
    .sort(byOrder)
  if (projects.length > 0) {
    block('## Technical Projects')
    for (const p of projects) {
      block(`**${p.name}**${p.tagline ? ` | ${p.tagline}` : ''}`)
      const list = (p.bullets ?? []).map((b) => `- ${b.text}`)
      if (list.length > 0) block(...list)
    }
  }

  const schools = content.education.filter((e) => inVariant(e.variants, variant)).sort(byOrder)
  if (schools.length > 0) {
    block('## Education')
    for (const school of schools) {
      const degree = school.field ? `${school.degree}, ${school.field}` : school.degree
      lines.push(`**${school.institution}** | ${range(school.period, year)}  `)
      block(`*${degree}*${school.location ? ` | ${school.location}` : ''}`)
      const list = bullets(school.highlights, variant)
      if (list.length > 0) block(...list)
    }
  }

  if (resume?.languages) block(`**Languages:** ${resume.languages}`)

  // One trailing newline, like the source files.
  return `${lines.join('\n').trimEnd()}\n`
}
