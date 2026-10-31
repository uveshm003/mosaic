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
      // The first account is Uvesh's, created through Payload's first-user screen. The
      // public demo never promotes it (anyone could reach that screen on an empty demo),
      // and the demo reset sets its reviewer's role itself.
      async ({ data, operation, req }) => {
        const keepRole = req.context.keepRole === true || req.payload.config.custom.demo === true
        if (operation === 'create' && !keepRole) {
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
