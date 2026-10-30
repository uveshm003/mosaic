import type { CollectionConfig } from 'payload'
import { adminOnly } from '../access'
import { listingProfilesField, slugField } from '../fields'
import { youTubeUrlError } from '../rules'

export const postTypes = [
  'essay',
  'brand-breakdown',
  'campaign-concept',
  'book-notes',
  'research-note',
  'teardown',
  'improvement-proposal',
  'case-study',
  'video',
] as const

export const Posts: CollectionConfig = {
  slug: 'posts',
  access: adminOnly,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'site', 'type', 'publishedAt', '_status'],
  },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField,
    {
      name: 'site',
      type: 'select',
      required: true,
      options: ['personal', 'brand'],
      admin: { position: 'sidebar' },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [...postTypes],
      admin: { position: 'sidebar' },
    },
    { name: 'body', type: 'richText' },
    listingProfilesField,
    { name: 'tags', type: 'text', hasMany: true },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    {
      name: 'youtubeUrl',
      type: 'text',
      validate: (value: unknown) => youTubeUrlError(value) ?? true,
    },
    {
      name: 'references',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    { name: 'series', type: 'text' },
    { name: 'publishedAt', type: 'date', admin: { position: 'sidebar' } },
  ],
}
