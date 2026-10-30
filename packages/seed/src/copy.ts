// Realistic but fictional copy for seed data, so design reviews read like a real portfolio.
// Nothing here describes Uvesh's actual work; real content only comes from the admin.

export const appNames = [
  ['Harbor', 'Pay'],
  ['Field', 'note'],
  ['Pulse', 'Track'],
  ['Orbit', ' Fleet'],
  ['Sprout', ' Garden'],
  ['Relay', ' Chat'],
  ['Beacon', ' Retail'],
  ['Nimbus', ' Notes'],
  ['Tidy', 'Home'],
  ['Atlas', ' Field Ops'],
] as const

export const audiences = [
  'field technicians',
  'small retailers',
  'fitness coaches',
  'logistics teams',
  'home gardeners',
  'clinic staff',
  'event organisers',
  'students',
]

export const jobs = [
  'log site inspections offline and sync when they are back in range',
  'take payments and track daily sales from one phone',
  'plan sessions and follow progress across devices',
  'see live vehicle positions and delivery status',
  'track plant care with reminders and photo journals',
  'chat in real time with read receipts and file sharing',
  'scan stock, reorder and print labels from a tablet',
  'capture notes that stay in sync on desktop and mobile',
]

export const approaches = [
  'One Flutter codebase with platform channels for the few native pieces, and Riverpod for state.',
  'An offline-first data layer on SQLite with a sync queue that resolves conflicts on the server.',
  'A shared design system in Flutter widgets, so every platform gets the same components and spacing.',
  'Kotlin Multiplatform for the business logic, with native UI where the platform look mattered.',
  'Background services for Bluetooth Low Energy scanning, with battery use kept under a budget.',
  'Feature flags and staged rollouts, so risky changes reached a small group of users first.',
]

export const outcomes = [
  'Released on every target platform from one repository, with platform-specific polish where it counted.',
  'Cold start time dropped noticeably after moving heavy work off the main isolate.',
  'Support requests about lost data stopped after the sync rewrite.',
  'The team shipped weekly instead of monthly once CI built and tested every platform.',
  'Reviews mentioned the app feeling native on each device, not like a port.',
]

export const roles = [
  'Lead Flutter developer',
  'Flutter developer',
  'Mobile engineer',
  'Full-stack engineer',
  'Solo developer',
]

export const metricLabels = [
  ['Crash-free sessions', '99.8%'],
  ['Platforms', '6'],
  ['Cold start', '-38%'],
  ['App size', '14 MB'],
] as const

export const postTitles = [
  'Shipping one Flutter codebase to six platforms',
  'Platform channels without the pain',
  'Offline-first sync that survives bad networks',
  'What Kotlin Multiplatform taught me about Flutter',
  'Bluetooth Low Energy in a Flutter app, end to end',
  'Designing a widget library that scales',
  'Cutting cold start time in half',
  'Notes on a brand that starts with ideas',
  'Campaign concept: a city in motion',
  'Reading notes: building for people who are busy',
  'A product teardown, from first launch to habit',
]

export const postParagraphs = [
  'Most of the work was not in the widgets but in the edges: permissions, background limits and the small differences between platforms that users notice straight away.',
  'I started by writing down what had to behave natively and what could be shared. That list stayed short, which is the main reason one codebase worked.',
  'The first version was too clever. The second one was boring on purpose, and it is the one still running in production.',
  'Measuring before changing anything saved days. The slow part was never where I expected it to be.',
  'If I did it again, I would set up the CI matrix for every platform on day one instead of week six.',
]

export const services = [
  ['Mobile apps', 'Flutter apps for Android and iOS, from first prototype to store release.'],
  ['Web apps', 'Dashboards and internal tools that your team will actually enjoy using.'],
  ['Backends & APIs', 'APIs, databases and integrations that keep your app fast and reliable.'],
  ['MVPs', 'A focused first version to test the idea with real users in weeks, not months.'],
  ['Maintenance', 'Upgrades, bug fixes and performance work for apps that are already live.'],
] as const

export const companies = ['Northwind Labs', 'Brightline Studio', 'Kestrel Systems']

export const experienceHighlights = [
  'Built and maintained cross-platform apps used daily by operations teams.',
  'Introduced automated tests and CI builds for every platform the apps shipped on.',
  'Worked with designers to turn a loose style guide into a shared widget library.',
  'Integrated native SDKs through platform channels and kept them behind clean interfaces.',
  'Mentored two junior developers through their first production releases.',
  'Profiled and fixed jank on low-end Android devices.',
]

export const skills: [string, string][] = [
  ['Flutter', 'Mobile'],
  ['Dart', 'Mobile'],
  ['Riverpod', 'Mobile'],
  ['Kotlin', 'Native'],
  ['Jetpack Compose', 'Native'],
  ['Kotlin Multiplatform', 'Native'],
  ['Platform channels', 'Native'],
  ['NestJS', 'Backend'],
  ['PostgreSQL', 'Backend'],
  ['Firebase', 'Backend'],
  ['Angular', 'Web'],
  ['GitHub Actions', 'Tooling'],
]

export const tech: [string, 'language' | 'framework' | 'tool' | 'platform'][] = [
  ['Flutter', 'framework'],
  ['Dart', 'language'],
  ['Kotlin', 'language'],
  ['Jetpack Compose', 'framework'],
  ['Kotlin Multiplatform', 'framework'],
  ['Riverpod', 'framework'],
  ['Firebase', 'platform'],
  ['SQLite', 'tool'],
  ['NestJS', 'framework'],
  ['PostgreSQL', 'tool'],
  ['Bluetooth LE', 'platform'],
  ['GitHub Actions', 'tool'],
]

export const about = [
  'I build apps with Flutter that feel at home on every screen they run on, from phones to desktops. Most of my work sits where the shared codebase meets the platform: native integrations, performance and the details users notice.',
  'Before Flutter, I spent time on native Android, which still shapes how I think about lifecycle, permissions and battery. These days I also reach for Kotlin Multiplatform when shared logic matters more than shared UI.',
  'Outside client work I write about what I learn, tinker with small demos, and contribute to open-source projects when something I use could be better.',
]

export const profileTaglines: Record<string, string> = {
  root: 'Engineer who cares how apps feel.',
  flutter: 'Cross-platform apps that feel native on every screen.',
  product: 'Product thinking from an engineer’s seat.',
  freelance: 'Ship your idea with a developer who owns the whole thing.',
  fullstack: 'End-to-end systems, from database to device.',
}

export const inquiryMessages = [
  'Hi! We are a small team building a booking app and need help getting the Flutter version to production. Could we talk this week?',
  'Loved the case study on offline sync. We have a similar problem in our field app. Are you open to a short consulting engagement?',
  'We are hiring a senior Flutter engineer and your profile looks like a strong fit. Would you be open to a call?',
  'Do you take on maintenance work for an existing app? It needs an upgrade to the latest Flutter and some performance fixes.',
]

export const testimonialQuotes = [
  'Clear communication, fast iterations, and an app our users actually thank us for.',
  'Took a messy prototype and turned it into something we were proud to ship.',
  'Found and fixed performance problems we had lived with for a year.',
  'Thinks about the product, not just the ticket in front of them.',
]
