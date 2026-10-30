import { APIError, type CollectionConfig } from 'payload'
import { listingProfileKeys } from '../../profiles'
import { adminOnly } from '../access'
import { highlightsField, listingProfilesField, periodField, slugField } from '../fields'
import { duplicateProfileError, projectPublishError } from '../rules'

export const demoStatuses = ['live', 'demo-build', 'video', 'repo-only', 'private'] as const

export const Projects: CollectionConfig = {
  slug: 'projects',
  access: adminOnly,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'kind', 'demoStatus', 'confidentiality', '_status'],
  },
  versions: { drafts: true },
  hooks: {
    beforeChange: [
      ({ data }) => {
        const error = projectPublishError(data)
        if (error) throw new APIError(error, 400, null, true)
        return data
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField,
    { name: 'summary', type: 'textarea' },
    { name: 'body', type: 'richText' },
    {
      type: 'row',
      fields: [
        { name: 'role', type: 'text' },
        { name: 'team', type: 'text' },
      ],
    },
    periodField,
    {
      name: 'platforms',
      type: 'select',
      hasMany: true,
      options: ['android', 'ios', 'web', 'macos', 'windows', 'linux'],
    },
    { name: 'tech', type: 'relationship', relationTo: 'tech', hasMany: true },
    {
      name: 'links',
      type: 'group',
      fields: [
        {
          name: 'store',
          type: 'array',
          fields: [
            {
              name: 'store',
              type: 'select',
              required: true,
              options: ['app-store', 'play-store', 'microsoft-store', 'mac-app-store', 'other'],
            },
            { name: 'url', type: 'text', required: true },
          ],
        },
        { name: 'repo', type: 'text' },
        { name: 'live', type: 'text' },
        { name: 'video', type: 'text' },
      ],
    },
    {
      name: 'demoStatus',
      type: 'select',
      required: true,
      options: [...demoStatuses],
      admin: { position: 'sidebar' },
    },
    {
      // Not required: an empty value is treated like restricted and can't be published.
      name: 'confidentiality',
      type: 'select',
      defaultValue: 'restricted',
      options: ['public', 'restricted'],
      admin: {
        position: 'sidebar',
        description: 'Stays restricted until the confidentiality checkpoint clears it.',
      },
    },
    {
      name: 'kind',
      type: 'select',
      required: true,
      options: ['work', 'freelance', 'personal', 'open-source'],
      admin: { position: 'sidebar' },
    },
    { name: 'employer', type: 'text' },
    {
      name: 'metrics',
      type: 'array',
      admin: { description: 'Only metrics Uvesh has supplied and approved.' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    { name: 'media', type: 'upload', relationTo: 'media', hasMany: true },
    listingProfilesField,
    {
      name: 'overrides',
      type: 'array',
      admin: { description: 'Per-profile wording. One row per profile.' },
      validate: (rows: unknown) => duplicateProfileError(rows) ?? true,
      fields: [
        { name: 'profile', type: 'select', required: true, options: [...listingProfileKeys] },
        { name: 'title', type: 'text' },
        { name: 'summary', type: 'textarea' },
        highlightsField,
        {
          type: 'row',
          fields: [
            { name: 'order', type: 'number' },
            { name: 'featured', type: 'checkbox', defaultValue: false },
          ],
        },
      ],
    },
  ],
}
