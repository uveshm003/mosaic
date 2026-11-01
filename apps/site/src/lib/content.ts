import type { ListingProfileKey, ProfileKey, ResumeVariant } from '@mosaic/content'
import type { Snapshot } from '@mosaic/content/snapshot'
import type {
  Experience,
  Post,
  Project,
  Service,
  Skill,
  Tech,
  Testimonial,
} from '@mosaic/content/payload-types'
import { getSnapshot } from './snapshot'

function snapshot(): Snapshot {
  const loaded = getSnapshot()
  if (!loaded) throw new Error('No content snapshot. Run `pnpm preview` to export dev content.')
  return loaded
}

export const person = () => snapshot().globals.person
export interface ProfileSettings {
  enabled: boolean
  title: string | null
  tagline: string | null
  primaryAction: { label: string | null; url: string | null }
}

/** One profile's settings, with empty defaults where the admin left them unset. */
export function profile(key: ProfileKey): ProfileSettings {
  // Without a snapshot (plain CI builds) every profile counts as disabled.
  const settings = getSnapshot()?.globals.profiles[key]
  return {
    enabled: settings?.enabled ?? false,
    title: settings?.title ?? null,
    tagline: settings?.tagline ?? null,
    primaryAction: {
      label: settings?.primaryAction?.label ?? null,
      url: settings?.primaryAction?.url ?? null,
    },
  }
}

export interface ProjectView {
  id: number
  slug: string
  title: string
  summary: string | null
  highlights: string[]
  platforms: string[]
  tech: string[]
  demoStatus: Project['demoStatus']
  kind: Project['kind']
  role: string | null
  team: string | null
  start: string | null
  end: string | null
  repo: string | null
  live: string | null
  video: string | null
  metrics: { label: string; value: string }[]
  body: unknown
  demoAdmin: boolean
  architecture: Architecture | null
  canvas: ProductCanvas | null
}

export interface ProductCanvas {
  journey: { stage: string; userDoes: string | null; pain: string | null; fix: string | null }[]
  decisions: { question: string; options: string[]; chosen: string | null; why: string | null }[]
  comparison: {
    beforeTitle: string | null
    afterTitle: string | null
    before: string[]
    after: string[]
    beforeImage: string | null
    afterImage: string | null
  } | null
}

type CanvasSource = NonNullable<Project['canvas']> | NonNullable<Post['canvas']>

/** Absolute image URLs only: the static sites can't serve the admin's local uploads. */
function imageUrl(value: unknown): string | null {
  const url =
    typeof value === 'object' && value !== null && 'url' in value
      ? (value as { url?: unknown }).url
      : null
  return typeof url === 'string' && /^https?:\/\//.test(url) ? url : null
}

export function canvasOf(source: CanvasSource | null | undefined): ProductCanvas | null {
  if (!source) return null
  const c = source.comparison
  const comparison =
    c && ((c.before ?? []).length > 0 || (c.after ?? []).length > 0)
      ? {
          beforeTitle: c.beforeTitle ?? null,
          afterTitle: c.afterTitle ?? null,
          before: (c.before ?? []).map((row) => row.text),
          after: (c.after ?? []).map((row) => row.text),
          beforeImage: imageUrl(c.beforeImage),
          afterImage: imageUrl(c.afterImage),
        }
      : null
  const canvas: ProductCanvas = {
    journey: (source.journey ?? []).map((j) => ({
      stage: j.stage,
      userDoes: j.userDoes ?? null,
      pain: j.pain ?? null,
      fix: j.fix ?? null,
    })),
    decisions: (source.decisions ?? []).map((d) => ({
      question: d.question,
      options: (d.options ?? []).map((o) => o.text),
      chosen: d.chosen ?? null,
      why: d.why ?? null,
    })),
    comparison,
  }
  return canvas.journey.length || canvas.decisions.length || canvas.comparison ? canvas : null
}

export type NodeKind = 'client' | 'service' | 'data' | 'queue' | 'external'

