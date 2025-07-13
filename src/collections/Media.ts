import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

// ES module equivalent for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure media directory exists
const mediaDir = path.resolve(process.cwd(), 'media');
if (!fs.existsSync(mediaDir)) {
  fs.mkdirSync(mediaDir, { recursive: true });
  console.log(`Created media directory at: ${mediaDir}`);
}

// Log the media configuration to help with debugging
console.log(`Media directory configuration:
  - Directory path: ${mediaDir}
  - URL format expected: /media/filename.jpg
  - PayloadCMS path: /api/media/file/filename.jpg
`);

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
    ],
    afterRead: [
      ({ doc }) => {
        // Ensure the URL is properly formatted for the frontend
        if (doc.filename) {
          // Since we have a symlink from public/media to the media folder,
          // we can serve files directly from /media path
          doc.url = `/media/${doc.filename}`;
        }
        return doc;
      }
    ]
  },
  upload: {
    // We're using a symlink from public/media to media folder so images are accessible
    staticDir: path.resolve(process.cwd(), 'media'),
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
