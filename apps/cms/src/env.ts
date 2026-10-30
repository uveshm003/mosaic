import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
  PAYLOAD_SECRET: z.string().min(32, 'PAYLOAD_SECRET must be at least 32 characters'),
})

export type CmsEnv = z.infer<typeof envSchema>

export function parseCmsEnv(source: Record<string, string | undefined>): CmsEnv {
  const result = envSchema.safeParse(source)
  if (!result.success) {
    throw new Error(`Invalid cms environment:\n${z.prettifyError(result.error)}`)
  }
  return result.data
}