export interface Architecture {
  nodes: {
    key: string
    label: string
    kind: NodeKind
    tech: string | null
    column: number
    row: number
  }[]
  edges: { from: string; to: string; label: string | null }[]
  trace: { from: string; to: string; label: string; code: string | null }[]
}

function architectureOf(project: Project): Architecture | null {
  const nodes = project.architecture?.nodes ?? []
  if (nodes.length === 0) return null
  return {
    nodes: nodes.map((n) => ({
      key: n.key,
      label: n.label,
      kind: n.kind,
      tech: n.tech ?? null,
      column: n.column,
      row: n.row,
    })),
    edges: (project.architecture?.edges ?? []).map((e) => ({
      from: e.from,
      to: e.to,
      label: e.label ?? null,
    })),
    trace: (project.architecture?.trace ?? []).map((t) => ({
      from: t.from,
      to: t.to,
      label: t.label,
      code: t.code ?? null,
    })),
  }
}

// Per-profile wording from `overrides` wins over the base fields (spec: Data model).
function view(project: Project, profile: ListingProfileKey): ProjectView {
  const override = project.overrides?.find((row) => row.profile === profile)
  return {
    id: project.id,
    slug: project.slug,
    title: override?.title ?? project.title,
    summary: override?.summary ?? project.summary ?? null,
    highlights: override?.highlights?.map((row) => row.text) ?? [],
    platforms: project.platforms ?? [],
    tech: (project.tech ?? []).flatMap((tech: number | Tech) =>
      typeof tech === 'object' ? [tech.name] : [],
    ),
    demoStatus: project.demoStatus,
    kind: project.kind,
    role: project.role ?? null,
    team: project.team ?? null,
    start: project.period?.start ?? null,
    end: project.period?.end ?? null,
    repo: project.links?.repo ?? null,
    live: project.links?.live ?? null,
    video: project.links?.video ?? null,
    metrics: (project.metrics ?? []).map(({ label, value }) => ({ label, value })),
    body: project.body ?? null,
    demoAdmin: project.links?.demoAdmin ?? false,
    architecture: architectureOf(project),
    canvas: canvasOf(project.canvas),
  }
}

export function projectsFor(profile: ListingProfileKey): ProjectView[] {
  return snapshot()
    .collections.projects.filter((project) => project.profiles?.includes(profile))
    .map((project) => view(project, profile))
}

export function projectFor(profile: ListingProfileKey, slug: string): ProjectView | null {
  return projectsFor(profile).find((project) => project.slug === slug) ?? null
}

export function postsFor(profile: ListingProfileKey): Post[] {
  return snapshot()
    .collections.posts.filter((post) => post.profiles?.includes(profile))
    .sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''))
}

// Labels come from the type, not from content (spec: Content ground rules, 6).
export const demoStatusLabel: Record<Project['demoStatus'], string> = {
  live: 'Live',
  'demo-build': 'Demo build',
  video: 'Video',
  'repo-only': 'Repo only',
  private: 'Private',
}

export const platformLabel: Record<string, string> = {
  android: 'Android',
  ios: 'iOS',
  web: 'Web',
  macos: 'macOS',
  windows: 'Windows',
  linux: 'Linux',
}

export const allPlatforms = ['android', 'ios', 'web', 'macos', 'windows', 'linux'] as const

export function formatMonth(iso: string | null): string {
  if (!iso) return 'Now'
  return new Date(iso).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}

/** "Jan 2025 – Now", or empty when the start isn't known, so the row can be left out. */
export function formatPeriod(start: string | null, end: string | null): string {
  return start ? `${formatMonth(start)} – ${formatMonth(end)}` : ''
}

export const listingProfiles: { key: ListingProfileKey; label: string }[] = [
  { key: 'flutter', label: 'Flutter' },
  { key: 'product', label: 'Product' },
  { key: 'freelance', label: 'Freelance' },
  { key: 'fullstack', label: 'Full-stack' },
]

/** A profile ships only when its `enabled` flag is on (spec: Identity per profile). */
export const isEnabled = (key: ProfileKey) => profile(key).enabled

// Profiles whose pages exist in this app. A profile is linked only when it is built and enabled.
const builtProfiles = new Set<ListingProfileKey>(['flutter', 'freelance', 'fullstack', 'product'])

