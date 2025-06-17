import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod"; // z needs to be destructured from 'zod'
import { headers as getHeaders, cookies as getCookies } from "next/headers";
import { TRPCError } from "@trpc/server";
import { AUTH_COOKIE } from "../constants";
import { register } from "module";
import { loginSchema, registerSchema } from "../schemas";

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders(); // No await here

    const session = await ctx.db.auth({
      headers,
    });

    return session;
  }),


  logout: baseProcedure.mutation(async ({ ctx }) => {
    const cookies = await getCookies();
    cookies.delete(AUTH_COOKIE);
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

    const cookies = await getCookies();
    cookies.set({

        name:  AUTH_COOKIE,
        value: data.token,
        httpOnly: true,
        path: "/",
        // sameSite: "none",
        // domain:"",
        // TODO cross domain cookie sharing
    })

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
    
        const cookies = await getCookies();
        cookies.set({

            name:  AUTH_COOKIE,
            value: data.token,
            httpOnly: true,
            path: "/",
            // sameSite: "none",
            // domain:"",
            // TODO cross domain cookie sharing
        })

        return data;
}),

});

