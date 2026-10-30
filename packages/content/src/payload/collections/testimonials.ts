import { APIError, type CollectionConfig } from 'payload'
import { adminOnly } from '../access'
import { testimonialPublishError } from '../rules'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  access: adminOnly,
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'company', 'consentConfirmed', '_status'] },
  // Drafts let a testimonial be entered while consent is pending.
  versions: { drafts: true },
  hooks: {
    beforeChange: [
      ({ data }) => {
        const error = testimonialPublishError(data)
        if (error) throw new APIError(error, 400, null, true)
        return data
      },
    ],
  },
  fields: [
    { name: 'quote', type: 'textarea', required: true },
    { name: 'name', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'role', type: 'text' },
        { name: 'company', type: 'text' },
      ],
    },
    { name: 'project', type: 'relationship', relationTo: 'projects' },
    {
      name: 'consentConfirmed',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'The person agreed to this being published.' },
    },
  ],
}
