import { ProductList ,ProductListSkeleton } from "@/modules/products/ui/components/product-list";
import {  getQueryClient, trpc  } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface Props {
    params: {
        category: string;
        subcategory: string;
    };
}


const Page = async ({ params }: Props) => {
    const { category, subcategory } = params;

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.products.getMany.queryOptions(
        {
            category: subcategory, // Pass the subcategory as the category parameter
            page: 1,
            limit: 12,
        }
    )); 

    return ( 
       <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<ProductListSkeleton />}>
            <ProductList category={subcategory} />
        </Suspense>
       </HydrationBoundary>
    );
}

export default Page;