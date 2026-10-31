// The Full-stack profile's sections, shared by its sidebar and command palette.
export const fullstackSections = [
  ['overview', 'Overview'],
  ['architecture', 'Architecture'],
  ['projects', 'Projects'],
  ['stack', 'Stack'],
  ['activity', 'Activity'],
  ['contact', 'Contact'],
] as const

/** Dev seed titles carry "Sample:"; app chrome would repeat it everywhere. */
export const strip = (text: string) => text.replace(/^Sample: /, '')
