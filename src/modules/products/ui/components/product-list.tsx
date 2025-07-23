"use client"

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import ProductCard from "./product-card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Props{
    category?: string
}

export const ProductList = ({ category }: Props) => {
  const trpc = useTRPC();
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const PRODUCTS_PER_PAGE = 12;
  
  // State for sorting option
  const [sortOption, setSortOption] = useState<string>("default");
  
  // Handle invalid category values
  const invalidCategoryPaths = ['favicon.ico'];
  const safeCategory = category && !invalidCategoryPaths.includes(category) ? category : null;
  
  // Query for data loading
  const { data } = useSuspenseQuery(
    trpc.products.getMany.queryOptions({
      category: safeCategory,
      page,
      limit: PRODUCTS_PER_PAGE
    })
  );
  
  // Effect to update allProducts when data changes
  useEffect(() => {
    if (data?.docs) {
      if (page === 1) {
        setAllProducts([...data.docs]);
      } else {
        setAllProducts(prev => [...prev, ...data.docs]);
      }
      setHasMore(data.hasNextPage);
    }
  }, [data, page]);
  
  // Handle loading more products
  const loadMoreProducts = async () => {
    if (hasMore && !isLoadingMore) {
      setIsLoadingMore(true);
      setPage(prevPage => prevPage + 1);
      setIsLoadingMore(false);
    }
  };
  
  // Effect to reset page when sorting option changes
  useEffect(() => {
    setPage(1);
    setAllProducts([]);
  }, [sortOption]);
  
  // Helper function to get the effective price of a product
  const getEffectivePrice = (product: any) => {
    if (product.hasVariants && product.variants && product.variants.length > 0) {
      return Math.min(...product.variants.map((variant: any) => variant.price || 0));
    }
    return product.price || 0;
  };

  // Apply sorting to products
  const sortedProducts = useMemo(() => {
    const products = allProducts.length > 0 
      ? [...allProducts] 
      : (data?.docs ? [...data.docs] : []);
    
    switch (sortOption) {
      case "price-low-high":
        return products.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
      case "price-high-low":
        return products.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
      case "date-old-new":
        return products.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "date-new-old":
        return products.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      default:
        return products;
    }
  }, [allProducts, data?.docs, sortOption]);

  // Check if we have products to display
  if (!data?.docs || data.docs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] text-center p-8">
        <h3 className="text-2xl font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground">No products available in this category.</p>
      </div>
    );
  }

  // ## MODIFIED LAYOUT STARTS HERE ##
  return (
    <div className="container mx-auto pt-12 pb-12 px-24 sm:px-36 lg:px-48">
      {/* Page Title */}
      <h1 className="text-5xl font-serif lowercase mb-8">
        {category || 'heirloom rice'}
      </h1>

      {/* Simple Sort Bar */}
      <div className="flex justify-between items-center mb-10 border-b border-t py-4">
        <div className="flex items-center gap-x-6 text-sm">
           {/* Sort Dropdown */}
           <span className="text-gray-600">Sort by:</span>
           <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-auto border focus:ring-0 text-gray-600 h-8">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="price-low-high">Price: Low to High</SelectItem>
              <SelectItem value="price-high-low">Price: High to Low</SelectItem>
              <SelectItem value="date-new-old">Newest First</SelectItem>
              <SelectItem value="date-old-new">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Product Count */}
        <div className="text-sm text-gray-700">
          {data.totalDocs || sortedProducts.length} products
        </div>
      </div>
      
      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 mb-12">
        {sortedProducts.length > 0 ? (
          sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p>Loading products...</p>
          </div>
        )}
      </div>
      
      {/* Load more button */}
      {hasMore && (
        <div className="w-full flex justify-center mt-8 mb-4">
          <Button 
            variant="outline" 
            size="lg" 
            disabled={isLoadingMore}
            onClick={() => loadMoreProducts()}
            className="mx-auto"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </div>
  );
  // ## MODIFIED LAYOUT ENDS HERE ##
}


export const ProductListSkeleton = () => {
  // ## MODIFIED SKELETON LAYOUT STARTS HERE ##
  return (
    <div className="container mx-auto pt-12 pb-12 px-24 sm:px-36 lg:px-48">
      {/* Title Skeleton */}
      <div className="h-12 w-1/3 bg-muted animate-pulse rounded-md mb-8" />

      {/* Simple Sort Bar Skeleton */}
      <div className="flex justify-between items-center mb-10 border-b border-t py-4">
        <div className="flex items-center gap-6">
          <div className="h-5 w-16 bg-muted animate-pulse rounded-md" />
          <div className="h-8 w-32 bg-muted animate-pulse rounded-md" />
        </div>
        <div className="h-5 w-24 bg-muted animate-pulse rounded-md" />
      </div>
      
      {/* Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 mb-12">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="overflow-hidden h-full p-0 border-none shadow-none">
            <div className="aspect-square bg-muted animate-pulse" />
            <CardHeader className="p-2 text-center">
              <div className="h-5 w-3/4 bg-muted animate-pulse rounded-md mx-auto" />
            </CardHeader>
            <CardContent className="p-2 pt-0 text-center">
              <div className="h-4 w-1/3 bg-muted animate-pulse rounded-md mx-auto" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
  // ## MODIFIED SKELETON LAYOUT ENDS HERE ##
}