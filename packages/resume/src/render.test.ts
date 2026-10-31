import { describe, expect, it } from 'vitest'
import { linkLabel, renderResume, type ResumeContent } from './render'

// Fictional content in the shape of the real resume files.
const content: ResumeContent = {
  person: {
    name: 'Site Name',
    contactLinks: [
      { url: 'mailto:ada@example.com' },
      { url: 'https://ada.example.com/' },
      { url: 'https://www.linkedin.com/in/ada/' },
    ],
    resume: {
      name: 'Ada Lovelace',
      phone: '+00 0000 000000',
      languages: 'English, French (learning)',
      headlines: [
        { variant: 'flutter', text: 'Mobile Engineer · 3 YoE · Flutter' },
        { variant: 'product-company', text: 'Product Engineer · 3 YoE · Ownership' },
      ],
    },
  },
  experience: [
    {
      title: 'Developer',
      employer: 'Older Co',
      employerDetail: 'Studio',
      location: 'Pune, India',
      period: { start: '2023-09-01T00:00:00.000Z', end: '2025-01-15T00:00:00.000Z' },
      highlights: [{ text: 'Shipped apps.' }],
      variants: ['flutter'],
      order: 1,
    },
    {
      title: 'Software Engineer (Example Instruments)',
      employer: 'Example Group PLC',
      location: 'Ahmedabad, India',
      period: { start: '2025-10-01T00:00:00.000Z', end: null },
      highlights: [
        { text: 'Built the platform.', variants: ['flutter'] },
        { text: 'Owned the product decisions.', variants: ['product-company'] },
        { text: 'Worked across three countries.' },
      ],
      variants: [],
      order: 0,
    },
  ],
  education: [
    {
      institution: 'Example College',
      degree: 'B.Tech',
      field: 'Information Technology',
      location: 'Ahmedabad, India',
      period: { start: '2020-08-01T00:00:00.000Z', end: '2023-06-01T00:00:00.000Z' },
      variants: [],
    },
  ],
  skills: [
    { name: 'Dart', category: 'Languages', variants: ['flutter'], order: 0 },
    { name: 'Kotlin', category: 'Languages', variants: ['flutter'], order: 1 },
    { name: 'BLoC', category: 'Architecture', variants: ['flutter'], order: 2 },
    { name: 'Roadmaps', category: 'Product', variants: ['product-company'], order: 0 },
  ],
  projects: [
    {
      title: 'Second',
      resume: [
        {
          variants: ['flutter'],
          order: 2,
          tagline: 'Flutter',
          bullets: [{ text: 'Second project.' }],
        },
      ],
    },
    {
      title: 'Long CMS title',
      resume: [
        {
          variants: ['flutter'],
          title: 'First',
          order: 1,
          tagline: 'Flutter, Dart',
          bullets: [{ text: 'First, Flutter wording.' }],
        },
        {
          variants: ['product-company'],
          title: 'First',
          order: 1,
          tagline: 'marketplace',
          bullets: [{ text: 'First, product wording.' }],
        },
      ],
    },
  ],
}

describe('renderResume', () => {
  it('writes the exact structure of the resume files', () => {
    expect(renderResume(content, 'flutter')).toBe(
      [
        '# Ada Lovelace',
        '',
        '**Mobile Engineer · 3 YoE · Flutter**',
        '',
        '+00 0000 000000 · [ada@example.com](mailto:ada@example.com) · [ada.example.com](https://ada.example.com/) · [linkedin.com/in/ada](https://www.linkedin.com/in/ada/)',
        '',
        '## Professional Experience',
        '',
        '**Example Group PLC** | Oct 2025 - Present  ',
        '*Software Engineer (Example Instruments)* | Ahmedabad, India',
        '',
        '- Built the platform.',
        '- Worked across three countries.',
        '',
        '**Older Co** | Sep 2023 - Jan 2025  ',
        '*Developer · Studio* | Pune, India',
        '',
        '- Shipped apps.',
        '',
        '## Technical Skills',
        '',
        '- **Languages:** Dart, Kotlin',
        '- **Architecture:** BLoC',
        '',
        '## Technical Projects',
        '',
        '**First** | Flutter, Dart',
        '',
        '- First, Flutter wording.',
        '',
        '**Second** | Flutter',
        '',
        '- Second project.',
        '',
        '## Education',
        '',
        '**Example College** | 2020 - 2023  ',
        '*B.Tech, Information Technology* | Ahmedabad, India',
        '',
        '**Languages:** English, French (learning)',
        '',
      ].join('\n'),
    )
  })

  it('swaps wording, skills and projects by variant', () => {
    const product = renderResume(content, 'product-company')
    expect(product).toContain('**Product Engineer · 3 YoE · Ownership**')
    expect(product).toContain('- Owned the product decisions.')
    expect(product).not.toContain('Built the platform.')
    expect(product).not.toContain('Older Co')
    expect(product).toContain('- **Product:** Roadmaps')
    expect(product).toContain('**First** | marketplace')
    expect(product).not.toContain('**Second**')
  })

  it('uses the employer line as entered, Halma India PLC format included', () => {
    expect(renderResume(content, 'flutter')).toMatch(
      /\*\*Example Group PLC\*\* \| Oct 2025 - Present {2}\n\*Software Engineer \(Example Instruments\)\*/,
    )
  })

  it('leaves out empty sections', () => {
    const bare = renderResume(
      { person: { name: 'X' }, experience: [], education: [], skills: [], projects: [] },
      'broad',
    )
    expect(bare).toBe('# X\n')
  })
})

describe('linkLabel', () => {
  it('shows addresses the way the resume does', () => {
    expect(linkLabel('mailto:a@b.co')).toBe('a@b.co')
    expect(linkLabel('https://github.com/a')).toBe('github.com/a')
    expect(linkLabel('https://www.linkedin.com/in/a/')).toBe('linkedin.com/in/a')
  })
})
