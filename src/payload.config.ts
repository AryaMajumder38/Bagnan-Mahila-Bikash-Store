// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/categories'
import { Products } from './collections/Products'
import { Tenants } from './collections/Tenants'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
      importMapFile: path.resolve(dirname, './app/(payload)/admin/importMap.js'),
    },
  },
  collections: [Users, Media, Categories, Products, Tenants],
  cookiePrefix: "funroad",
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    // For production, use payloadCloudPlugin
    ...(process.env.NODE_ENV === 'production' ? [payloadCloudPlugin()] : []),
    multiTenantPlugin({
      collections :{
        products : {}
      },
      tenantsArrayField : {
        includeDefaultField: false,
      },
      userHasAccessToAllTenants : (user) => Boolean(user?.roles?.includes("super-admin")) 
    }),
    // storage-adapter-placeholder
  ],
})
