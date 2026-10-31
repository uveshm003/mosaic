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

export const services: [
  title: string,
  summary: string,
  deliverables: string[],
  timeline: string,
  group: 'build' | 'fix' | 'embed',
][] = [
  [
    'Mobile apps',
    'Flutter apps for Android and iOS, from first prototype to store release.',
    [
      'Designs turned into a working app',
      'Store listings and release',
      'Crash reporting and analytics set up',
    ],
    '6–12 weeks',
    'build',
  ],
  [
    'Web apps & dashboards',
    'Admin panels, dashboards and internal tools your team will actually enjoy using.',
    ['Role-based access', 'Charts and exports that match how you report', 'Deployed and monitored'],
    '4–10 weeks',
    'build',
  ],
  [
    'Backends & APIs',
    'APIs, databases and integrations that keep your app fast and reliable.',
    ['Documented API', 'Database schema and migrations', 'Payment, email and auth integrations'],
    '3–8 weeks',
    'build',
  ],
  [
    'MVPs',
    'A focused first version to test the idea with real users in weeks, not months.',
    ['One core flow done properly', 'Feedback built in', 'A plan for version two'],
    '4–6 weeks',
    'build',
  ],
  [
    'Maintenance',
    'Upgrades, bug fixes and performance work for apps that are already live.',
    ['Dependency and OS upgrades', 'Bug triage with clear priorities', 'Monthly health report'],
    'Ongoing',
    'fix',
  ],
  [
    'Vibe-code cleanup',
    'Your prototype was built fast with AI tools. I make it safe to ship: structure, tests and security.',
    [
      'Code review with a ranked fix list',
      'Tests around what matters',
      'Secrets, auth and data access checked',
    ],
    '1–4 weeks',
    'fix',
  ],
  [
    'Forward-deployed engineer',
    'An engineer inside your team, close to your users, turning what they ask for into shipped features.',
    ['Joins your standups and tools', 'Ships alongside your team', 'Leaves things documented'],
    'Monthly',
    'embed',
  ],
  [
    'AI-assisted engineering',
    'Faster delivery with AI tooling, with a human who reads, tests and owns every line.',
    [
      'AI in the workflow, not in charge of it',
      'Reviewed, tested code',
      'Your team shown how to do the same',
    ],
    'Any project',
    'embed',
  ],
]

export const engagement: [
  title: string,
  when: string,
  summary: string,
  youGet: string[],
  yourPart: string,
][] = [
  [
    'Talk',
    'Week 0',
    'A call about what you are building, who it is for and what success looks like.',
    ['A short written summary of what we agreed'],
    'Bring the idea, however rough. Sketches and screenshots help.',
  ],
  [
    'Plan',
    'Week 1',
    'Scope, milestones and risks on one page, so there are no surprises later.',
    ['A plan you can share with your team', 'A clickable prototype for bigger ideas'],
    'Say yes, no or not yet to each part of the plan.',
  ],
  [
    'Build',
    'Weeks 2–8',
    'Short cycles with a working build at the end of each one, on your own phone or browser.',
    ['A demo every week', 'A shared board with what is done and what is next'],
    'Try each build and tell me what feels wrong.',
  ],
  [
    'Launch',
    'Release week',
    'Store submission or deployment, monitoring switched on, and a calm launch day.',
    ['Your app live', 'Dashboards for crashes and usage'],
    'Tell your users, and watch the first numbers come in.',
  ],
  [
    'Hand over',
    'After launch',
    'Docs, a walkthrough of the code and, if you want it, ongoing care.',
    ['Documentation and access to everything', 'An optional maintenance plan'],
    'Decide whether you want me around for what comes next.',
  ],
]

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
  ['Angular', 'framework'],
  ['Next.js', 'framework'],
  ['Payload', 'framework'],
  ['Cloudflare Workers', 'platform'],
  ['Redis', 'tool'],
  ['TypeScript', 'language'],
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

