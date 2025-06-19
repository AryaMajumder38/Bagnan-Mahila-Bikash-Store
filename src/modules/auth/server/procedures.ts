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
      const exixtingData = await ctx.db.find({
          collection: "users",
          limit: 1,
          where: {
           username: {
            equals: input.username,
          },
        }
      })

      const exixtingUser = exixtingData.docs[0];
      
      if(exixtingUser){
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: 'Username already exists',
        });
      }

      await ctx.db.create({
        collection: "users",
        data: {
          email: input.email,
          password: input.password,
          username: input.username,
        },
      });
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

