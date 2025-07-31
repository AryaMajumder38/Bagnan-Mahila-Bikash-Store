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

// Ensure public/media directory exists for serving files
const publicMediaDir = path.resolve(process.cwd(), 'public/media');
if (!fs.existsSync(publicMediaDir)) {
  fs.mkdirSync(publicMediaDir, { recursive: true });
  console.log(`Created public media directory at: ${publicMediaDir}`);
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
    afterChange: [
      ({ doc }) => {
        // Copy the uploaded file to public/media for direct access
        if (doc.filename) {
          const sourcePath = path.join(mediaDir, doc.filename);
          const targetPath = path.join(publicMediaDir, doc.filename);
          
          try {
            fs.copyFileSync(sourcePath, targetPath);
            console.log(`Copied ${doc.filename} to public/media`);
          } catch (error) {
            console.error(`Failed to copy ${doc.filename} to public/media:`, error);
          }
        }
        return doc;
      }
    ],
    afterRead: [
      ({ doc }) => {
        // Ensure the URL is properly formatted for the frontend
        if (doc.filename) {
          // Files are copied to public/media for direct access
          doc.url = `/media/${doc.filename}`;
        }
        return doc;
      }
    ]
  },
  upload: {
    // Files are stored in the media directory and copied to public/media for access
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
