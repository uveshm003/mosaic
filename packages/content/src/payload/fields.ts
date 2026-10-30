import type { ArrayField, Field, SelectField, TextField } from 'payload'
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