export const enabledProfiles = () =>
  listingProfiles.filter(({ key }) => builtProfiles.has(key) && isEnabled(key))

export const profileHref: Record<ListingProfileKey, string> = {
  flutter: '/flutter',
  product: '/product',
  freelance: '/freelance',
  fullstack: '/fullstack',
}

/** Every published project, each with the wording of the first profile it appears on. */
export function allProjects(): (ProjectView & { profile: ListingProfileKey })[] {
  return snapshot().collections.projects.flatMap((project) => {
    const first = listingProfiles.find(({ key }) => project.profiles?.includes(key))?.key
    return first ? [{ ...view(project, first), profile: first }] : []
  })
}

/** Projects flagged as featured in any profile override, topped up to `count`. */
export function featuredProjects(count = 4) {
  const projects = allProjects()
  const featured = projects.filter((project) =>
    snapshot()
      .collections.projects.find((p) => p.id === project.id)
      ?.overrides?.some((row) => row.featured),
  )
  const rest = projects.filter((project) => !featured.includes(project))
  return [...featured, ...rest].slice(0, count)
}

/** The ongoing project with the latest start, for "currently building". */
export function currentProject() {
  return allProjects()
    .filter((project) => project.end === null && project.start !== null)
    .sort((a, b) => (b.start ?? '').localeCompare(a.start ?? ''))[0]
}

// Resume entries and bullets carry the resume variants they belong to; an empty list means
// every variant. A profile shows one variant, so the same point isn't repeated in each wording.
const inVariant = (variants: readonly string[] | null | undefined, variant: ResumeVariant) =>
  !variants?.length || variants.includes(variant)

export function experience(variant: ResumeVariant): Experience[] {
  return snapshot()
    .collections.experience.filter((role) => inVariant(role.variants, variant))
    .map((role) => ({
      ...role,
      highlights: (role.highlights ?? []).filter((h) => inVariant(h.variants, variant)),
    }))
    .sort((a, b) => (b.period?.start ?? '').localeCompare(a.period?.start ?? ''))
}

export function skillsByCategory(variant: ResumeVariant): { category: string; skills: Skill[] }[] {
  const groups = new Map<string, Skill[]>()
  for (const skill of snapshot()
    .collections.skills.filter((s) => inVariant(s.variants, variant))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))) {
    groups.set(skill.category, [...(groups.get(skill.category) ?? []), skill])
  }
  return [...groups].map(([category, skills]) => ({ category, skills }))
}

export function latestPosts(count = 3): Post[] {
  return snapshot()
    .collections.posts.filter((post) => post.site === 'personal' && post.publishedAt)
    .sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''))
    .slice(0, count)
}

/** A stable hue per project, used by the drawn device mockups until real screenshots exist. */
export const projectHue = (id: number) => (id * 47 + 160) % 360

