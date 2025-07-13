import type { CollectionConfig } from 'payload'
import path from 'path'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: false,
      // We'll populate this from filename in hooks
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-generate alt text from filename if not provided
        if (!data.alt && data.filename) {
          const nameWithoutExtension = data.filename.split('.').slice(0, -1).join('.');
          // Convert filename to readable format (replace hyphens/underscores with spaces, capitalize)
          const readableName = nameWithoutExtension
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, (char: string) => char.toUpperCase());
          
          data.alt = readableName;
        }
        return data;
      }
    ]
  },
  upload: {
    staticDir: path.resolve(__dirname, '../../media'),
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 400,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 768,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
}
