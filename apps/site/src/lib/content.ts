import type { ListingProfileKey, ProfileKey } from '@mosaic/content'
import type { Snapshot } from '@mosaic/content/snapshot'
import type { Post, Project, Tech } from '@mosaic/content/payload-types'
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
  const settings = snapshot().globals.profiles[key]
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
  start: string | null
  end: string | null
  repo: string | null
  live: string | null
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
    start: project.period?.start ?? null,
    end: project.period?.end ?? null,
    repo: project.links?.repo ?? null,
    live: project.links?.live ?? null,
  }
}

export function projectsFor(profile: ListingProfileKey): ProjectView[] {
  return snapshot()
    .collections.projects.filter((project) => project.profiles?.includes(profile))
    .map((project) => view(project, profile))
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
