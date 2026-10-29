import { z } from 'zod'

// Route groups in apps/site. The brand is a separate app, not a profile.
export const profileKeys = ['root', 'flutter', 'product', 'freelance', 'fullstack'] as const

export const profileKeySchema = z.enum(profileKeys)

export type ProfileKey = z.infer<typeof profileKeySchema>
