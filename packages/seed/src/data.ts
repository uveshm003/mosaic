import { en, Faker } from '@faker-js/faker'
import { listingProfileKeys, profileKeys } from '@mosaic/content'
import { demoStatuses, postTypes } from '@mosaic/content/payload'
import type {
  CollectionSlug,
  DataFromGlobalSlug,
  GlobalSlug,
  RequiredDataFromCollectionSlug,
} from 'payload'
import * as copy from './copy'
import { block, heading, richText } from './lexical'

export type SeedVariant = 'dev' | 'demo'

type Data<T extends CollectionSlug> = RequiredDataFromCollectionSlug<T>
type GlobalData<T extends GlobalSlug> = Omit<DataFromGlobalSlug<T>, 'id'>

const brandPostTypes = new Set([
  'brand-breakdown',
  'campaign-concept',
  'book-notes',
  'research-note',
  'video',
])

// Fixed seed so data and screenshots stay the same between runs.
export const FAKER_SEED = 20261030

export class SeedData {
  readonly faker: Faker

  constructor(readonly variant: SeedVariant) {
    this.faker = new Faker({ locale: [en] })
    this.faker.seed(FAKER_SEED)
    // Dates are relative to this, not to now, so reruns produce the same data.
    this.faker.setDefaultRefDate(new Date('2026-10-01T00:00:00Z'))
  }

  /** Dev titles carry a "Sample:" prefix so they can't pass for real content. */
  label(text: string): string {
    return this.variant === 'dev' ? `Sample: ${text}` : text
  }

  private appName(index: number): string {
    const [first, second] = copy.appNames[index % copy.appNames.length] ?? ['App', '']
    return this.label(`${first}${second}`)
  }

  private pick<T>(items: readonly T[]): T {
    return this.faker.helpers.arrayElement(items)
  }

