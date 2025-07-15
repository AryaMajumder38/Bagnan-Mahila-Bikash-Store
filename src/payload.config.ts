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
import Carts from './collections/Carts'
import { Config } from './payload-types'

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
  collections: [Users, Media, Categories, Products, Tenants, Carts],
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
    payloadCloudPlugin(),
    //...(process.env.NODE_ENV === 'production' ? [payloadCloudPlugin()] : []),
    multiTenantPlugin<Config>({
      collections :{
        products : {}
      },
      tenantsArrayField : {
        includeDefaultField: false,
      },
      userHasAccessToAllTenants : (user) => {
        // Check if user exists and has a roles property (i.e., it's a User and not a Tenant)
        if (user && 'roles' in user && Array.isArray(user.roles)) {
          return user.roles.includes('super-admin');
        }
        return false;
      }
    }),
    // storage-adapter-placeholder
  ],
})
