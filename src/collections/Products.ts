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
        name: "price",
        type: "number",
        required: true,
        min: 0,
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