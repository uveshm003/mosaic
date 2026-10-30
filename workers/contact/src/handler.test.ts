import { describe, expect, it, vi, type Mock } from 'vitest'
import { parseWorkerEnv } from './env'
import { handle, type Deps } from './handler'

const env = parseWorkerEnv({
  DATABASE_URL: 'postgres://u:p@localhost:5432/db',
  TURNSTILE_SECRET_KEY: 'secret',
  RESEND_API_KEY: 're_test',
  NOTIFY_EMAIL: 'owner@example.com',
  RESEND_FROM: 'Portfolio contact <onboarding@resend.dev>',
  RESEND_TEMPLATE: 'contact-notification',
  ALLOWED_ORIGINS: 'https://uveshm003.github.io, http://localhost:3000',
})

const valid = {
  profile: 'freelance',
  name: 'Ada',
  email: 'ada@example.com',
  message: 'Hello',
  turnstileToken: 'token',
}

type Mocks = { [K in keyof Deps]: Mock<Deps[K]> }

function deps(overrides: Partial<Mocks> = {}): Mocks {
  return {
    verifyTurnstile: vi.fn<Deps['verifyTurnstile']>().mockResolvedValue(true),
    insertInquiry: vi.fn<Deps['insertInquiry']>().mockResolvedValue(7),
    sendNotification: vi.fn<Deps['sendNotification']>().mockResolvedValue(undefined),
    log: vi.fn<Deps['log']>(),
    ...overrides,
  }
}

function post(body: unknown, origin: string | null = 'https://uveshm003.github.io') {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (origin) headers.Origin = origin
  return new Request('https://contact.example/', {
    method: 'POST',
    headers,
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
}

describe('handle', () => {
  it('stores the inquiry and sends one notification', async () => {
    const d = deps()
    const response = await handle(post(valid), env, d)
    expect(response.status).toBe(200)
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('https://uveshm003.github.io')
    expect(d.insertInquiry).toHaveBeenCalledWith({
      profile: 'freelance',
      name: 'Ada',
      email: 'ada@example.com',
      message: 'Hello',
      projectType: undefined,
      timeline: undefined,
    })
    expect(d.sendNotification).toHaveBeenCalledTimes(1)
    expect(d.sendNotification.mock.calls[0]?.[1]).toBe(7)
  })

  it.each([null, 'https://evil.example'])('refuses origin %s', async (origin) => {
    const d = deps()
    const response = await handle(post(valid, origin), env, d)
    expect(response.status).toBe(403)
    expect(response.headers.get('Access-Control-Allow-Origin')).toBeNull()
    expect(d.insertInquiry).not.toHaveBeenCalled()
  })

  it('answers preflight for an allowed origin', async () => {
    const request = new Request('https://contact.example/', {
      method: 'OPTIONS',
      headers: { Origin: 'http://localhost:3000' },
    })
    const response = await handle(request, env, deps())
    expect(response.status).toBe(204)
    expect(response.headers.get('Access-Control-Allow-Methods')).toContain('POST')
  })

  it('rejects other methods', async () => {
    const request = new Request('https://contact.example/', {
      headers: { Origin: 'https://uveshm003.github.io' },
    })
    expect((await handle(request, env, deps())).status).toBe(405)
  })

  it('rejects invalid JSON and oversized bodies', async () => {
    expect((await handle(post('{nope'), env, deps())).status).toBe(400)
    const huge = { ...valid, message: 'x'.repeat(20_000) }
    expect((await handle(post(huge), env, deps())).status).toBe(413)
  })

  it('lists invalid fields', async () => {
    const response = await handle(post({ ...valid, email: 'nope', profile: 'brand' }), env, deps())
    expect(response.status).toBe(400)
    const body = await response.json<{ fields: Record<string, unknown> }>()
    expect(Object.keys(body.fields).sort()).toEqual(['email', 'profile'])
  })

  it('quietly drops honeypot submissions', async () => {
    const d = deps()
    const response = await handle(post({ ...valid, website: 'http://spam.example' }), env, d)
    expect(response.status).toBe(200)
    expect(d.verifyTurnstile).not.toHaveBeenCalled()
    expect(d.insertInquiry).not.toHaveBeenCalled()
    expect(d.sendNotification).not.toHaveBeenCalled()
  })

  it('refuses a failed Turnstile check without storing anything', async () => {
    const d = deps({ verifyTurnstile: vi.fn<Deps['verifyTurnstile']>().mockResolvedValue(false) })
    const response = await handle(post(valid), env, d)
    expect(response.status).toBe(403)
    expect(d.insertInquiry).not.toHaveBeenCalled()
  })

  it('passes the visitor IP to Turnstile', async () => {
    const d = deps()
    const request = post(valid)
    request.headers.set('CF-Connecting-IP', '203.0.113.9')
    await handle(request, env, d)
    expect(d.verifyTurnstile).toHaveBeenCalledWith('token', '203.0.113.9')
  })

  it('reports a storage failure and sends nothing', async () => {
    const d = deps({
      insertInquiry: vi.fn<Deps['insertInquiry']>().mockRejectedValue(new Error('db down')),
    })
    const response = await handle(post(valid), env, d)
    expect(response.status).toBe(500)
    expect(d.sendNotification).not.toHaveBeenCalled()
    expect(d.log).toHaveBeenCalled()
  })

  it('still succeeds when the email fails, since the inquiry is saved', async () => {
    const d = deps({
      sendNotification: vi
        .fn<Deps['sendNotification']>()
        .mockRejectedValue(new Error('resend down')),
    })
    const response = await handle(post(valid), env, d)
    expect(response.status).toBe(200)
    expect(d.log).toHaveBeenCalledWith(expect.stringContaining('inquiry 7'), expect.any(Error))
  })
})
