import type { CollectionConfig } from 'payload'
import { adminOnly } from '../access'
import { highlightsField, periodField, resumeVariantsField } from '../fields'

export const Experience: CollectionConfig = {
  slug: 'experience',
  access: adminOnly,
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'employer', 'order'] },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'employer',
      type: 'text',
      required: true,
      admin: { description: 'Employer line as it appears, e.g. "Halma India PLC".' },
    },
    { name: 'employerDetail', type: 'text', admin: { description: 'Line beneath the employer.' } },
    { name: 'location', type: 'text' },
    periodField,
    highlightsField,
    resumeVariantsField,
    { name: 'order', type: 'number', admin: { position: 'sidebar' } },
  ],
}

export const Education: CollectionConfig = {
  slug: 'education',
  access: adminOnly,
  admin: { useAsTitle: 'institution', defaultColumns: ['institution', 'degree', 'order'] },
  fields: [
    { name: 'institution', type: 'text', required: true },
    { name: 'degree', type: 'text', required: true },
    { name: 'field', type: 'text' },
    { name: 'location', type: 'text' },
    periodField,
    highlightsField,
    resumeVariantsField,
    { name: 'order', type: 'number', admin: { position: 'sidebar' } },
  ],
}

export const Skills: CollectionConfig = {
  slug: 'skills',
  access: adminOnly,
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'category', 'order'] },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'category', type: 'text', required: true },
    resumeVariantsField,
    { name: 'order', type: 'number', admin: { position: 'sidebar' } },
  ],
}
