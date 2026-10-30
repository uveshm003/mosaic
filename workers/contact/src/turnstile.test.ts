import { describe, expect, it, vi } from 'vitest'
import { verifyTurnstile } from './turnstile'

describe('verifyTurnstile', () => {
  it('posts the secret, token and IP to siteverify', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ success: true }))
    await expect(
      verifyTurnstile({ token: 't', secret: 's', ip: '203.0.113.9' }, fetcher),
    ).resolves.toBe(true)
    const [url, init] = fetcher.mock.calls[0] ?? []
    expect(url).toBe('https://challenges.cloudflare.com/turnstile/v0/siteverify')
    const body = init?.body as FormData
    expect([body.get('secret'), body.get('response'), body.get('remoteip')]).toEqual([
      's',
      't',
      '203.0.113.9',
    ])
  })

  it.each([
    [
      'a failed check',
      Response.json({ success: false, 'error-codes': ['invalid-input-response'] }),
    ],
    ['an HTTP error', new Response('', { status: 500 })],
    ['an unexpected body', Response.json({ ok: true })],
  ])('returns false on %s', async (_, response) => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(response)
    await expect(verifyTurnstile({ token: 't', secret: 's', ip: null }, fetcher)).resolves.toBe(
      false,
    )
  })
})
