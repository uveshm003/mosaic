// The resume variants, as stored in the admin and as named on the command line.
export const resumeVariants = [
  'product-company',
  'android',
  'flutter',
  'broad',
  'fullstack',
] as const

export type ResumeVariant = (typeof resumeVariants)[number]

export const resumeVariantNames: Record<ResumeVariant, string> = {
  'product-company': 'ProductCompany',
  android: 'Android',
  flutter: 'Flutter',
  broad: 'Broad',
  fullstack: 'Fullstack',
}