  private slug(text: string, index: number): string {
    const base = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60)
      .replace(/-$/, '')
    return `${base}-${String(index + 1)}`
  }

  private paragraphs(count: number) {
    return richText(Array.from({ length: count }, () => this.pick(copy.postParagraphs)))
  }

  /** A case study in three short sections. */
  private caseStudy(audience: string, job: string) {
    return richText([
      heading('The problem'),
      `${audience[0]?.toUpperCase() ?? ''}${audience.slice(1)} needed a way to ${job}. The existing tools were slow, did not work offline, and looked different on every device.`,
      heading('The approach'),
      this.pick(copy.approaches),
      this.pick(copy.approaches),
      heading('The outcome'),
      this.pick(copy.outcomes),
    ])
  }

  tech(): Data<'tech'>[] {
    // Real technology names: tags, not claims, and only ever in dev and demo databases.
    return copy.tech.map(([name, kind]) => ({ name, kind, _seed: true }))
  }

  projects(techIds: number[], mediaIds: number[]): Data<'projects'>[] {
    const kinds = ['work', 'freelance', 'personal', 'open-source'] as const
    const platforms = ['android', 'ios', 'web', 'macos', 'windows', 'linux'] as const
    return Array.from({ length: 10 }, (_, index) => {
      const longTitle = index === 0
      const title = longTitle
        ? this.label(
            'An offline-first field inspection platform for utility crews working across remote sites with patchy coverage',
          )
        : this.appName(index)
      const audience = copy.audiences[index % copy.audiences.length] ?? 'teams'
      const job = copy.jobs[index % copy.jobs.length] ?? 'work faster'
      const restricted = index >= 8
      const profiles = listingProfileKeys.filter((_, p) => (index + p) % 2 === 0)
      return {
        title,
        slug: this.slug(title, index),
        // Index 3 covers empty sections.
        summary: index === 3 ? null : `Helps ${audience} ${job}.`,
        body: index === 3 ? null : this.caseStudy(audience, job),
        role: this.pick(copy.roles),
        team: `Team of ${String(this.faker.number.int({ min: 2, max: 6 }))}`,
        period: {
          start: this.faker.date.past({ years: 4 }).toISOString(),
          end: index % 3 === 0 ? null : this.faker.date.recent({ days: 200 }).toISOString(),
        },
        platforms: this.faker.helpers.arrayElements(platforms, { min: 1, max: 4 }),
        // Index 2 carries every tech tag.
        tech: index === 2 ? techIds : this.faker.helpers.arrayElements(techIds, { min: 1, max: 4 }),
        links: {
          store:
            index % 2 === 0
              ? [{ store: 'play-store' as const, url: this.faker.internet.url() }]
              : [],
          repo: index % 3 === 0 ? null : this.faker.internet.url(),
          live: index % 4 === 0 ? this.faker.internet.url() : null,
          video: null,
        },
        demoStatus: demoStatuses[index % demoStatuses.length] ?? 'private',
        confidentiality: restricted ? 'restricted' : 'public',
        kind: kinds[index % kinds.length] ?? 'personal',
        employer: index % 4 === 0 ? this.faker.company.name() : null,
        metrics:
          index % 3 === 1
            ? copy.metricLabels
                .slice(0, 3)
                .map(([label, value]) => ({ label: this.label(label), value }))
            : [],
        // Index 1 covers missing media.
        media: index === 1 ? [] : this.faker.helpers.arrayElements(mediaIds, { min: 1, max: 2 }),
        profiles,
        overrides: profiles.includes('freelance')
          ? [
              {
                profile: 'freelance' as const,
                title: this.label(
                  `${copy.appNames[index % copy.appNames.length]?.join('') ?? 'App'} for ${audience}`,
                ),
                summary: `A product built for ${audience}, from first sketch to store release.`,
                highlights: [{ text: this.pick(copy.outcomes) }],
                order: index,
                featured: index % 2 === 0,
              },
            ]
          : [],
        _status: restricted ? 'draft' : 'published',
        _seed: true,
      }
    })
  }

  /** One of every rich-text block, so the sites have each kind to render. */
  private everyBlock(mediaIds: number[]) {
    const id = () => this.faker.database.mongodbObjectId()
    return richText([
      this.pick(copy.postParagraphs),
      block(id(), 'code', {
        language: 'dart',
        code: "void main() => print('Sample');",
        filename: 'main.dart',
      }),
      block(id(), 'mermaid', {
        definition: 'graph LR\n  Admin --> Snapshot --> Site',
        caption: this.label('Diagram'),
      }),
      block(id(), 'youtube', {
        url: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
        title: this.label('Video'),
      }),
      block(id(), 'flutterDemo', {
        demo: 'sample-demo',
        title: this.label('Demo'),
        poster: mediaIds[0] ?? null,
      }),
      block(id(), 'image', { image: mediaIds[1] ?? mediaIds[0], caption: this.label('Caption') }),
      block(id(), 'callout', { tone: 'tip', text: this.pick(copy.outcomes) }),
      block(id(), 'metrics', { items: [{ label: this.label('Metric'), value: '42%' }] }),
      block(id(), 'storeLinks', {
        links: [{ store: 'play-store', url: this.faker.internet.url() }],
      }),
    ])
  }

  private brandParagraphs(count: number, offset: number) {
    return richText(
      Array.from(
        { length: count },
        (_, i) => copy.brandParagraphs[(offset + i) % copy.brandParagraphs.length] ?? '',
      ),
    )
  }

  posts(mediaIds: number[]): Data<'posts'>[] {
    // Personal-site posts, one per type; the brand site's come from copy.brandPosts.
    const personalTypes = postTypes.filter((type) => !brandPostTypes.has(type))
    const posts: Data<'posts'>[] = personalTypes.map((type, index) => {
      const title = this.label(copy.postTitles[index % copy.postTitles.length] ?? 'Notes')
      return {
        title,
        slug: this.slug(title, index),
        site: 'personal',
        type,
        body: index === 0 ? this.everyBlock(mediaIds) : this.paragraphs(4),
        profiles: [listingProfileKeys[index % 4] ?? 'flutter'],
        tags: this.faker.helpers.arrayElements(
          ['flutter', 'dart', 'kotlin', 'performance', 'design', 'sync', 'native'],
          3,
        ),
        cover: index % 3 === 0 ? null : (mediaIds[index % mediaIds.length] ?? null),
        youtubeUrl: null,
        references: [{ title: 'Flutter documentation', url: 'https://docs.flutter.dev' }],
        series: index < 3 ? this.label('Series') : null,
        publishedAt: this.faker.date.past({ years: 1 }).toISOString(),
        _status: 'published',
        _seed: true,
      }
    })
    const longTitle = this.label(
      'Everything I wish I had known before shipping a Flutter app to Android, iOS, the web and three desktop platforms at once',
    )
    posts.push({
      title: longTitle,
      slug: this.slug(longTitle, posts.length),
      site: 'personal',
      type: 'essay',
      body: this.paragraphs(2),
      profiles: ['flutter'],
      // Many tags, an edge case for tag lists.
      tags: this.faker.helpers.uniqueArray(() => this.faker.word.sample(), 30),
      _status: 'published',
      _seed: true,
    })
    // The brand site, with every type and a couple of series.
    copy.brandPosts.forEach(([type, text, series, subject], index) => {
      const title = this.label(text)
      posts.push({
        title,
        slug: this.slug(title, posts.length),
        site: 'brand',
        type: type as Data<'posts'>['type'],
        body: this.brandParagraphs(3 + (index % 3), index),
        profiles: [],
        tags: this.faker.helpers.arrayElements(
          ['positioning', 'identity', 'naming', 'advertising', 'growth', 'retail', 'india'],
          2,
        ),
        cover: index % 4 === 1 ? null : (mediaIds[index % mediaIds.length] ?? null),
        youtubeUrl: type === 'video' ? 'https://www.youtube.com/watch?v=aqz-KE-bpKQ' : null,
        references:
          type === 'research-note' || type === 'book-notes'
            ? [{ title: this.label('Source'), url: this.faker.internet.url() }]
            : [],
        series: series ? this.label(series) : null,
        subject: subject ?? null,
        publishedAt: this.faker.date.past({ years: 1 }).toISOString(),
        _status: 'published',
        _seed: true,
      })
    })
    const draft = this.label('Draft: notes on a rebrand')
    posts.push({
      title: draft,
      slug: this.slug(draft, posts.length),
      site: 'brand',
      type: 'essay',
      body: this.paragraphs(1),
      _status: 'draft',
      _seed: true,
    })
    return posts
  }

  services(): Data<'services'>[] {
    return copy.services.map(([title, summary], index) => ({
      title: this.label(title),
      summary,
      deliverables: [
        'Discovery call and written plan',
        'Weekly builds you can try',
        'Handover with docs',
      ].map((text) => ({ text })),
      typicalTimeline: `${String(this.faker.number.int({ min: 2, max: 12 }))} weeks`,
      order: index,
      _status: 'published' as const,
      _seed: true,
    }))
  }

  testimonials(projectIds: number[]): Data<'testimonials'>[] {
    return Array.from({ length: 4 }, (_, index) => {
      // The last one waits for consent, so it stays a draft.
      const consent = index < 3
      return {
        quote: copy.testimonialQuotes[index % copy.testimonialQuotes.length] ?? '',
        name: this.label(this.faker.person.fullName()),
        role: this.faker.person.jobTitle(),
        company: this.faker.company.name(),
        project: projectIds[index] ?? null,
        consentConfirmed: consent,
        _status: consent ? 'published' : 'draft',
        _seed: true,
      }
    })
  }

  inquiries(): Data<'inquiries'>[] {
    const statuses = ['new', 'replied', 'archived'] as const
    return Array.from({ length: 8 }, (_, index) => ({
      profile: profileKeys[index % profileKeys.length] ?? 'freelance',
      name: this.label(this.faker.person.fullName()),
      email: this.faker.internet.email({ provider: 'example.com' }),
      projectType: this.pick(['Mobile app', 'Web app', 'MVP', 'Maintenance']),
      message: copy.inquiryMessages[index % copy.inquiryMessages.length] ?? '',
      timeline: index % 2 === 0 ? `${String(index + 1)} months` : null,
      status: statuses[index % statuses.length] ?? 'new',
      _seed: true,
    }))
  }

  experience(): Data<'experience'>[] {
    return Array.from({ length: 3 }, (_, index) => ({
      title: this.label(
        ['Senior Flutter Engineer', 'Flutter Developer', 'Android Developer'][index] ?? 'Engineer',
      ),
      employer: copy.companies[index] ?? 'Company',
      employerDetail: index === 0 ? 'Mobile platform team' : null,
      location: this.faker.location.city(),
      period: {
        start: this.faker.date.past({ years: 6 }).toISOString(),
        end: index === 0 ? null : this.faker.date.past({ years: 1 }).toISOString(),
      },
      highlights: copy.experienceHighlights
        .slice(index * 2, index * 2 + 3)
        .map((text) => ({ text })),
      variants: ['broad', index === 0 ? 'flutter' : 'android'],
      order: index,
      _seed: true,
    }))
  }

  education(): Data<'education'>[] {
    return [
      {
        institution: this.label(`${this.faker.location.city()} University`),
        degree: 'Bachelor of Engineering',
        field: 'Computer Engineering',
        location: this.faker.location.city(),
        period: {
          start: this.faker.date.past({ years: 10 }).toISOString(),
          end: this.faker.date.past({ years: 5 }).toISOString(),
        },
        highlights: [],
        variants: ['broad'],
        order: 0,
        _seed: true,
      },
    ]
  }

  skills(): Data<'skills'>[] {
    return copy.skills.map(([name, category], index) => ({
      name,
      category,
      variants: ['broad'],
      order: index,
      _seed: true,
    }))
  }

  person(): GlobalData<'person'> {
    return {
      name: this.label(this.faker.person.fullName()),
      headlines: [{ text: 'Flutter & mobile engineer' }, { text: 'Open to relocation' }],
      location: this.faker.location.city(),
      contactLinks: [
        { label: 'GitHub', url: 'https://github.com/example' },
        { label: 'LinkedIn', url: 'https://www.linkedin.com/in/example' },
        { label: 'Email', url: 'mailto:hello@example.com' },
      ],
      about: richText([...copy.about]),
      _status: 'published',
      _seed: true,
    }
  }

  profiles(): GlobalData<'profiles'> {
    const profile = (key: string) => ({
      enabled: true,
      title: this.label(key),
      tagline: copy.profileTaglines[key] ?? null,
      themeKey: key,
      seo: { title: this.label(key), description: copy.profileTaglines[key] ?? null },
      primaryAction: { label: 'Get in touch', url: '#contact' },
    })
    return {
      root: profile('root'),
      flutter: profile('flutter'),
      product: profile('product'),
      freelance: profile('freelance'),
      fullstack: profile('fullstack'),
      _seed: true,
    }
  }

  brandSettings(): GlobalData<'brandSettings'> {
    return {
      // The working name from the spec, until the brand-name checkpoint.
      name: this.label('Menpur Studio'),
      domain: null,
      voiceNotes: 'Curious, direct, a little playful.',
      _seed: true,
    }
  }

  siteSettings(): GlobalData<'siteSettings'> {
    return {
      footerLinks: [{ label: this.label('Link'), url: this.faker.internet.url() }],
      analyticsToken: null,
      _seed: true,
    }
  }
}