// Brand-site posts. Every brand named here is fictional.
export const brandPosts: [type: string, title: string, series: string | null, subject?: string][] =
  [
    ['essay', 'Most rebrands are a font change with a press release', null],
    ['essay', 'Positioning is a decision, not a sentence', null],
    ['essay', 'Why every direct-to-consumer brand sounds the same', 'Sameness'],
    ['essay', 'The case for boring brand names', 'Sameness'],
    ['brand-breakdown', 'How Kettle & Co. sells a ritual, not tea', 'Breakdowns', 'Kettle & Co.'],
    ['brand-breakdown', 'The quiet rebrand of Northline Bank', 'Breakdowns', 'Northline Bank'],
    ['brand-breakdown', 'Monsoon Juice and the power of a season', 'Breakdowns', 'Monsoon Juice'],
    ['brand-breakdown', 'Why Tandem Bikes owns the colour yellow', null, 'Tandem Bikes'],
    ['campaign-concept', 'A city that never stops, for a metro card', null],
    ['campaign-concept', '“Late again”: a campaign for an alarm app', null],
    ['campaign-concept', 'The slow-coffee billboard series', null],
    ['book-notes', 'On positioning', null],
    ['book-notes', 'On taste, and how to argue about it', null],
    ['research-note', 'How finance apps name their first button', null],
    ['research-note', 'The colours of chai brands, shelf by shelf', null],
    ['video', 'Tearing down a 30-second ad', null],
    ['video', 'Three logos, three rooms', null],
  ]

export const brandParagraphs = [
  'Strip the logo off and most brands in a category become interchangeable. The work is finding the one thing that would still be recognisable without it.',
  'A brand is a set of promises kept in public. The identity is just how you remember which promises those were.',
  'The brief asked for something bold. What it meant was something nobody in the meeting would have to defend later.',
  'Good campaigns start with a tension the audience already feels. The ad only has to name it.',
  'Consistency is underrated because it is boring to present. It is also the only thing that compounds.',
  'The best rebrands change what a company does first and what it looks like second.',
]

export const freelanceAudience = [
  'Founders with an idea and no tech team',
  'Startups that need one more engineer',
  'Small businesses replacing spreadsheets',
  'Teams with an AI-built prototype',
]

export const freelancePrinciples: [title: string, text: string][] = [
  [
    'You talk to the person building it',
    'No account managers or hand-offs between you and the code.',
  ],
  ['You can see progress every week', 'A working build you can open, not a status report.'],
  ['You own everything', 'Code, accounts and designs live in your name from day one.'],
  ['Plain words, no jargon', 'Trade-offs explained so you can make the call.'],
]

export const freelanceFaq: [question: string, answer: string][] = [
  ['Who owns the code?', 'You do. Repositories and accounts are set up in your name.'],
  [
    'Can you work with my existing team?',
    'Yes. I can join your tools and rituals, or work alongside an agency.',
  ],
  [
    'Do you only do Flutter?',
    'No. Mobile is where I started, but web apps, backends and APIs are part of most projects.',
  ],
  [
    'What if my app was built with AI tools?',
    'That is fine. I review it, fix what is risky and keep what works.',
  ],
  [
    'What happens after launch?',
    'You get docs and a walkthrough. Ongoing care is optional, never a condition.',
  ],
]

type Node = [
  key: string,
  label: string,
  kind: 'client' | 'service' | 'data' | 'queue' | 'external',
  tech: string | null,
  column: number,
  row: number,
]
type Hop = [from: string, to: string, label: string, code: string]

export interface ArchitectureCopy {
  nodes: Node[]
  edges: [from: string, to: string, label: string][]
  trace: Hop[]
}

