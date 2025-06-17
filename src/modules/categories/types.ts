import { inferRouterOutputs } from "@trpc/server";
import { appRouter } from "@/trpc/routers/_app";

export type CategoriesGetManyOutput = inferRouterOutputs<typeof appRouter>["categories"]["getMany"];
export type CategoriesGetManyOutputSingle = CategoriesGetManyOutput[0];