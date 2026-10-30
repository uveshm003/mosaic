import { describe, expect, it } from 'vitest'
import { inquirySchema } from './schema'

const base = {
  profile: 'root',
  name: ' Ada ',
  email: 'ada@example.com',
  message: ' Hi ',
  turnstileToken: 't',
}

describe('inquirySchema', () => {
  it('trims text and turns empty optional fields into undefined', () => {
    const parsed = inquirySchema.parse({ ...base, projectType: '  ', timeline: '' })
    expect(parsed).toMatchObject({
      name: 'Ada',
      message: 'Hi',
      projectType: undefined,
      timeline: undefined,
    })
  })

  it('rejects the brand, which has no contact form profile', () => {
    expect(inquirySchema.safeParse({ ...base, profile: 'brand' }).success).toBe(false)
  })

  it('caps the message at Resend’s 2,000-character variable limit', () => {
    expect(inquirySchema.safeParse({ ...base, message: 'x'.repeat(2001) }).success).toBe(false)
  })

  it('needs a Turnstile token', () => {
    expect(inquirySchema.safeParse({ ...base, turnstileToken: '' }).success).toBe(false)
  })
})
