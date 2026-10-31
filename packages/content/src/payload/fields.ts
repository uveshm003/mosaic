import type { ArrayField, CheckboxField, Field, SelectField, TextField } from 'payload'
import { listingProfileKeys, profileKeys } from '../profiles'
import { slugError } from './rules'

export const slugField: TextField = {
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: { position: 'sidebar' },
  validate: (value: unknown) => slugError(value) ?? true,
}

export const listingProfilesField: SelectField = {
  name: 'profiles',
  type: 'select',
  hasMany: true,
  options: [...listingProfileKeys],
  admin: { position: 'sidebar', description: 'Profiles this appears on.' },
}

export const profileField = (name: string, required = true): SelectField => ({
  name,
  type: 'select',
  required,
  options: [...profileKeys],
})

export const resumeVariants = [
  'product-company',
  'android',
  'flutter',
  'broad',
  'fullstack',
] as const

export const resumeVariantsField: SelectField = {
  name: 'variants',
  type: 'select',
  hasMany: true,
  options: [...resumeVariants],
  admin: { description: 'Resume variants that include this entry.' },
}

export const periodField: Field = {
  name: 'period',
  type: 'group',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'start', type: 'date', admin: { date: { pickerAppearance: 'monthOnly' } } },
        {
          name: 'end',
          type: 'date',
          admin: {
            date: { pickerAppearance: 'monthOnly' },
            description: 'Leave empty if ongoing.',
          },
        },
      ],
    },
  ],
}

export const highlightsField: ArrayField = {
  name: 'highlights',
  type: 'array',
  fields: [{ name: 'text', type: 'text', required: true }],
}

// Marks seeded sample data so purge can find it and production builds can refuse it.
export const seedFlagField: CheckboxField = {
  name: '_seed',
  type: 'checkbox',
  defaultValue: false,
  index: true,
  admin: { position: 'sidebar', readOnly: true, description: 'Seeded sample data.' },
}

const pointsField: ArrayField = {
  name: 'points',
  type: 'array',
  fields: [{ name: 'text', type: 'text', required: true }],
}

/**
 * The interactive canvas on Product pages: a journey to scrub through, the decisions made
 * along the way, and a before/after to compare. Every part is optional.
 */
export const productCanvasField: Field = {
  name: 'canvas',
  type: 'group',
  admin: { description: 'Shown on the Product profile. Leave a part empty to hide it.' },
  fields: [
    {
      name: 'journey',
      type: 'array',
      admin: { description: 'The user’s journey, one stage per row.' },
      fields: [
        { name: 'stage', type: 'text', required: true },
        { name: 'userDoes', type: 'text', admin: { description: 'What the user does here.' } },
        { name: 'pain', type: 'text' },
        { name: 'fix', type: 'text' },
      ],
    },
    {
      name: 'decisions',
      type: 'array',
      fields: [
        { name: 'question', type: 'text', required: true },
        {
          name: 'options',
          type: 'array',
          fields: [{ name: 'text', type: 'text', required: true }],
        },
        { name: 'chosen', type: 'text', admin: { description: 'Must match one option.' } },
        { name: 'why', type: 'textarea' },
      ],
    },
    {
      name: 'comparison',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'beforeTitle', type: 'text' },
            { name: 'afterTitle', type: 'text' },
          ],
        },
        { ...pointsField, name: 'before' },
        { ...pointsField, name: 'after' },
        {
          type: 'row',
          fields: [
            { name: 'beforeImage', type: 'upload', relationTo: 'media' },
            { name: 'afterImage', type: 'upload', relationTo: 'media' },
          ],
        },
      ],
    },
  ],
}