/** Sample diagrams for full-stack projects. */
export const architectures: ArchitectureCopy[] = [
  {
    nodes: [
      ['app', 'Field app', 'client', 'Flutter', 0, 1],
      ['api', 'API', 'service', 'NestJS', 1, 1],
      ['db', 'Database', 'data', 'PostgreSQL', 2, 0],
      ['queue', 'Sync queue', 'queue', 'Redis', 2, 2],
      ['worker', 'Sync worker', 'service', 'TypeScript', 3, 2],
    ],
    edges: [
      ['app', 'api', 'HTTPS'],
      ['api', 'db', 'SQL'],
      ['api', 'queue', 'jobs'],
      ['queue', 'worker', 'consume'],
      ['worker', 'db', 'writes'],
    ],
    trace: [
      ['app', 'api', 'POST /inspections', "await api.post('/inspections', draft)"],
      ['api', 'db', 'Save the inspection', 'await inspections.insert({ ...dto, siteId })'],
      ['api', 'queue', 'Queue the photo sync', "await queue.add('sync-photos', { inspectionId })"],
      ['api', 'app', '201 Created', 'return { id, status: "saved" }'],
    ],
  },
  {
    nodes: [
      ['web', 'Dashboard', 'client', 'Angular', 0, 1],
      ['api', 'API', 'service', 'NestJS', 1, 1],
      ['cache', 'Cache', 'data', 'Redis', 2, 0],
      ['db', 'Database', 'data', 'PostgreSQL', 2, 2],
      ['mail', 'Email provider', 'external', null, 3, 1],
    ],
    edges: [
      ['web', 'api', 'HTTPS'],
      ['api', 'cache', 'read-through'],
      ['api', 'db', 'SQL'],
      ['api', 'mail', 'reports'],
    ],
    trace: [
      [
        'web',
        'api',
        'GET /reports?range=30d',
        "this.http.get('/reports', { params: { range: '30d' } })",
      ],
      ['api', 'cache', 'Check the cache', 'const hit = await cache.get(`reports:${range}`)'],
      [
        'api',
        'db',
        'Aggregate on a miss',
        'SELECT site_id, count(*) FROM readings WHERE taken_at > $1 GROUP BY 1',
      ],
      ['api', 'web', '200 with the report', 'return { rows, generatedAt }'],
    ],
  },
]

// This platform, as its own case study. Facts only from this repository; Uvesh approves
// the wording before it reaches production (docs/case-studies/mosaic.md).
export const mosaic = {
  title: 'Mosaic: this portfolio platform',
  summary:
    'One monorepo for a personal site with several profiles, a brand site, a headless admin, a public demo admin and a contact service.',
  repo: 'https://github.com/uveshm003/mosaic',
  tech: ['Next.js', 'Payload', 'PostgreSQL', 'Cloudflare Workers', 'TypeScript', 'GitHub Actions'],
  body: [
    ['h2', 'The problem'],
    [
      'p',
      'Five portfolio profiles and a brand site, each with its own look, but one place to write content and no server to run or pay for.',
    ],
    ['h2', 'The approach'],
    [
      'p',
      'Payload is the only writer. A build step exports published content into a typed snapshot, and both Next.js sites are static exports built from it, so nothing calls the admin at runtime.',
    ],
    [
      'p',
      'Environments are separated by code, not care: seeded documents carry a flag, the seed refuses the production database, and a production build fails if the snapshot contains seed data.',
    ],
    [
      'p',
      'The contact form posts to a Cloudflare Worker that checks Turnstile and a honeypot, validates with Zod, inserts into Postgres as a role that can only insert inquiries, and sends one email.',
    ],
    ['h2', 'The outcome'],
    [
      'p',
      'Publishing is a button in the local admin that starts a GitHub Actions deploy to GitHub Pages. A public demo admin, reset every night, lets anyone look around as a read-only reviewer.',
    ],
  ] as const,
  architecture: {
    nodes: [
      ['admin', 'Local admin', 'client', 'Payload', 0, 0],
      ['db', 'Neon Postgres', 'data', 'PostgreSQL', 1, 1],
      ['ci', 'Export & build', 'service', 'GitHub Actions', 2, 0],
      ['pages', 'GitHub Pages', 'external', 'Next.js', 3, 0],
      ['visitor', 'Visitor', 'client', null, 3, 1],
      ['worker', 'Contact Worker', 'service', 'Cloudflare Workers', 2, 2],
      ['email', 'Resend', 'external', null, 3, 2],
    ],
    edges: [
      ['admin', 'db', 'writes'],
      ['admin', 'ci', 'Publish'],
      ['ci', 'db', 'reads published'],
      ['ci', 'pages', 'deploys'],
      ['visitor', 'worker', 'contact form'],
      ['worker', 'db', 'INSERT'],
      ['worker', 'email', 'notify'],
    ],
    trace: [
      [
        'visitor',
        'worker',
        'Submit the contact form',
        "fetch(endpoint, { method: 'POST', body: JSON.stringify({ ...form, turnstileToken }) })",
      ],
      [
        'worker',
        'db',
        'Store the inquiry',
        'INSERT INTO inquiries (profile, name, email, project_type, message, timeline)\nVALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      ],
      [
        'worker',
        'email',
        'Send one notification',
        "fetcher('https://api.resend.com/emails', { method: 'POST', headers, body })",
      ],
      ['worker', 'visitor', '200, message received', 'return json({ ok: true })'],
    ],
  } satisfies ArchitectureCopy,
}
