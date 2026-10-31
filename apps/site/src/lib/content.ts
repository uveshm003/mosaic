import type { ListingProfileKey, ProfileKey } from '@mosaic/content'
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

export const listingProfiles: { key: ListingProfileKey; label: string }[] = [
  { key: 'flutter', label: 'Flutter' },
  { key: 'product', label: 'Product' },
  { key: 'freelance', label: 'Freelance' },
  { key: 'fullstack', label: 'Full-stack' },
]

/** A profile ships only when its `enabled` flag is on (spec: Identity per profile). */
export const isEnabled = (key: ProfileKey) => profile(key).enabled

// Profiles whose pages exist in this app. A profile is linked only when it is built and enabled.
const builtProfiles = new Set<ListingProfileKey>(['flutter'])

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

export function experience(): Experience[] {
  return [...snapshot().collections.experience].sort((a, b) =>
    (b.period?.start ?? '').localeCompare(a.period?.start ?? ''),
  )
}

export function skillsByCategory(): { category: string; skills: Skill[] }[] {
  const groups = new Map<string, Skill[]>()
  for (const skill of [...snapshot().collections.skills].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  )) {
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
}

/** How a freelance engagement works, step by step. */
export function engagement(): EngagementStep[] {
  return (getSnapshot()?.globals.profiles.freelance?.engagement ?? []).map((step) => ({
    title: step.title,
    when: step.when ?? null,
    summary: step.summary ?? null,
    youGet: (step.youGet ?? []).map((row) => row.text),
  }))
}

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
