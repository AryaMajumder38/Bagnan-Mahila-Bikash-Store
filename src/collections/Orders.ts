import type { CollectionConfig } from "payload";
import { tenantsArrayField } from '@payloadcms/plugin-multi-tenant/fields'

// Define possible order status values
const orderStatuses = [
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const defaultTenantField = tenantsArrayField({
  tenantsArrayFieldName: 'tenants',
  tenantsCollectionSlug: 'tenants',
  tenantsArrayTenantFieldName: 'tenant',
  arrayFieldAccess: {
    read: () => true,
    create: () => true,
    update: () => true,
  },
  tenantFieldAccess: {
    read: () => true,
    create: () => true,
    update: () => true,
  }
})

export const Orders: CollectionConfig = {
  slug: "orders",
  admin: {
    useAsTitle: "orderNumber",
    defaultColumns: ["orderNumber", "user", "status", "total", "createdAt"],
    group: "E-Commerce",
  },
  access: {
    // Default access controls - administrators can do everything
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    defaultTenantField,
    {
      name: "orderNumber",
      type: "text",
      required: true,
      admin: {
        description: "Unique order identifier"
      },
    },
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      admin: {
        description: "User who placed the order"
      },
    },
    {
      name: "status",
      type: "select",
      options: orderStatuses,
      defaultValue: "pending",
      required: true,
      admin: {
        description: "Current status of the order"
      },
    },
    {
      name: "items",
      type: "array",
      required: true,
      admin: {
        description: "Products in this order"
      },
      fields: [
        {
          name: "product",
          type: "relationship",
          relationTo: "products",
          required: true,
        },
        {
          name: "quantity",
          type: "number",
          required: true,
          min: 1,
          admin: {
            description: "Number of units ordered"
          },
        },
        {
          name: "variantName",
          type: "text",
          admin: {
            description: "Name of the product variant (if applicable)"
          },
        },
        {
          name: "price",
          type: "number",
          required: true,
          admin: {
            description: "Price at time of purchase (in rupees)"
          },
        },
      ],
    },
    {
      name: "subtotal",
      type: "number",
      required: true,
      admin: {
        description: "Order subtotal before tax and shipping"
      },
    },
    {
      name: "tax",
      type: "number",
      required: true,
      admin: {
        description: "Tax amount for this order"
      },
    },
    {
      name: "shippingCost",
      type: "number",
      required: true,
      admin: {
        description: "Shipping cost for this order"
      },
    },
    {
      name: "total",
      type: "number",
      required: true,
      admin: {
        description: "Total order amount including tax and shipping"
      },
    },
    {
      name: "customerInfo",
      type: "group",
      admin: {
        description: "Customer contact information"
      },
      fields: [
        {
          name: "firstName",
          type: "text",
          required: true,
        },
        {
          name: "lastName",
          type: "text",
          required: true,
        },
        {
          name: "email",
          type: "email",
          required: true,
        },
        {
          name: "phone",
          type: "text",
          required: true,
        },
        {
          name: "company",
          type: "text",
        },
      ],
    },
    {
      name: "shippingAddress",
      type: "group",
      required: true,
      admin: {
        description: "Address to ship the order to"
      },
      fields: [
        {
          name: "address",
          type: "text",
          required: true,
        },
        {
          name: "apartment",
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
      ],
    },
    {
      name: "billingAddress",
      type: "group",
      required: true,
      admin: {
        description: "Address for billing purposes"
      },
      fields: [
        {
          name: "sameAsShipping",
          type: "checkbox",
          defaultValue: true,
        },
        {
          name: "address",
          type: "text",
          admin: {
            condition: (data, siblingData) => !siblingData.sameAsShipping,
          },
        },
        {
          name: "apartment",
          type: "text",
          admin: {
            condition: (data, siblingData) => !siblingData.sameAsShipping,
          },
        },
        {
          name: "city",
          type: "text",
          admin: {
            condition: (data, siblingData) => !siblingData.sameAsShipping,
          },
        },
        {
          name: "state",
          type: "text",
          admin: {
            condition: (data, siblingData) => !siblingData.sameAsShipping,
          },
        },
        {
          name: "pinCode",
          type: "text",
          admin: {
            condition: (data, siblingData) => !siblingData.sameAsShipping,
          },
        },
      ],
    },
    {
      name: "paymentInfo",
      type: "group",
      admin: {
        description: "Payment information"
      },
      fields: [
        {
          name: "method",
          type: "select",
          options: [
            { label: "Cash on Delivery", value: "cod" },
            { label: "Credit Card", value: "credit" },
            { label: "UPI", value: "upi" },
            { label: "Net Banking", value: "netbanking" },
          ],
          required: true,
          defaultValue: "cod",
        },
        {
          name: "transactionId",
          type: "text",
          admin: {
            description: "Transaction ID for online payments",
            condition: (data, siblingData) => siblingData?.method !== "cod",
          },
        },
        {
          name: "status",
          type: "select",
          options: [
            { label: "Pending", value: "pending" },
            { label: "Completed", value: "completed" },
            { label: "Failed", value: "failed" },
            { label: "Refunded", value: "refunded" },
          ],
          required: true,
          defaultValue: "pending",
        },
      ],
    },
    {
      name: "notes",
      type: "textarea",
      admin: {
        description: "Order notes or special instructions"
      },
    },
  ],
  timestamps: true,
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        // Generate a unique order number if not provided
        if (!data.orderNumber) {
          const timestamp = new Date().getTime();
          const randomDigits = Math.floor(1000 + Math.random() * 9000);
          data.orderNumber = `ORD-${timestamp}-${randomDigits}`;
        }
        
        return data;
      }
    ],
  },
};
