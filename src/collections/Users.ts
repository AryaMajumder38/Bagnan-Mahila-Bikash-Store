import type { CollectionConfig } from 'payload'
import {tenantsArrayField} from '@payloadcms/plugin-multi-tenant/fields'


const defaultTenantField = tenantsArrayField({
  tenantsArrayFieldName: 'tenants',
  tenantsCollectionSlug: 'tenants',
  tenantsArrayTenantFieldName: 'tenant',
  arrayFieldAccess: {
    read : () => true,
    create : () => true,
    update : () => true,
  },
    tenantFieldAccess: {
    read : () => true,
    create : () => true,
    update : () => true,
  }
})

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
   {
    name : "username",
    required: true,
    unique:   true,
    type: 'text',
   },
   {
    name: "addresses",
    type: "array",
    admin: {
      description: "User saved addresses"
    },
    fields: [
      {
        name: "fullName",
        type: "text",
        required: true,
      },
      {
        name: "addressLine1",
        type: "text",
        required: true,
      },
      {
        name: "addressLine2",
        type: "text",
      },
      {
        name: "city",
        type: "text",
        required: true,
      },
      {
        name: "state",
        type: "text",
        required: true,
      },
      {
        name: "pinCode",
        type: "text",
        required: true,
      },
      {
        name: "phone",
        type: "text",
        required: true,
      },
      {
        name: "isDefault",
        type: "checkbox",
        defaultValue: false,
        admin: {
          description: "Make this the default address"
        }
      }
    ]
   },
   {
    admin: {
      position: 'sidebar',
    },
    name: "roles",
    type: "select",
    defaultValue: ["user"],
    hasMany: true,
    options: ["user",  "super-admin"],
   },
   {

    ...defaultTenantField,
    admin: {
      ...(defaultTenantField?.admin || {}),
      position: "sidebar",
    }
  }
  ],
}
