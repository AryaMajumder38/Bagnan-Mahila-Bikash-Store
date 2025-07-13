import { CustomCategory } from "@/app/(app)/(home)/types";
import { Category } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { sub } from "date-fns";
import { Where } from "payload";
import { z } from "zod";

export const productsRouter = createTRPCRouter({ 
  getMany: baseProcedure
    .input(z.object({
      category: z.string().nullable().optional(),
      page: z.number().default(1),
      limit: z.number().default(12),
    }))
    .query(async ({ ctx, input }) => {

       const where : Where = {}
       //If category is provided, find category and filter products
      if (input.category) {
        const categoryData = await ctx.db.find({
          collection: 'categories',
          limit: 1,
          depth: 1, // Adjust depth as needed
          pagination: false,
          where: {
            slug: { equals: input.category },
          },
        });

        const formattedData: CustomCategory[] = categoryData.docs.map((doc: any) => ({
          ...doc,
          subcategories: (doc.subcategories?.docs ?? []).map((doc : unknown) => ({
            ...(doc as Category),
            subcategories:undefined, // Exclude subcategories from subcategories
          }))
        })); 

        const subcategoriesSlugs = [];
        const parentCategory = formattedData[0];

        if (parentCategory){
          subcategoriesSlugs.push(
            ...(parentCategory.subcategories?.map((subcategory) => subcategory.slug) ?? [])
          );
        }

        where["category.slug"] = { in: [parentCategory.slug, ...subcategoriesSlugs] }; // adjust field name if needed

      }

        const data = await ctx.db.find({
          collection: 'products',
          depth: 2, // Increase depth to properly resolve nested relations like media
          where,
          page: input.page,
          limit: input.limit,
          pagination: true,
        });


      return data;
    }),
});
