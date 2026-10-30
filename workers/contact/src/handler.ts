import { z } from 'zod'
import type { WorkerEnv } from './env'
import { inquirySchema, type Inquiry } from './schema'

export interface Deps {
  verifyTurnstile: (token: string, ip: string | null) => Promise<boolean>
  insertInquiry: (inquiry: Inquiry) => Promise<number>
  sendNotification: (inquiry: Inquiry, inquiryId: number) => Promise<void>
  log: (message: string, error?: unknown) => void
}

const MAX_BODY_BYTES = 16 * 1024

function json(status: number, body: unknown, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  })
}

function corsHeaders(origin: string): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

export async function handle(request: Request, env: WorkerEnv, deps: Deps): Promise<Response> {
  const origin = request.headers.get('Origin')
  if (!origin || !env.ALLOWED_ORIGINS.includes(origin)) {
    return json(403, { error: 'origin_not_allowed' })
  }
  const cors = corsHeaders(origin)

  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors })
  if (request.method !== 'POST') return json(405, { error: 'method_not_allowed' }, cors)

  const text = await request.text()
  if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) {
    return json(413, { error: 'too_large' }, cors)
  }
  let body: unknown
  try {
    body = JSON.parse(text)
  } catch {
    return json(400, { error: 'invalid_json' }, cors)
  }
  const parsed = inquirySchema.safeParse(body)
  if (!parsed.success) {
    return json(
      400,
      { error: 'invalid_fields', fields: z.flattenError(parsed.error).fieldErrors },
      cors,
    )
  }
  const { turnstileToken, website, ...inquiry } = parsed.data

  // Bots get the same answer as people, so the honeypot isn't revealed.
  if (website) return json(200, { ok: true }, cors)

  const human = await deps.verifyTurnstile(turnstileToken, request.headers.get('CF-Connecting-IP'))
  if (!human) return json(403, { error: 'turnstile_failed' }, cors)

  let inquiryId: number
  try {
    inquiryId = await deps.insertInquiry(inquiry)
  } catch (error) {
    deps.log('Storing the inquiry failed', error)
    return json(500, { error: 'store_failed' }, cors)
  }

  // The inquiry is already saved, so a failed email is logged rather than reported.
  try {
    await deps.sendNotification(inquiry, inquiryId)
  } catch (error) {
    deps.log(`Notification for inquiry ${String(inquiryId)} failed`, error)
  }
  return json(200, { ok: true }, cors)
}
