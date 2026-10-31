import { describe, expect, it } from 'vitest'
import {
  duplicateProfileError,
  architectureError,
  projectPublishError,
  slugError,
  testimonialPublishError,
  youTubeUrlError,
} from './rules'

describe('slugError', () => {
  it('accepts kebab-case slugs', () => {
    expect(slugError('quick-serve-2')).toBeNull()
  })

  it.each(['', 'Quick', 'a--b', '-a', 'a_b', 42])('rejects %j', (value) => {
    expect(slugError(value)).not.toBeNull()
  })
})

describe('youTubeUrlError', () => {
  it.each([undefined, null, '', 'https://www.youtube.com/watch?v=abc', 'https://youtu.be/abc'])(
    'accepts %j',
    (value) => {
      expect(youTubeUrlError(value)).toBeNull()
    },
  )

  it.each(['http://youtu.be/abc', 'https://vimeo.com/1', 'https://youtube.com.evil.io/x', 'nope'])(
    'rejects %j',
    (value) => {
      expect(youTubeUrlError(value)).not.toBeNull()
    },
  )
})

describe('duplicateProfileError', () => {
  it('allows one override per profile', () => {
    expect(duplicateProfileError([{ profile: 'flutter' }, { profile: 'product' }])).toBeNull()
  })

  it('rejects two overrides for the same profile', () => {
    expect(duplicateProfileError([{ profile: 'flutter' }, { profile: 'flutter' }])).not.toBeNull()
  })
})

describe('projectPublishError', () => {
  it('blocks publishing restricted projects', () => {
    expect(
      projectPublishError({ _status: 'published', confidentiality: 'restricted' }),
    ).not.toBeNull()
  })

  it('blocks publishing when confidentiality is unset', () => {
    expect(projectPublishError({ _status: 'published' })).not.toBeNull()
  })

  it('allows restricted drafts and public projects', () => {
    expect(projectPublishError({ _status: 'draft', confidentiality: 'restricted' })).toBeNull()
    expect(projectPublishError({ _status: 'published', confidentiality: 'public' })).toBeNull()
  })
})

describe('testimonialPublishError', () => {
  it('blocks publishing without consent', () => {
    expect(
      testimonialPublishError({ _status: 'published', consentConfirmed: false }),
    ).not.toBeNull()
  })

  it('allows drafts without consent and published with consent', () => {
    expect(testimonialPublishError({ _status: 'draft' })).toBeNull()
    expect(testimonialPublishError({ _status: 'published', consentConfirmed: true })).toBeNull()
  })
})

describe('architectureError', () => {
  const nodes = [{ key: 'app' }, { key: 'api' }, { key: 'db' }]

  it('accepts edges and traces between known nodes, and an empty diagram', () => {
    expect(
      architectureError({
        nodes,
        edges: [{ from: 'app', to: 'api' }],
        trace: [{ from: 'api', to: 'db' }],
      }),
    ).toBeNull()
    expect(architectureError(null)).toBeNull()
  })

  it('rejects unknown ends and duplicate keys', () => {
    expect(architectureError({ nodes, edges: [{ from: 'app', to: 'cache' }] })).toMatch(/"cache"/)
    expect(architectureError({ nodes, trace: [{ from: '', to: 'db' }] })).toMatch(/trace step/)
    expect(architectureError({ nodes: [{ key: 'a' }, { key: 'a' }] })).toMatch(/twice/)
  })

  it('rejects data in the wrong shape', () => {
    expect(architectureError({ nodes: 'app' })).toMatch(/expected shape/)
  })
})
