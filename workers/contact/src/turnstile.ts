import { z } from 'zod'

const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

const responseSchema = z.object({ success: z.boolean() })

export async function verifyTurnstile(
  options: { token: string; secret: string; ip: string | null },
  fetcher: typeof fetch = fetch,
): Promise<boolean> {
  const body = new FormData()
  body.set('secret', options.secret)
  body.set('response', options.token)
  if (options.ip) body.set('remoteip', options.ip)
  const response = await fetcher(SITEVERIFY, { method: 'POST', body })
  if (!response.ok) return false
  const parsed = responseSchema.safeParse(await response.json())
  return parsed.success && parsed.data.success
}
