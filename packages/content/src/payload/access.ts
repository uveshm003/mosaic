import type { Access, FieldAccess } from 'payload'

// Admin edits everything; the demo's reviewer user can only read.
export const isAdmin: Access = ({ req }) => req.user?.role === 'admin'

export const isAdminField: FieldAccess = ({ req }) => req.user?.role === 'admin'

export const isSignedIn: Access = ({ req }) => Boolean(req.user)

export const adminOnly = {
  read: isSignedIn,
  create: isAdmin,
  update: isAdmin,
  delete: isAdmin,
}
