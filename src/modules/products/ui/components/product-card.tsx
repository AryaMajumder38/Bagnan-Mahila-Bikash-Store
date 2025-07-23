"use client"

import { Product } from "@/payload-types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Fallback image path
const FALLBACK_IMAGE = "/image-placeholder.svg";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  // Determine the main image URL - use directly as provided by Payload CMS
  const imageUrl = (() => {
    // If it's an object with url property (from Payload)
    if (typeof product.image === 'object' && product.image) {
      return (product.image as any).url;
    } 
    // If it's a string URL
    else if (typeof product.image === 'string') {
      return product.image;
    }
    return null;
  })();
    
  // Determine the hover image URL - use directly as provided by Payload CMS
  const hoverImageUrl = (() => {
    // If it's an object with url property (from Payload)
    if (typeof product.hoverImage === 'object' && product.hoverImage) {
      return (product.hoverImage as any).url;
    } 
    // If it's a string URL
    else if (typeof product.hoverImage === 'string') {
      return product.hoverImage;
    }
    return null;
  })();

  // Determine category name
  const categoryName = typeof product.category === 'object' && product.category
    ? (product.category as any).name
    : 'Uncategorized';
    
  // Check if product has variants
  const hasVariants = product.hasVariants || false;
  const variants = product.variants || [];
  
  // Get the minimum price from variants or use the base price
  const minPrice = hasVariants && variants.length > 0
    ? Math.min(...variants.map((variant: any) => variant.price))
    : product.price;
    
  // Debug logs
  console.log('Product data:', {
    id: product.id,
    name: product.name,
    hasVariants,
    variants: variants.length,
    price: product.price,
    minPrice,
    imageRaw: product.image,
    imageUrl,
    hoverImageRaw: product.hoverImage,
    hoverImageUrl
  });
  
  // State to track whether the card is being hovered and image error states
  const [isHovered, setIsHovered] = useState(false);
  const [mainImageError, setMainImageError] = useState(false);
  const [hoverImageError, setHoverImageError] = useState(false);

  return (
    <Link href={`/products/${product.id}`} className="block h-full group">
      <Card 
        className="overflow-hidden flex flex-col h-full transition-all duration-500 hover:shadow-lg hover:border-primary/50 p-0 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
      <div className="aspect-square relative bg-muted overflow-hidden group w-full">
        {/* Show either main image or hover image based on hover state */}
        {(imageUrl || hoverImageUrl) ? (
          <>
            {/* Main image - always render but control opacity */}
            {imageUrl && !mainImageError && (
              <Image 
                src={imageUrl} 
                alt={product.name || "Product image"}
                fill 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className={`
                  object-cover 
                  transition-all 
                  duration-200
                  ease-in-out
                  ${isHovered && hoverImageUrl && !hoverImageError ? 'opacity-0' : 'opacity-100'}
                  ${isHovered ? 'scale-103' : 'scale-100'}
                `}
                onError={(e) => {
                  console.error(`Failed to load main image: ${imageUrl}`);
                  
                  // Use fallback image directly
                  setMainImageError(true);
                  (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                }}
              />
            )}
            
            {/* Hover image - always render if exists but control opacity */}
            {hoverImageUrl && !hoverImageError && (
              <Image 
                src={hoverImageUrl} 
                alt={`${product.name || "Product"} - hover view`}
                fill 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className={`
                  object-cover 
                  transition-all 
                  duration-200
                  ease-in-out
                  ${isHovered ? 'scale-106 opacity-100' : 'scale-100 opacity-0'}
                `}
                onError={(e) => {
                  console.error(`Failed to load hover image: ${hoverImageUrl}`);
                  
                  // Use fallback image directly
                  setHoverImageError(true);
                  (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                }}
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary/20">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col items-center justify-center text-center">
        <h3 className="font-medium text-sm mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="font-semibold text-sm">
          {hasVariants ? (
            <>₹{minPrice?.toFixed(2)}</>
          ) : (
            <>₹{product.price?.toFixed(2) || '0.00'}</>
          )}
        </p>
      </div>
    </Card>
    </Link>
  );
};

export default ProductCard;
