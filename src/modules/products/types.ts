import { inferRouterOutputs } from "@trpc/server";
import { appRouter } from "@/trpc/routers/_app";

export type ProductsGetManyOutput = inferRouterOutputs<typeof appRouter>["products"]["getMany"];
