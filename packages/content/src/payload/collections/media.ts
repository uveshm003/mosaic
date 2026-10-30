import type { CollectionConfig } from 'payload'
import { adminOnly } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  access: adminOnly,
  upload: {
    mimeTypes: ['image/*'],
    focalPoint: true,
    // Sizes feed srcset on the static sites; there is no runtime optimizer.
    imageSizes: [480, 768, 1280, 1920].map((width) => ({
      name: `w${String(width)}`,
      width,
      withoutEnlargement: true,
      formatOptions: { format: 'webp', options: { quality: 80 } },
    })),
  },
  fields: [
    { name: 'alt', type: 'text', required: true },
    { name: 'caption', type: 'text' },
  ],
}
