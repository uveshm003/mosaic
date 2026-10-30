import { neon } from '@neondatabase/serverless'
import { parseWorkerEnv } from './env'
import { handle } from './handler'
import { sendNotification } from './notify'
import { insertInquiry } from './store'
import { verifyTurnstile } from './turnstile'

export default {
  async fetch(request: Request, rawEnv: Record<string, unknown>): Promise<Response> {
    const env = parseWorkerEnv(rawEnv)
    const sql = neon(env.DATABASE_URL)
    return handle(request, env, {
      verifyTurnstile: (token, ip) =>
        verifyTurnstile({ token, secret: env.TURNSTILE_SECRET_KEY, ip }),
      insertInquiry: (inquiry) => insertInquiry((text, params) => sql.query(text, params), inquiry),
      sendNotification: (inquiry, inquiryId) => sendNotification({ env, inquiry, inquiryId }),
      log: (message, error) => {
        console.error(message, error)
      },
    })
  },
} satisfies ExportedHandler<Record<string, unknown>>
