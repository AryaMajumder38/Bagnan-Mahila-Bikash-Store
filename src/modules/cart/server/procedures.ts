import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { headers as getHeaders } from "next/headers";

export const cartRouter = createTRPCRouter({
  getCart: baseProcedure.query(async ({ ctx }) => {
    // Get current user's session
    const headers = await getHeaders();
    const session = await ctx.db.auth({ 
      headers
    });
    
    // Check if user is authenticated
    if (!session?.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to view your cart",
      });
    }

    // Find the user's cart
    const cart = await ctx.db.find({
      collection: "carts",
      where: {
        userId: {
          equals: session.user.id,
        },
      },
      limit: 1,
      depth: 2, // To fetch product details
    });

    // If no cart exists, return empty items array
    if (cart.docs.length === 0) {
      return { items: [] };
    }

    return cart.docs[0];
  }),

  addToCart: baseProcedure
    .input(
      z.object({
        productId: z.string(),
        quantity: z.number().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get current user's session
      const headers = await getHeaders();
      const session = await ctx.db.auth({ 
        headers
      });
      
      // Check if user is authenticated
      if (!session?.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to add items to your cart",
        });
      }

      // Find the product
      const product = await ctx.db.findByID({
        collection: "products",
        id: input.productId,
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      // Find the user's cart
      const existingCart = await ctx.db.find({
        collection: "carts",
        where: {
          userId: {
            equals: session.user.id,
          },
        },
        limit: 1,
      });

      // If the user doesn't have a cart yet, create one
      if (existingCart.docs.length === 0) {
        const newCart = await ctx.db.create({
          collection: "carts",
          data: {
            userId: session.user.id,
            items: [
              {
                product: input.productId,
                quantity: input.quantity,
              },
            ],
          },
        });
        return newCart;
      }

      // User has a cart, check if the product is already in it
      const cart = existingCart.docs[0];
      const items = cart.items || [];
      const existingItemIndex = items.findIndex(
        (item: any) => item.product === input.productId
      );

      // Update the cart
      if (existingItemIndex >= 0) {
        // Product already in cart, update quantity
        items[existingItemIndex].quantity += input.quantity;
      } else {
        // Add new product to cart
        items.push({
          product: input.productId,
          quantity: input.quantity,
        });
      }

      // Save the updated cart
      const updatedCart = await ctx.db.update({
        collection: "carts",
        id: cart.id,
        data: {
          items,
        },
      });

      return updatedCart;
    }),

  updateCartItem: baseProcedure
    .input(
      z.object({
        productId: z.string(),
        quantity: z.number().min(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get current user's session
      const headers = await getHeaders();
      const session = await ctx.db.auth({ 
        headers
      });
      
      // Check if user is authenticated
      if (!session?.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to update your cart",
        });
      }

      // Find the user's cart
      const existingCart = await ctx.db.find({
        collection: "carts",
        where: {
          userId: {
            equals: session.user.id,
          },
        },
        limit: 1,
      });

      if (existingCart.docs.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cart not found",
        });
      }

      const cart = existingCart.docs[0];
      let items = cart.items || [];

      if (input.quantity === 0) {
        // Remove the item from the cart
        items = items.filter(
          (item: any) => item.product !== input.productId
        );
      } else {
        // Update the quantity
        const existingItemIndex = items.findIndex(
          (item: any) => item.product === input.productId
        );

        if (existingItemIndex >= 0) {
          items[existingItemIndex].quantity = input.quantity;
        } else {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Item not found in cart",
          });
        }
      }

      // Save the updated cart
      const updatedCart = await ctx.db.update({
        collection: "carts",
        id: cart.id,
        data: {
          items,
        },
      });

      return updatedCart;
    }),

  removeFromCart: baseProcedure
    .input(
      z.object({
        productId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get current user's session
      const headers = await getHeaders();
      const session = await ctx.db.auth({ 
        headers
      });
      
      // Check if user is authenticated
      if (!session?.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to remove items from your cart",
        });
      }

      // Find the user's cart
      const existingCart = await ctx.db.find({
        collection: "carts",
        where: {
          userId: {
            equals: session.user.id,
          },
        },
        limit: 1,
      });

      if (existingCart.docs.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cart not found",
        });
      }

      const cart = existingCart.docs[0];
      const items = (cart.items || []).filter(
        (item: any) => item.product !== input.productId
      );

      // Save the updated cart
      const updatedCart = await ctx.db.update({
        collection: "carts",
        id: cart.id,
        data: {
          items,
        },
      });

      return updatedCart;
    }),

  clearCart: baseProcedure.mutation(async ({ ctx }) => {
    // Get current user's session
    const headers = await getHeaders();
    const session = await ctx.db.auth({ 
      headers
    });
    
    // Check if user is authenticated
    if (!session?.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to clear your cart",
      });
    }

    // Find the user's cart
    const existingCart = await ctx.db.find({
      collection: "carts",
      where: {
        userId: {
          equals: session.user.id,
        },
      },
      limit: 1,
    });

    if (existingCart.docs.length === 0) {
      return { success: true }; // No cart to clear
    }

    // Clear the cart
    await ctx.db.update({
      collection: "carts",
      id: existingCart.docs[0].id,
      data: {
        items: [],
      },
    });

    return { success: true };
  }),
});
