import { ProductList ,ProductListSkeleton } from "@/modules/products/ui/components/product-list";
import {  getQueryClient, trpc  } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface Props {
    params: {
        category: string;
    };
}


const Page = async ({ params  }: Props) => {
    const { category } = await params;
    
    // Skip certain paths that shouldn't be treated as categories
    const invalidCategoryPaths = ['favicon.ico'];
    const isValidCategory = !invalidCategoryPaths.includes(category);
    
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.products.getMany.queryOptions(
        {
            category: isValidCategory ? category : null, // Only use category if it's valid
            page: 1,
            limit: 12,
        }
    )); 

    return (
       <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<ProductListSkeleton />}>
            <ProductList category={category} />
        </Suspense>
       </HydrationBoundary>
    );
}

export default Page;