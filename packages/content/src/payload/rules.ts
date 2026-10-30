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
