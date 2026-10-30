import type { CollectionConfig } from 'payload'
import { isAdmin, isSignedIn } from '../access'
import { profileField } from '../fields'

// Rows are inserted by the contact Worker straight into Postgres, not through this API.
export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  access: { read: isSignedIn, create: () => false, update: isAdmin, delete: isAdmin },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'profile', 'status', 'createdAt'] },
  fields: [
    profileField('profile'),
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'projectType', type: 'text' },
    { name: 'message', type: 'textarea', required: true },
    { name: 'timeline', type: 'text' },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: ['new', 'replied', 'archived'],
      admin: { position: 'sidebar' },
    },
  ],
}
