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
    { name: 'name', type: 'text', required: true },
    { name: 'headlines', type: 'array', fields: [{ name: 'text', type: 'text', required: true }] },
    { name: 'location', type: 'text' },
    { name: 'contactLinks', type: 'array', fields: link },
    { name: 'about', type: 'richText' },
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
