import type { Field, GlobalConfig } from 'payload'
import { profileKeys } from '../../profiles'
import { isAdmin, isSignedIn } from '../access'

const access = { read: isSignedIn, update: isAdmin }

const link: Field[] = [
  { name: 'label', type: 'text', required: true },
  { name: 'url', type: 'text', required: true },
]

export const Person: GlobalConfig = {
  slug: 'person',
  access,
  versions: { drafts: true },
  fields: [
    // Not required so purge can blank a seeded person; the snapshot export checks it.
    { name: 'name', type: 'text' },
    { name: 'headlines', type: 'array', fields: [{ name: 'text', type: 'text', required: true }] },
    { name: 'location', type: 'text' },
    { name: 'contactLinks', type: 'array', fields: link },
    { name: 'about', type: 'richText' },
  ],
}

const engagementField: Field = {
  name: 'engagement',
  type: 'array',
  admin: { description: 'The steps of an engagement, in order.' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'when', type: 'text', admin: { description: 'For example "Week 1".' } },
    { name: 'summary', type: 'textarea' },
    {
      name: 'youGet',
      type: 'array',
      admin: { description: 'What the client has at the end of this step.' },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
  ],
}

export const Profiles: GlobalConfig = {
  slug: 'profiles',
  access,
  fields: profileKeys.map((key): Field => ({
    name: key,
    type: 'group',
    fields: [
      {
        name: 'enabled',
        type: 'checkbox',
        defaultValue: false,
        admin: { description: 'Only enabled profiles are built.' },
      },
      { name: 'title', type: 'text' },
      { name: 'tagline', type: 'text' },
      { name: 'themeKey', type: 'text', defaultValue: key },
      {
        name: 'seo',
        type: 'group',
        fields: [
          { name: 'title', type: 'text' },
          { name: 'description', type: 'textarea' },
        ],
      },
      {
        name: 'primaryAction',
        type: 'group',
        fields: [
          { name: 'label', type: 'text' },
          { name: 'url', type: 'text' },
        ],
      },
      // How an engagement works, shown as the Freelance profile's process timeline.
      ...(key === 'freelance' ? [engagementField] : []),
    ],
  })),
}

export const BrandSettings: GlobalConfig = {
  slug: 'brandSettings',
  access,
  fields: [
    {
      name: 'name',
      type: 'text',
      admin: { description: 'Placeholder until the brand-name checkpoint.' },
    },
    { name: 'domain', type: 'text' },
    { name: 'voiceNotes', type: 'textarea' },
  ],
}

export const SiteSettings: GlobalConfig = {
  slug: 'siteSettings',
  access,
  fields: [
    { name: 'footerLinks', type: 'array', fields: link },
    { name: 'analyticsToken', type: 'text' },
  ],
}
