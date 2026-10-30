import { appEnvSchema } from '@mosaic/content'
import { z } from 'zod'

const envSchema = z
  .object({
    APP_ENV: appEnvSchema,
    // Set by `pnpm cms:dev` / `pnpm cms:prod`; see package.json.
    MOSAIC_CMS_TARGET: appEnvSchema.optional(),
    DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
    PAYLOAD_SECRET: z.string().min(32, 'PAYLOAD_SECRET must be at least 32 characters'),
  })
  .refine(
    (env) =>
      env.MOSAIC_CMS_TARGET === undefined
        ? env.APP_ENV !== 'dev' && env.APP_ENV !== 'production'
        : env.MOSAIC_CMS_TARGET === env.APP_ENV,
    {
      path: ['MOSAIC_CMS_TARGET'],
      message:
        'Start the admin with `pnpm cms:dev` or `pnpm cms:prod`, each with its own env file.',
    },
  )

export type CmsEnv = z.infer<typeof envSchema>

export function parseCmsEnv(source: Record<string, string | undefined>): CmsEnv {
  const result = envSchema.safeParse(source)
  if (!result.success) {
    throw new Error(`Invalid cms environment:\n${z.prettifyError(result.error)}`)
  }
  return result.data
}

// Schema push rewrites tables to match the code and can drop columns, so it only
// runs against throwaway databases. Production and demo change through migrations.
export function allowsSchemaPush(env: CmsEnv): boolean {
  return env.APP_ENV === 'dev' || env.APP_ENV === 'test'
}
