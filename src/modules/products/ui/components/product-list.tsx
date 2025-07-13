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
  
  // Sort options
  const sortOptions = [
    { value: "default", label: "Default" },
    { value: "price-low-high", label: "Price: Low to High" },
    { value: "price-high-low", label: "Price: High to Low" },
    { value: "date-old-new", label: "Date: Old to New" },
    { value: "date-new-old", label: "Date: New to Old" },
  ];
  
  // Query for data loading
  const { data } = useSuspenseQuery(
    trpc.products.getMany.queryOptions({
      category,
      page,
      limit: PRODUCTS_PER_PAGE
    })
  );
  
  // Debug output
  console.log("Raw data:", data);
  console.log("Has docs:", !!data?.docs);
  console.log("Docs length:", data?.docs?.length);
  console.log("All products:", allProducts);
  
  // Effect to update allProducts when data changes
  useEffect(() => {
    if (data?.docs) {
      if (page === 1) {
        // Reset products if we're on the first page or changing sort
        setAllProducts([...data.docs]);
      } else {
        // Append products for subsequent pages
        setAllProducts(prev => [...prev, ...data.docs]);
      }
      
      // Check if we've reached the end
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
  
  // Apply sorting to products
  const sortedProducts = useMemo(() => {
    // Use data.docs directly if allProducts is empty (for the first render)
    const products = allProducts.length > 0 
      ? [...allProducts] 
      : (data?.docs ? [...data.docs] : []);
    
    // Debug to check what we're sorting
    console.log("Products to sort:", products.length);
    
    switch (sortOption) {
      case "price-low-high":
        return products.sort((a, b) => a.price - b.price);
      case "price-high-low":
        return products.sort((a, b) => b.price - a.price);
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

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {category ? `Products in ${category}` : "All Products"}
          <span className="ml-2 text-sm text-muted-foreground font-normal">
            ({data.totalDocs || sortedProducts.length} items)
          </span>
        </h2>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
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
        <div 
          className="w-full flex justify-center my-8"
        >
          <Button 
            variant="outline" 
            size="sm" 
            disabled={isLoadingMore}
            onClick={() => loadMoreProducts()}
            className="mx-auto"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading more products...
              </>
            ) : (
              "Load more products"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

// ProductCard component has been moved to a separate file: ./product-card.tsx

export const ProductListSkeleton = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="h-6 w-48 bg-muted animate-pulse rounded-md" />
        <div className="flex items-center gap-2">
          <div className="h-4 w-16 bg-muted animate-pulse rounded-md" />
          <div className="h-10 w-[180px] bg-muted animate-pulse rounded-md" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
          <Card key={item} className="overflow-hidden h-full p-0">
            <div className="aspect-square bg-muted animate-pulse" />
            <CardHeader className="p-3 pb-1">
              <div className="h-4 w-3/4 bg-muted animate-pulse rounded-md" />
            </CardHeader>
            <CardContent className="p-3 pt-0 pb-0">
              <div className="h-3 bg-muted animate-pulse rounded-md mb-1" />
              <div className="h-3 bg-muted animate-pulse rounded-md mb-1 w-5/6" />
            </CardContent>
            <CardFooter className="p-3 pt-1 flex justify-between">
              <div className="h-4 w-12 bg-muted animate-pulse rounded-md" />
              <div className="h-4 w-14 bg-muted animate-pulse rounded-md" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}