export function services(): Service[] {
  return [...snapshot().collections.services]
    .filter((s) => s._status !== 'draft')
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

export interface EngagementStep {
  title: string
  when: string | null
  summary: string | null
  youGet: string[]
  yourPart: string | null
}

/** The Freelance profile's own words: audience, process, principles and FAQ. */
export function freelanceProfile() {
  const settings = getSnapshot()?.globals.profiles.freelance
  return {
    audience: (settings?.audience ?? []).map((row) => row.text),
    engagement: (settings?.engagement ?? []).map((step): EngagementStep => ({
      title: step.title,
      when: step.when ?? null,
      summary: step.summary ?? null,
      youGet: (step.youGet ?? []).map((row) => row.text),
      yourPart: step.yourPart ?? null,
    })),
    principles: (settings?.principles ?? []).map((row) => ({
      title: row.title,
      text: row.text ?? null,
    })),
    faq: (settings?.faq ?? []).map((row) => ({ question: row.question, answer: row.answer })),
  }
}

export const serviceGroupLabel: Record<NonNullable<Service['group']>, string> = {
  build: 'Build something new',
  fix: 'Fix or improve what exists',
  embed: 'Work inside your team',
}

export const serviceGroupOrder = Object.keys(serviceGroupLabel) as NonNullable<Service['group']>[]

/**
 * Testimonials that may be shown: published, with consent, optionally for one profile's
 * projects. An empty list hides the section (spec: Phase 4).
 */
export function visibleTestimonials(list: Testimonial[], projectIds?: number[]): Testimonial[] {
  return list.filter((t) => {
    if (t._status === 'draft' || !t.consentConfirmed) return false
    if (!projectIds) return true
    const project = typeof t.project === 'object' ? t.project?.id : t.project
    return project == null || projectIds.includes(project)
  })
}

export const testimonials = (projectIds?: number[]) =>
  visibleTestimonials(snapshot().collections.testimonials, projectIds)

/** The public demo admin, once deployed; its card stays hidden until then. */
export const demoAdminUrl = () => getSnapshot()?.globals.profiles.fullstack?.demoAdminUrl ?? null

/** Every technology on a set of projects, with how many use it, grouped by kind. */
export function techCatalog(
  projects: ProjectView[],
): { kind: Tech['kind']; tech: { name: string; count: number }[] }[] {
  const kinds = new Map((getSnapshot()?.collections.tech ?? []).map((t) => [t.name, t.kind]))
  const counts = new Map<string, number>()
  for (const p of projects) for (const t of p.tech) counts.set(t, (counts.get(t) ?? 0) + 1)
  const groups = new Map<Tech['kind'], { name: string; count: number }[]>()
  for (const [name, count] of [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))) {
    const kind = kinds.get(name) ?? 'tool'
    groups.set(kind, [...(groups.get(kind) ?? []), { name, count }])
  }
  return [...groups].map(([kind, tech]) => ({ kind, tech }))
}

export type ProductKind = 'case-study' | 'teardown' | 'proposal'

export const productKindLabel: Record<ProductKind, string> = {
  'case-study': 'Case study',
  teardown: 'Teardown',
  proposal: 'Proposal',
}

export const productKindSlug: Record<ProductKind, string> = {
  'case-study': 'case-studies',
  teardown: 'teardowns',
  proposal: 'proposals',
}

export interface ProductItem {
  kind: ProductKind
  slug: string
  title: string
  summary: string | null
  date: string | null
  subject: string | null
  canvas: ProductCanvas | null
  body: unknown
  project: ProjectView | null
}

/**
 * Case studies, teardowns and proposals as one body of work, newest first (Product
 * framing: equal weight). Teardowns and proposals are personal-site posts on this profile.
 */
export function productWork(): ProductItem[] {
  const projects = projectsFor('product').map((p): ProductItem => ({
    kind: 'case-study',
    slug: p.slug,
    title: p.title,
    summary: p.summary,
    date: p.end ?? p.start,
    subject: null,
    canvas: p.canvas,
    body: p.body,
    project: p,
  }))
  const posts = postsFor('product')
    .filter((post) => post.type === 'teardown' || post.type === 'improvement-proposal')
    .map((post): ProductItem => ({
      kind: post.type === 'teardown' ? 'teardown' : 'proposal',
      slug: post.slug,
      title: post.title,
      summary: null,
      date: post.publishedAt ?? null,
      subject: post.subject ?? null,
      canvas: canvasOf(post.canvas),
      body: post.body ?? null,
      project: null,
    }))
  return [...projects, ...posts].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
}

/** Teardowns and proposals carry the independent-analysis label (spec: Content ground rules). */
export function productLabel(item: Pick<ProductItem, 'kind' | 'subject'>): string | null {
  if (item.kind === 'case-study') return null
  const name = item.subject?.trim() || 'the companies discussed'
  return `Independent analysis. Not affiliated with ${name}${name.endsWith('.') ? '' : '.'}`
}

/**
 * The brand site (a separate app under /brand) is linked once it has a published post. Live,
 * both apps share one address; in development the brand runs its own server on port 3002.
 */
export const brandHref =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3002/brand/' : '/brand/'
export const brandIsLive = () =>
  (getSnapshot()?.collections.posts ?? []).some((p) => p.site === 'brand' && p._status !== 'draft')
