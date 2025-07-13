import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
   {
    name : "tenantname",
    required: true,
    type: 'text',
    label: 'store name',
    admin: {
      description: 'This is the name of your store, it will be used in the store'
   },
  },
   {
    name:"slug",
    type : "text",
    index: true,
    unique: true,
    required: true,
    admin: {
      description: 'This is the unique identifier for your store, it will be used in the URL'
   }
  },
  {
    name: "image",
    type: "upload",
    relationTo: "media",
    admin: {
      readOnly: true,
    }
  },
  {
    name: "razorpay",
    type: "checkbox",
    admin: {
      readOnly: true,
      description: 'please provide your Razorpay API key'
      }
  }
  ],
}
