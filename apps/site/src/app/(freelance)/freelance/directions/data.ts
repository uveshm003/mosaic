import {
  engagement,
  person,
  profile,
  projectsFor,
  services,
  testimonials,
} from '../../../../lib/content'

// Everything the Freelance directions show, from the content snapshot.
export function freelanceData() {
  const projects = projectsFor('freelance')
  const me = person()
  return {
    name: me.name ?? '',
    tagline: profile('freelance').tagline ?? '',
    email: me.contactLinks?.find((l) => l.url.startsWith('mailto:'))?.url ?? null,
    services: services(),
    steps: engagement(),
    projects,
    testimonials: testimonials(projects.map((p) => p.id)),
    endpoint: process.env.NEXT_PUBLIC_CONTACT_ENDPOINT,
    siteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  }
}
