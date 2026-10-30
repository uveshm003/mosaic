import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminField } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'email', defaultColumns: ['email', 'role'] },
  access: {
    read: ({ req }) => {
      if (!req.user) return false
      return req.user.role === 'admin' || { id: { equals: req.user.id } }
    },
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      // The first account is Uvesh's, created through Payload's first-user screen.
      async ({ data, operation, req }) => {
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'users', req })
          if (totalDocs === 0) return { ...data, role: 'admin' }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'reviewer',
      options: ['admin', 'reviewer'],
      access: { update: isAdminField },
      saveToJWT: true,
    },
  ],
}
