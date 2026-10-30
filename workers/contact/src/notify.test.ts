import { describe, expect, it, vi } from 'vitest'
import { parseWorkerEnv } from './env'
import { escapeHtml, sendNotification } from './notify'

const env = parseWorkerEnv({
  DATABASE_URL: 'postgres://u:p@localhost:5432/db',
  TURNSTILE_SECRET_KEY: 'secret',
  RESEND_API_KEY: 're_test',
  NOTIFY_EMAIL: 'owner@example.com',
  RESEND_FROM: 'Portfolio contact <onboarding@resend.dev>',
  RESEND_TEMPLATE: 'contact-notification',
  ALLOWED_ORIGINS: 'https://uveshm003.github.io',
})

describe('escapeHtml', () => {
  it('escapes markup and quotes', () => {
    expect(escapeHtml(`<b>"Hi" & 'bye'</b>`)).toBe(
      '&lt;b&gt;&quot;Hi&quot; &amp; &#39;bye&#39;&lt;/b&gt;',
    )
  })
})

describe('sendNotification', () => {
  const inquiry = {
    profile: 'freelance' as const,
    name: '<script>x</script>',
    email: 'ada@example.com',
    message: 'Hi & bye',
    projectType: undefined,
    timeline: '3 months',
  }

  it('sends the template with escaped variables, reply-to and an idempotency key', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ id: 'e1' }))
    await sendNotification({ env, inquiry, inquiryId: 42 }, fetcher)
    const [url, init] = fetcher.mock.calls[0] ?? []
    expect(url).toBe('https://api.resend.com/emails')
    const headers = new Headers(init?.headers)
    expect(headers.get('Authorization')).toBe('Bearer re_test')
    expect(headers.get('Idempotency-Key')).toBe('inquiry-42')
    expect(JSON.parse(init?.body as string)).toEqual({
      from: 'Portfolio contact <onboarding@resend.dev>',
      to: ['owner@example.com'],
      reply_to: 'ada@example.com',
      template: {
        id: 'contact-notification',
        variables: {
          PROFILE: 'freelance',
          SENDER_NAME: '&lt;script&gt;x&lt;/script&gt;',
          SENDER_EMAIL: 'ada@example.com',
          MESSAGE: 'Hi &amp; bye',
          TIMELINE: '3 months',
        },
      },
    })
  })

  it('throws when Resend refuses', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response('quota', { status: 429 }))
    await expect(sendNotification({ env, inquiry, inquiryId: 1 }, fetcher)).rejects.toThrow(/429/)
  })
})
