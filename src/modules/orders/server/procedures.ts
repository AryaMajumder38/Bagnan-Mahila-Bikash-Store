import { z } from 'zod';
import { createTRPCRouter, baseProcedure } from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import { headers } from 'next/headers';

// Define the order input schema
const orderInputSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
    price: z.number().positive(),
  })),
  subtotal: z.number().nonnegative(),
  tax: z.number().nonnegative(),
  shippingCost: z.number().nonnegative(),
  total: z.number().positive(),
  customerInfo: z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(10),
    company: z.string().optional(),
  }),
  shippingAddress: z.object({
    address: z.string().min(5),
    apartment: z.string().optional(),
    city: z.string().min(2),
    state: z.string().min(2),
    pinCode: z.string().min(6),
  }),
  billingAddress: z.object({
    sameAsShipping: z.boolean(),
    address: z.string().optional(),
    apartment: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pinCode: z.string().optional(),
  }).refine(
    data => {
      // If sameAsShipping is false, all billing address fields should be filled
      if (!data.sameAsShipping) {
        return !!data.address && !!data.city && !!data.state && !!data.pinCode;
      }
      return true;
    },
    {
      message: "Billing address fields are required when not same as shipping",
      path: ["sameAsShipping"],
    }
  ),
  paymentInfo: z.object({
    method: z.enum(["cod", "credit", "upi", "netbanking"]),
    transactionId: z.string().optional(),
  }),
  notes: z.string().optional(),
});

export const ordersRouter = createTRPCRouter({
  // Create a new order
  create: baseProcedure
    .input(orderInputSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Get the current user from the context
        const reqHeaders = headers();
        const authResult = await ctx.db.auth({ 
          headers: reqHeaders as any // Type cast to avoid Header compatibility issues
        });
        
        if (!authResult.user) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to create an order',
          });
        }
        
        const user = authResult.user;

        // Format order items for database
        const orderItems = [];
        for (const item of input.items) {
          // Verify the product exists and get its details
          const product = await ctx.db.findByID({
            collection: 'products',
            id: item.productId,
          });

          if (!product) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: `Product with ID ${item.productId} not found`,
            });
          }

          orderItems.push({
            product: {
              relationTo: 'products',
              value: item.productId,
            },
            quantity: item.quantity,
            price: item.price,
          });
        }

        // Prepare billing address data
        let billingAddressData = {};
        if (input.billingAddress.sameAsShipping) {
          billingAddressData = {
            sameAsShipping: true,
          };
        } else {
          billingAddressData = {
            sameAsShipping: false,
            address: input.billingAddress.address,
            apartment: input.billingAddress.apartment,
            city: input.billingAddress.city,
            state: input.billingAddress.state,
            pinCode: input.billingAddress.pinCode,
          };
        }

        // Create the order in the database
        try {
          const newOrder = await ctx.db.create({
            collection: 'orders',
            data: {
              user: {
                relationTo: 'users',
                value: user.id,
              },
              items: orderItems,
              subtotal: input.subtotal,
              tax: input.tax,
              shippingCost: input.shippingCost,
              total: input.total,
              customerInfo: {
                firstName: input.customerInfo.firstName,
                lastName: input.customerInfo.lastName,
                email: input.customerInfo.email,
                phone: input.customerInfo.phone,
                company: input.customerInfo.company,
              },
              shippingAddress: {
                address: input.shippingAddress.address,
                apartment: input.shippingAddress.apartment,
                city: input.shippingAddress.city,
                state: input.shippingAddress.state,
                pinCode: input.shippingAddress.pinCode,
              },
              billingAddress: billingAddressData,
              paymentInfo: {
                method: input.paymentInfo.method,
                transactionId: input.paymentInfo.transactionId,
                status: 'pending',
              },
              notes: input.notes,
              status: 'pending',
            },
          } as any); // Type cast to avoid collection type issues

          return {
            success: true,
            orderId: newOrder.id,
            orderNumber: newOrder.id, // Using ID as order number for now
          };
        } catch (createError) {
          console.error("Failed to create order:", createError);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to create order in database',
            cause: createError,
          });
        }
      } catch (err: unknown) {
        console.error('Error creating order:', err);
        if (err instanceof TRPCError) {
          throw err;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred while processing your order',
          cause: err,
        });
      }
    }),

  // Get orders for the current user
  getUserOrders: baseProcedure
    .query(async ({ ctx }) => {
      try {
        const reqHeaders = headers();
        const authResult = await ctx.db.auth({ 
          headers: reqHeaders as any // Type cast to avoid Header compatibility issues
        });
        
        if (!authResult.user) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to view your orders',
          });
        }
        
        const user = authResult.user;

        try {
          // First try to find orders where user is stored as a relationship object
          let orders = await ctx.db.find({
            collection: 'orders',
            where: {
              'user.value': {
                equals: user.id,
              },
            },
            sort: '-createdAt',
            depth: 1,
          } as any);
          
          // If no orders found, try the direct user ID approach
          if (orders.docs.length === 0) {
            orders = await ctx.db.find({
              collection: 'orders',
              where: {
                user: {
                  equals: user.id,
                },
              },
              sort: '-createdAt',
              depth: 1,
            } as any);
          }
          
          console.log(`Found ${orders.docs.length} orders for user ${user.id}`);
          
          // Ensure orders are properly formatted with necessary fields
          const formattedOrders = orders.docs.map(order => {
            // Handle order as a plain JavaScript object to avoid TypeScript errors
            const orderObj = order as any;
            
            // Log order structure for debugging
            console.log('Order structure:', JSON.stringify({
              id: orderObj.id,
              itemsCount: orderObj.items?.length || 0,
              userField: orderObj.user
            }));
            
            return orderObj;
          });
          
          console.log('Order IDs:', formattedOrders.map(order => order.id));
          return formattedOrders;
        } catch (findError) {
          console.error("Failed to fetch orders:", findError);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to retrieve orders from database',
            cause: findError,
          });
        }
      } catch (err: unknown) {
        console.error('Error fetching user orders:', err);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred while fetching your orders',
          cause: err,
        });
      }
    }),

  // Get a single order by ID
  getOne: baseProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const reqHeaders = headers();
        const authResult = await ctx.db.auth({ 
          headers: reqHeaders as any // Type cast to avoid Header compatibility issues
        });
        
        if (!authResult.user) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to view order details',
          });
        }
        
        const user = authResult.user;

        try {
          const order = await ctx.db.findByID({
            collection: 'orders',
            id: input.id,
            depth: 2, // Adjust the depth to populate related fields as needed
          } as any); // Type cast to avoid collection type issues

          if (!order) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: `Order with ID ${input.id} not found`,
            });
          }

          // Check if the order belongs to the current user
          // Using type assertion to access dynamic fields
          const orderData = order as any;
          
          // Skip permission check if we can't determine the user (will be addressed later)
          if (orderData.user) {
            const orderUserId = typeof orderData.user === 'object' ? 
              (orderData.user.value || orderData.user.id) : 
              (typeof orderData.user === 'string' ? orderData.user : null);
              
            if (orderUserId !== user.id) {
              throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'You do not have permission to view this order',
              });
            }
          }

          return order;
        } catch (findError) {
          if (findError instanceof TRPCError) {
            throw findError;
          }
          console.error("Failed to fetch order:", findError);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to retrieve order from database',
            cause: findError,
          });
        }
      } catch (err: unknown) {
        console.error('Error fetching order details:', err);
        if (err instanceof TRPCError) {
          throw err;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred while fetching order details',
          cause: err,
        });
      }
    }),
});
