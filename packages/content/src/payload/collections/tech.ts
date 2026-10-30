import type { CollectionConfig } from 'payload'
import { adminOnly } from '../access'

export const Tech: CollectionConfig = {
  slug: 'tech',
  access: adminOnly,
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'kind'] },
  fields: [
    { name: 'name', type: 'text', required: true, unique: true },
    {
      name: 'kind',
      type: 'select',
      required: true,
      options: ['language', 'framework', 'tool', 'platform'],
    },
  ],
}
