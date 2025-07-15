import { ProductList, ProductListSkeleton } from "@/modules/products/ui/components/product-list";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

const ProductsPage = async () => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      category: undefined, // Explicitly set to undefined to show all products
      page: 1,
      limit: 12,
    })
  );

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<ProductListSkeleton />}>
          <ProductList category={undefined} /> {/* Explicitly pass undefined to ensure all products are shown */}
        </Suspense>
      </HydrationBoundary>
    </div>
  );
};

export default ProductsPage;
