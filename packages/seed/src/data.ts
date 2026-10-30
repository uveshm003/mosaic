import { en, Faker } from '@faker-js/faker'
import { listingProfileKeys, profileKeys } from '@mosaic/content'
import { demoStatuses, postTypes } from '@mosaic/content/payload'
import type {
  CollectionSlug,
  DataFromGlobalSlug,
  GlobalSlug,
  RequiredDataFromCollectionSlug,
} from 'payload'
import { block, richText } from './lexical'

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

  private title(words = 3): string {
    const text = this.faker.commerce.productName().split(' ').slice(0, words).join(' ')
    return this.label(text)
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
    return richText(Array.from({ length: count }, () => this.faker.lorem.paragraph()))
  }

  tech(): Data<'tech'>[] {
    const kinds = ['language', 'framework', 'tool', 'platform'] as const
    return Array.from({ length: 12 }, (_, index) => ({
      name: this.label(`${this.faker.hacker.noun()} ${String(index + 1)}`),
      kind: kinds[index % kinds.length] ?? 'tool',
      _seed: true,
    }))
  }

  projects(techIds: number[], mediaIds: number[]): Data<'projects'>[] {
    const kinds = ['work', 'freelance', 'personal', 'open-source'] as const
    const platforms = ['android', 'ios', 'web', 'macos', 'windows', 'linux'] as const
    return Array.from({ length: 10 }, (_, index) => {
      const longTitle = index === 0
      const title = longTitle ? this.label(this.faker.lorem.words(24)) : this.title()
      const restricted = index >= 8
      const profiles = listingProfileKeys.filter((_, p) => (index + p) % 2 === 0)
      return {
        title,
        slug: this.slug(title, index),
        // Index 3 covers empty sections.
        summary: index === 3 ? null : this.faker.lorem.sentences(2),
        body: index === 3 ? null : this.paragraphs(3),
        role: this.faker.person.jobTitle(),
        team: `${String(this.faker.number.int({ min: 1, max: 6 }))} people`,
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
            ? [{ label: this.label('Metric'), value: `${String(this.faker.number.int(90))}%` }]
            : [],
        // Index 1 covers missing media.
        media: index === 1 ? [] : this.faker.helpers.arrayElements(mediaIds, { min: 1, max: 2 }),
        profiles,
        overrides: profiles.includes('freelance')
          ? [
              {
                profile: 'freelance' as const,
                title: this.label('Freelance wording'),
                summary: this.faker.lorem.sentence(),
                highlights: [{ text: this.faker.lorem.sentence() }],
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
      this.faker.lorem.paragraph(),
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
      block(id(), 'callout', { tone: 'tip', text: this.faker.lorem.sentence() }),
      block(id(), 'metrics', { items: [{ label: this.label('Metric'), value: '42%' }] }),
      block(id(), 'storeLinks', {
        links: [{ store: 'play-store', url: this.faker.internet.url() }],
      }),
    ])
  }

  posts(mediaIds: number[]): Data<'posts'>[] {
    const posts: Data<'posts'>[] = postTypes.map((type, index) => {
      const title = this.title(4)
      return {
        title,
        slug: this.slug(title, index),
        site: brandPostTypes.has(type) ? 'brand' : 'personal',
        type,
        body: index === 0 ? this.everyBlock(mediaIds) : this.paragraphs(4),
        profiles: brandPostTypes.has(type) ? [] : [listingProfileKeys[index % 4] ?? 'flutter'],
        tags: this.faker.helpers.uniqueArray(() => this.faker.word.noun(), 3),
        cover: index % 3 === 0 ? null : (mediaIds[index % mediaIds.length] ?? null),
        youtubeUrl: type === 'video' ? 'https://www.youtube.com/watch?v=aqz-KE-bpKQ' : null,
        references: [{ title: this.faker.lorem.words(3), url: this.faker.internet.url() }],
        series: index < 3 ? this.label('Series') : null,
        publishedAt: this.faker.date.past({ years: 1 }).toISOString(),
        _status: 'published',
        _seed: true,
      }
    })
    const longTitle = this.label(this.faker.lorem.words(28))
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
    const draft = this.title()
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
    return Array.from({ length: 5 }, (_, index) => ({
      title: this.title(2),
      summary: this.faker.lorem.sentences(2),
      deliverables: Array.from({ length: 3 }, () => ({ text: this.faker.lorem.words(4) })),
      typicalTimeline: `${String(this.faker.number.int({ min: 2, max: 12 }))} weeks`,
      order: index,
      _status: 'published',
      _seed: true,
    }))
  }

  testimonials(projectIds: number[]): Data<'testimonials'>[] {
    return Array.from({ length: 4 }, (_, index) => {
      // The last one waits for consent, so it stays a draft.
      const consent = index < 3
      return {
        quote: this.faker.lorem.sentences(2),
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
      projectType: this.faker.commerce.department(),
      message: this.faker.lorem.paragraph(),
      timeline: index % 2 === 0 ? `${String(index + 1)} months` : null,
      status: statuses[index % statuses.length] ?? 'new',
      _seed: true,
    }))
  }

  experience(): Data<'experience'>[] {
    return Array.from({ length: 3 }, (_, index) => ({
      title: this.label(this.faker.person.jobTitle()),
      employer: this.faker.company.name(),
      employerDetail: index === 0 ? this.faker.company.catchPhrase() : null,
      location: this.faker.location.city(),
      period: {
        start: this.faker.date.past({ years: 6 }).toISOString(),
        end: index === 0 ? null : this.faker.date.past({ years: 1 }).toISOString(),
      },
      highlights: Array.from({ length: 3 }, () => ({ text: this.faker.lorem.sentence() })),
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
    const categories = ['Languages', 'Frameworks', 'Tools']
    return Array.from({ length: 12 }, (_, index) => ({
      name: this.label(this.faker.hacker.noun()),
      category: categories[index % categories.length] ?? 'Tools',
      variants: ['broad'],
      order: index,
      _seed: true,
    }))
  }

  person(): GlobalData<'person'> {
    return {
      name: this.label(this.faker.person.fullName()),
      headlines: [{ text: this.faker.person.jobTitle() }],
      location: this.faker.location.city(),
      contactLinks: [{ label: 'GitHub', url: this.faker.internet.url() }],
      about: this.paragraphs(3),
      _status: 'published',
      _seed: true,
    }
  }

  profiles(): GlobalData<'profiles'> {
    const profile = (key: string) => ({
      enabled: true,
      title: this.label(key),
      tagline: this.faker.company.catchPhrase(),
      themeKey: key,
      seo: { title: this.label(key), description: this.faker.lorem.sentence() },
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
      name: this.label(this.faker.company.name()),
      domain: null,
      voiceNotes: this.faker.lorem.sentences(2),
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
