import { profileKeys } from '@mosaic/content'
import { z } from 'zod'

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => value || undefined)

// Limits match the inquiries columns' use and Resend's 2,000-character template values.
export const inquirySchema = z.object({
  profile: z.enum(profileKeys),
  name: z.string().trim().min(1).max(100),
  email: z.email().max(254),
  message: z.string().trim().min(1).max(2000),
  projectType: optionalText(100),
  timeline: optionalText(100),
  turnstileToken: z.string().min(1).max(2048),
  // Honeypot: hidden from people, so anything here came from a bot.
  website: z.string().max(500).optional(),
})

export type InquiryInput = z.infer<typeof inquirySchema>
export type Inquiry = Omit<InquiryInput, 'turnstileToken' | 'website'>
