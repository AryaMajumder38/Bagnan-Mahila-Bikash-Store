
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Category } from '@/payload-types';
import { CustomCategory } from "@/app/(app)/(home)/types";

export const categoriesRouter = createTRPCRouter({ 
    getMany: baseProcedure.query(async ({ ctx }) => {
      // const payload = await getPayload({
      //   config: configPromise,
      // })

      const data = await ctx.db.find({
        collection: 'categories',
        depth: 1, // Adjust depth as needed
        pagination: false,
        where:{
          parent: {
            exists: false,
          },
        },
        sort: 'name', // Sort by name or any other field as needed
      })

      const formattedData: CustomCategory[] = data.docs.map((doc: any) => ({
        ...doc,
        subcategories: (doc.subcategories?.docs ?? []).map((doc : unknown) => ({
          ...(doc as Category),
          subcategories:undefined, // Exclude subcategories from subcategories
        }))
    }));
      return formattedData;
        
    })
});