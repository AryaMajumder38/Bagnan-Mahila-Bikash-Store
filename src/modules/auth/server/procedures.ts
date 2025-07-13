import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod"; // z needs to be destructured from 'zod'
import { headers as getHeaders, cookies as getCookies } from "next/headers";
import { TRPCError } from "@trpc/server";

import { register } from "module";
import { loginSchema, registerSchema } from "../schemas";
import { generateAuthCookies, clearAuthCookies } from "../utils";

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders(); // No await here

    const session = await ctx.db.auth({
      headers,
    });

    return session;
  }),


  


  register: baseProcedure
    .input(
      registerSchema // Assuming registerSchema is imported from schemas.ts
    )
    .mutation(async ({ ctx, input }) => {
      // Check for existing username
      const existingUsernameData = await ctx.db.find({
          collection: "users",
          limit: 1,
          where: {
           username: {
            equals: input.username,
          },
        }
      });

      if(existingUsernameData.docs[0]){
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: 'Username already exists',
        });
      }
      
      // Check for existing email
      const existingEmailData = await ctx.db.find({
          collection: "users",
          limit: 1,
          where: {
           email: {
            equals: input.email,
          },
        }
      });
      
      if(existingEmailData.docs[0]){
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: 'Email already in use',
        });
      }

      try {
        // Create a tenant first - using any to bypass TypeScript checks
        const tenant = await (ctx.db as any).create({
          collection: "tenants",
          data: {
            slug: input.username.toLowerCase().replace(/\s+/g, '-'),
            tenantname: input.username,
            email: `${input.username}-tenant@${input.email.split('@')[1]}`, // Create a unique tenant email based on username
            password: input.password, // Set password for tenant auth
          },
        });

        // Create user with proper tenant association
        await (ctx.db as any).create({
          collection: "users",
          data: {
            email: input.email,
            password: input.password,
            username: input.username,
            roles: ["user"],
            tenants: [{ tenant: tenant.id }],
          },
        });
      } catch (error) {
        console.error("Error during user/tenant creation:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create account",
          cause: error,
        });
      }
      const data = await ctx.db.login({
        collection: "users",
        data: {
        email: input.email,
        password: input.password,
        },

    });

    if (!data.token) {
        throw new TRPCError(
            {
                code: 'UNAUTHORIZED',
                message: 'Invalid email or password',
            }
        );
    }

    await generateAuthCookies(
      {
        prefix: ctx.db.config.cookiePrefix,
        value: data.token,
      }
    );

    }),

    login: baseProcedure
    .input(
      loginSchema
    )
    .mutation(async ({ ctx, input }) => {
        const data = await ctx.db.login({
            collection: "users",
            data: {
            email: input.email,
            password: input.password,
            },

        });

        if (!data.token) {
            throw new TRPCError(
                {
                    code: 'UNAUTHORIZED',
                    message: 'Invalid email or password',
                }
            );
        }
    
        await generateAuthCookies(
          {
            prefix: ctx.db.config.cookiePrefix,
            value: data.token,
          }
        );

        return data;
}),

logout: baseProcedure
  .mutation(async ({ ctx }) => {
    try {
      // Clear the auth cookies
      await clearAuthCookies(ctx.db.config.cookiePrefix || 'payload');
      
      return { success: true };
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to logout',
      });
    }
  }),

});

