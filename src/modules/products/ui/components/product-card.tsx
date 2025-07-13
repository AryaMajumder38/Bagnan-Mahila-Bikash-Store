"use client"

import { Product } from "@/payload-types";
import Image from "next/image";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  // Determine the main image URL
  const imageUrl = (() => {
    if (typeof product.image === 'object' && product.image) {
      return (product.image as any).url;
    } else if (typeof product.image === 'string') {
      return product.image;
    }
    return null;
  })();
    
  // Determine the hover image URL
  const hoverImageUrl = (() => {
    if (typeof product.hoverImage === 'object' && product.hoverImage) {
      return (product.hoverImage as any).url;
    } else if (typeof product.hoverImage === 'string') {
      return product.hoverImage;
    }
    return null;
  })();

  // Determine category name
  const categoryName = typeof product.category === 'object' && product.category
    ? (product.category as any).name
    : 'Uncategorized';
    
  // Debug logs
  console.log('Product data:', {
    id: product.id,
    name: product.name,
    imageRaw: product.image,
    imageUrl,
    hoverImageRaw: product.hoverImage,
    hoverImageUrl
  });
  
  // State to track whether the card is being hovered
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className="overflow-hidden flex flex-col h-full transition-all duration-500 hover:shadow-lg p-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-square relative bg-muted overflow-hidden group w-full">
        {/* Show either main image or hover image based on hover state */}
        {(imageUrl || hoverImageUrl) ? (
          <>
            {/* Main image - always render but control opacity */}
            {imageUrl && (
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
                  ${isHovered && hoverImageUrl ? 'opacity-0' : 'opacity-100'}
                  ${isHovered ? 'scale-103' : 'scale-100'}
                `}
              />
            )}
            
            {/* Hover image - always render if exists but control opacity */}
            {hoverImageUrl && (
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
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary/20">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
      </div>
      
      <CardHeader className="p-3 pb-1">
        <div className="flex justify-between items-start gap-1">
          <CardTitle className="text-sm line-clamp-1">{product.name}</CardTitle>
          <Badge className="text-xs py-0 h-5">{categoryName}</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-3 pt-0 pb-0 flex-grow">
        {product.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
            {product.description}
          </p>
        )}
      </CardContent>
      
      <CardFooter className="p-3 pt-1 flex items-center justify-between">
        <p className="font-semibold text-sm">${product.price.toFixed(2)}</p>
        <Badge variant={product.refundPolicy === 'No refund' ? 'destructive' : 'outline'} className="text-xs py-0 h-5">
          {product.refundPolicy || 'Standard'}
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
