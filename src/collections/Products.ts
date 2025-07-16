import type { CollectionConfig } from "payload";
import preserveFieldsOnImageUpload from "../hooks/preserveFieldsOnImageUpload";

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
    // Improve the admin UI for file uploads
    components: {
      // If you have custom components, they would go here
    },
  },
  hooks: {
    // This helps preserve form data during file uploads
    beforeChange: [
      ({ data }) => {
        // Return data unmodified to ensure all fields are preserved
        return data;
      }
    ]
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      hooks: {
        beforeChange: [preserveFieldsOnImageUpload]
      },
    },
    {
      name: "description",
      type: "textarea",
      hooks: {
        beforeChange: [preserveFieldsOnImageUpload]
      }
    },
    {
        name: "hasVariants",
        type: "checkbox",
        label: "This product has variants",
        defaultValue: false,
        hooks: {
          beforeChange: [preserveFieldsOnImageUpload]
        }
    },
    {
        name: "price",
        type: "number",
        required: true,
        min: 0,
        admin: {
          condition: (data) => !data.hasVariants,
          description: "Base price for the product (only if no variants)"
        },
        hooks: {
          beforeChange: [preserveFieldsOnImageUpload]
        }
    },
    {
        name: "variants",
        type: "array",
        label: "Product Variants",
        admin: {
          condition: (data) => data.hasVariants === true,
          description: "Add different variants of this product (e.g. sizes, weights)"
        },
        fields: [
          {
            name: "name",
            type: "text",
            required: true,
            label: "Variant Name",
            admin: {
              description: "E.g. '500g', '1kg', 'Small', 'Medium', etc."
            }
          },
          {
            name: "price",
            type: "number",
            required: true,
            min: 0,
            label: "Variant Price"
          },
          {
            name: "sku",
            type: "text",
            label: "SKU (Stock Keeping Unit)",
            unique: false
          },
          {
            name: "stock",
            type: "number",
            defaultValue: 0,
            min: 0,
            label: "Stock Quantity"
          }
        ],
        hooks: {
          beforeChange: [preserveFieldsOnImageUpload]
        }
    },
    {
        name: "category",
        type: "relationship",
        relationTo: "categories",
        hasMany: false,
        required: true,
        hooks: {
          beforeChange: [preserveFieldsOnImageUpload]
        }
    },
        {
        name: "image",
        type: "upload",
        relationTo: "media",
        admin: {
          description: "Main product image"
        }
        },
        {
        name: "hoverImage",
        type: "upload",
        relationTo: "media",
        label: "Hover Image (shown on hover)",
        admin: {
          description: "This image will be shown when the user hovers over the product"
        }
        },
        {
        name: "additionalImages",
        type: "array",
        label: "Additional Images",
        admin: {
          description: "Add multiple product images (optional)"
        },
        fields: [
          {
            name: "image",
            type: "upload",
            relationTo: "media",
            required: true
          }
        ]
        },
        {
        name: "refundPolicy",
        type: "select",
        options: [
            "30 days",
            "14 days",
            "7 days",
            "No refund",
        ],
        defaultValue: "30 days",
        hooks: {
          beforeChange: [preserveFieldsOnImageUpload]
        }
        },
]
}