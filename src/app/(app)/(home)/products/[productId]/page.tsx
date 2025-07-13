import { ProductList, ProductListSkeleton } from "@/modules/products/ui/components/product-list";
import { ProductView } from "@/modules/products/ui/views/product-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface Props {
  params: {productId: string};
}


const Page = async ({ params }: Props) => {
    // Properly handle params as they are already available synchronously in Next.js 14+
    // Extract productId directly from the params object which is already resolved
    const { productId } = params;

    const queryClient = getQueryClient();
    await queryClient.prefetchQuery(
        trpc.products.getOne.queryOptions({
            id: productId
        })
    )

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<ProductListSkeleton />}>
                <ProductView productId={productId}  />
            </Suspense>
        </HydrationBoundary>
    );
 }

export default Page;