import { CustomCategory } from "@/app/(app)/(home)/types";
import { Category, Media, Product } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { sub } from "date-fns";
import { id } from "date-fns/locale";
import { Where } from "payload";
import { z } from "zod";

export interface SearchResultCategory {
  id: string;
  name: string;
  slug: string;
}

export interface SearchResults {
  docs: Product[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalDocs: number;
  totalPages: number;
  page: number;
  matchedCategories?: SearchResultCategory[];
}

export const productsRouter = createTRPCRouter({ 
  getOne: baseProcedure
    .input(
      z.object(
        {id: z.string()}
      )
    )
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.findByID({
        collection: 'products',
        id: input.id,
        depth : 2,
      });
      return {
        ...product,
        image: product.image as Media || null, // Ensure image URL is properly formatted
      };
    }),
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
    searchProducts: baseProcedure
    .input(z.object({
      query: z.string(),
      page: z.number().default(1),
      limit: z.number().default(12),
    }))
    .query(async ({ ctx, input }) => {
      const searchQuery = input.query.trim();
      
      if (!searchQuery) {
        return { 
          docs: [],
          hasNextPage: false,
          hasPrevPage: false,
          totalDocs: 0,
          totalPages: 0,
          page: 1
        };
      }
      
      // First check if the search query matches any category names
      const categoryMatches = await ctx.db.find({
        collection: 'categories',
        where: {
          or: [
            { name: { like: searchQuery } },
            { slug: { like: searchQuery } }
          ]
        },
        depth: 1,
        limit: 5, // Limit to avoid too many results
      });
      
      // Build a list of category slugs that match the search query
      const matchingCategorySlugs: string[] = [];
      const matchingSubcategorySlugs: string[] = [];
      
      // Process found categories
      if (categoryMatches.docs.length > 0) {
        categoryMatches.docs.forEach((category: any) => {
          if (category.slug) {
            matchingCategorySlugs.push(category.slug);
          }
          
          // Check for subcategories
          if (category.subcategories?.docs && Array.isArray(category.subcategories.docs)) {
            category.subcategories.docs.forEach((subcategory: any) => {
              if (subcategory.slug) {
                matchingSubcategorySlugs.push(subcategory.slug);
              }
            });
          }
        });
      }
      
      const searchResults = await ctx.db.find({
        collection: 'products',
        depth: 2,
        page: input.page,
        limit: input.limit,
        pagination: true,
        where: {
          or: [
            // Standard search by name and description
            { name: { like: searchQuery } },
            { description: { like: searchQuery } },
            
            // If we found matching categories, include products in those categories
            ...(matchingCategorySlugs.length > 0 ? [
              { 'category.slug': { in: matchingCategorySlugs } }
            ] : []),
            
            // If we found matching subcategories, include products in those subcategories
            ...(matchingSubcategorySlugs.length > 0 ? [
              { 'category.slug': { in: matchingSubcategorySlugs } }
            ] : [])
          ],
        },
      });

      // Include information about any category matches to display in UI
      const enhancedResults = {
        ...searchResults,
        // Add metadata about category matches
        matchedCategories: matchingCategorySlugs.length > 0 ? categoryMatches.docs : []
      };

      return enhancedResults;
    }),
});
