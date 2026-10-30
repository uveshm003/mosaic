import type { CollectionConfig } from 'payload'
import { adminOnly } from '../access'

export const Services: CollectionConfig = {
  slug: 'services',
  access: adminOnly,
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'order', '_status'] },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'summary', type: 'textarea' },
    {
      name: 'deliverables',
      type: 'array',
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    { name: 'typicalTimeline', type: 'text' },
    { name: 'order', type: 'number', admin: { position: 'sidebar' } },
  ],
}
