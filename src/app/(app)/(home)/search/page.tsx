"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';
import { Product } from '@/payload-types';
import ProductCard from '@/modules/products/ui/components/product-card';
import { Button } from '@/components/ui/button';
import { SearchResultCategory } from '@/modules/products/server/procedures';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const trpc = useTRPC();
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [matchedCategories, setMatchedCategories] = useState<SearchResultCategory[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 12;

  // Get all products with pagination
  const { data, isLoading, error } = useQuery({
    ...trpc.products.searchProducts.queryOptions({
      query: query,
      page,
      limit: LIMIT,
    }),
    enabled: query.length > 0,
  });

  useEffect(() => {
    // Reset when query changes
    setPage(1);
    setProducts([]);
    setHasMore(true);
  }, [query]);

  useEffect(() => {
    if (data && 'docs' in data) {
      if (page === 1) {
        setProducts(data.docs as Product[]);
      } else {
        setProducts(prev => [...prev, ...(data.docs as Product[])]);
      }
      setHasMore(data.hasNextPage || false);
      
      // Store matched categories if any
      // Use type assertion to access the matchedCategories property
      const typedData = data as any;
      if (typedData.matchedCategories && Array.isArray(typedData.matchedCategories)) {
        setMatchedCategories(typedData.matchedCategories);
      } else {
        setMatchedCategories([]);
      }
    }
  }, [data, page]);

  const loadMore = () => {
    if (hasMore) {
      setPage(prev => prev + 1);
    }
  };

  if (query.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Search Products</h1>
        <p>Enter a search term to find products.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">
        Search Results for "{query}"
      </h1>

      {isLoading && page === 1 ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : error ? (
        <div className="text-red-500">
          An error occurred while fetching results. Please try again.
        </div>
      ) : products.length === 0 ? (
        <div>
          <p>No products found matching "{query}". Try a different search term.</p>
        </div>
      ) : (
        <>
          {/* Display category matches if any */}
          {matchedCategories.length > 0 && (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <h2 className="text-lg font-medium mb-3">
                Categories matching "{query}":
              </h2>
              <div className="flex flex-wrap gap-2">
                {matchedCategories.map(category => (
                  <Button 
                    key={category.id}
                    variant="outline"
                    className="hover:bg-gray-100"
                    onClick={() => window.location.href = `/${category.slug}`}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Results include products from these categories
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-12">
              <Button 
                onClick={loadMore}
                variant="outline"
                className="px-8"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                Load More Products
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
