import type { CollectionConfig, Access } from 'payload';

const Carts: CollectionConfig = {
  slug: 'carts',
  admin: {
    useAsTitle: 'userId',
  },
  access: {
    read: ({ req }) => {
      // Allow users to read only their own cart
      if (req.user) {
        return {
          userId: {
            equals: req.user.id,
          },
        };
      }
      return false;
    },
    update: ({ req }) => {
      // Allow users to update only their own cart
      if (req.user) {
        return {
          userId: {
            equals: req.user.id,
          },
        };
      }
      return false;
    },
    delete: ({ req }) => {
      // Allow users to delete only their own cart
      if (req.user) {
        return {
          userId: {
            equals: req.user.id,
          },
        };
      }
      return false;
    },
    create: () => true, // Allow any authenticated user to create a cart
  },
  fields: [
    {
      name: 'userId',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      defaultValue: [],
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
        }
      ]
    }
  ]
};

export default Carts;
