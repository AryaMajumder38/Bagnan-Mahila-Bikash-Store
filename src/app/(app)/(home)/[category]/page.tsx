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
    const { category } = await  params;

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.products.getMany.queryOptions(
        {
            category,// Pass the category from params, or null if not provided
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