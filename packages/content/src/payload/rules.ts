import { z } from 'zod'
// Pure publishing and validation rules, kept free of Payload imports so they unit-test cheaply.

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function slugError(value: unknown): string | null {
  if (typeof value !== 'string' || !slugPattern.test(value)) {
    return 'Use lowercase letters, numbers and single hyphens.'
  }
  return null
}

const youTubeHosts = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be'])

export function youTubeUrlError(value: unknown): string | null {
  if (value === null || value === undefined || value === '') return null
  if (typeof value !== 'string') return 'Enter a YouTube URL.'
  try {
    const url = new URL(value)
    if (url.protocol === 'https:' && youTubeHosts.has(url.hostname)) return null
  } catch {
    // Falls through to the error below.
  }
  return 'Enter an https YouTube URL.'
}

export function duplicateProfileError(rows: unknown): string | null {
  if (!Array.isArray(rows)) return null
  const seen = new Set<unknown>()
  for (const row of rows as { profile?: unknown }[]) {
    if (seen.has(row.profile)) return 'Each profile can have only one override.'
    seen.add(row.profile)
  }
  return null
}

type Status = 'draft' | 'published' | null | undefined

export function projectPublishError(doc: {
  _status?: Status
  confidentiality?: string | null
}): string | null {
  if (doc._status === 'published' && doc.confidentiality !== 'public') {
    return 'Restricted projects can’t be published. Clear the confidentiality checkpoint first.'
  }
  return null
}

export function testimonialPublishError(doc: {
  _status?: Status
  consentConfirmed?: boolean | null
}): string | null {
  if (doc._status === 'published' && doc.consentConfirmed !== true) {
    return 'Confirm consent before publishing a testimonial.'
  }
  return null
}

const end = z.string().nullish()
const architectureSchema = z
  .object({
    nodes: z.array(z.object({ key: end })).nullish(),
    edges: z.array(z.object({ from: end, to: end })).nullish(),
    trace: z.array(z.object({ from: end, to: end })).nullish(),
  })
  .nullish()

/** A diagram's edges and trace may only point at nodes it defines, each key once. */
export function architectureError(input: unknown): string | null {
  const parsed = architectureSchema.safeParse(input)
  if (!parsed.success) return 'The diagram isn’t in the expected shape.'
  const architecture = parsed.data
  const keys = (architecture?.nodes ?? []).map((n) => n.key ?? '')
  const duplicate = keys.find((k, i) => keys.indexOf(k) !== i)
  if (duplicate !== undefined) return `Diagram node "${duplicate}" is used twice.`
  const known = new Set(keys)
  for (const [list, name] of [
    [architecture?.edges ?? [], 'connection'],
    [architecture?.trace ?? [], 'trace step'],
  ] as const) {
    for (const row of list) {
      for (const end of [row.from, row.to]) {
        if (!end || !known.has(end))
          return `A ${name} points at "${end ?? ''}", which isn’t a node.`
      }
    }
  }
  return null
}
