import { z } from 'zod'

export const appEnvSchema = z.enum(['dev', 'production', 'demo', 'test'])

export type AppEnv = z.infer<typeof appEnvSchema>
