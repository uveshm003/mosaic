import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
  TURNSTILE_SECRET_KEY: z.string().min(1),
  RESEND_API_KEY: z.string().startsWith('re_'),
  NOTIFY_EMAIL: z.email(),
  RESEND_FROM: z.string().min(1),
  RESEND_TEMPLATE: z.string().min(1),
  ALLOWED_ORIGINS: z.string().transform((value) =>
    value
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  ),
})

export type WorkerEnv = z.infer<typeof envSchema>

export function parseWorkerEnv(source: Record<string, unknown>): WorkerEnv {
  return envSchema.parse(source)
}
