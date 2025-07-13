"use client"

import Image from "next/image";
import { useTRPC } from "@/trpc/client";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useImageLoader } from "@/hooks/use-image-loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Share2, ChevronRight, Minus, Plus, Truck } from "lucide-react";
import { StarRating } from "@/components/star-rating"; // Assuming you have a StarRating component

const FALLBACK_IMAGE = "/image-placeholder.svg";

interface ProductViewProps {
  productId: string;
}

export const ProductView = ({ productId }: ProductViewProps) => {
  const trpc = useTRPC();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [hoverImageUrl, setHoverImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState<boolean>(false);
  const [hoverImageError, setHoverImageError] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Product data fetch
  const { data } = useSuspenseQuery(
    trpc.products.getOne.queryOptions({ id: productId })
  );

  // Process and set image URLs
  useEffect(() => {
    console.log("Processing product data:", data);
    
    if (data?.image) {
      const imgUrl = typeof data.image === 'string' 
        ? data.image 
        : data.image?.url || null;
      
      console.log("Setting main image:", imgUrl);
      setImageUrl(imgUrl);
      setActiveImage(imgUrl); // Set as initial active image
    } else {
      console.log("No main image found");
      setImageUrl(null);
    }

    if (data?.hoverImage) {
      const hoverImgUrl = typeof data.hoverImage === 'string' 
        ? data.hoverImage 
        : data.hoverImage?.url || null;
      
      console.log("Setting hover image:", hoverImgUrl);
      setHoverImageUrl(hoverImgUrl);
    } else {
      console.log("No hover image found");
      setHoverImageUrl(null);
    }

    setIsLoading(false);
  }, [data]);

  // Image loading status trackers
  const mainImageLoader = useImageLoader(imageUrl);
  const hoverImageLoader = useImageLoader(hoverImageUrl);
  
  // Quantity handlers
  const incrementQuantity = () => setQuantity(prev => Math.min(prev + 1, 10));
  const decrementQuantity = () => setQuantity(prev => Math.max(prev - 1, 1));

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb Navigation */}
      <nav className="py-4 px-6 flex items-center text-sm text-muted-foreground">
        <a href="/" className="hover:text-primary transition-colors">Home</a>
        <ChevronRight className="h-3 w-3 mx-2" />
        <a href="/products" className="hover:text-primary transition-colors">Products</a>
        {data?.category && typeof data.category === 'object' && (
          <>
            <ChevronRight className="h-3 w-3 mx-2" />
            <a 
              href={`/${(data.category as any).slug}`} 
              className="hover:text-primary transition-colors"
            >
              {(data.category as any).name}
            </a>
          </>
        )}
        <ChevronRight className="h-3 w-3 mx-2" />
        <span className="text-foreground font-medium truncate">{data?.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 p-6 md:p-10">
        {/* Left: Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="rounded-md overflow-hidden bg-white shadow-sm">
            <div 
              className="relative aspect-square overflow-hidden"
              style={{ cursor: 'zoom-in' }}
            >
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Skeleton className="w-[90%] h-[90%] rounded-md" />
                </div>
              ) : activeImage ? (
                <>
                  <Image
                    src={activeImage}
                    alt={data?.name || "Product image"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-all duration-300"
                    priority
                    quality={90}
                    onError={(e) => {
                      console.error(`Failed to load image: ${activeImage}`);
                      setActiveImage(FALLBACK_IMAGE);
                    }}
                  />
                  <div className="absolute bottom-3 right-3 flex space-x-2">
                    <button 
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm transition-colors"
                    >
                      <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-gray-700'}`} />
                    </button>
                    <button 
                      className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm transition-colors"
                    >
                      <Share2 className="h-5 w-5 text-gray-700" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-muted/30">
                  <Image 
                    src={FALLBACK_IMAGE}
                    alt="No product image"
                    width={200}
                    height={200}
                    className="mb-4 opacity-60"
                  />
                  <span className="text-muted-foreground font-medium">No image available</span>
                </div>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {/* Main image thumbnail */}
            {imageUrl && !imageError && (
              <button 
                onClick={() => setActiveImage(imageUrl)} 
                className={`relative h-20 w-20 flex-shrink-0 rounded overflow-hidden transition-all 
                  ${activeImage === imageUrl ? 'ring-2 ring-primary shadow' : 'hover:ring-1 hover:ring-gray-300'}`}
                aria-label="View main product image"
              >
                <Image 
                  src={imageUrl} 
                  alt="Main product view" 
                  fill 
                  sizes="80px"
                  className="object-cover" 
                  onError={() => {
                    console.error(`Failed to load thumbnail: ${imageUrl}`);
                    setImageError(true);
                  }}
                />
              </button>
            )}
            
            {/* Hover image thumbnail */}
            {hoverImageUrl && !hoverImageError && (
              <button 
                onClick={() => setActiveImage(hoverImageUrl)} 
                className={`relative h-20 w-20 flex-shrink-0 rounded overflow-hidden transition-all 
                  ${activeImage === hoverImageUrl ? 'ring-2 ring-primary shadow' : 'hover:ring-1 hover:ring-gray-300'}`}
                aria-label="View alternate product image"
              >
                <Image 
                  src={hoverImageUrl} 
                  alt="Alternate product view" 
                  fill 
                  sizes="80px"
                  className="object-cover" 
                  onError={() => {
                    console.error(`Failed to load thumbnail: ${hoverImageUrl}`);
                    setHoverImageError(true);
                  }}
                />
              </button>
            )}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="space-y-6">
          {/* Product info header */}
          <div>
            {data?.category && typeof data.category === 'object' && (
              <span className="inline-block mb-2 px-3 py-1 bg-gray-50 text-xs font-medium rounded-full">
                {(data.category as any).name}
              </span>
            )}
            
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{data?.name}</h1>
            
            <div className="mt-3 flex items-center space-x-4">
              {/* StarRating component will be implemented separately */}
              <div className="flex items-center">
                {/* @ts-ignore - Component will be created later */}
                <StarRating 
                rating={3}
                iconClassName="size-4"
                />
              </div>
              
              <span className="text-sm text-green-600 font-medium">In stock</span>
            </div>
          </div>
          
          {/* Price */}
          <div>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">Rs. {data?.price?.toFixed(2)}</span>
              {/* If you want to show original price */}
              <span className="ml-3 text-base text-muted-foreground line-through">Rs. {(data?.price * 1.2)?.toFixed(2)}</span>
            </div>
            <p className="text-sm text-green-600 mt-1">
              Save 20% | Limited time offer
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Tax included. Shipping calculated at checkout.
            </p>
          </div>
          
          <div className="h-px bg-gray-100 my-1"></div>
          
          {/* Options: Weight, Size, etc. */}
          <div>
            <label className="block font-medium mb-2">Weight</label>
            <div className="flex gap-2">
              <span className="inline-block px-4 py-1.5 bg-gray-100 text-sm font-medium rounded-full">
                200 gm
              </span>
            </div>
          </div>
          
          {/* Quantity selector */}
          <div>
            <label htmlFor="quantity" className="block font-medium mb-2">
              Quantity
            </label>
            <div className="flex w-32 h-10 bg-gray-50 rounded-md overflow-hidden">
              <button 
                onClick={decrementQuantity}
                className="flex-none w-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                id="quantity"
                type="number"
                min="1"
                max="10"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                className="flex-grow text-center bg-transparent focus:outline-none w-full"
              />
              <button 
                onClick={incrementQuantity}
                className="flex-none w-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                disabled={quantity >= 10}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              className="flex-1 py-6 px-4 flex items-center justify-center rounded-md bg-gray-50 font-medium relative overflow-hidden group"
              style={{ 
                transition: 'all 0.3s ease',
                position: 'relative',
                zIndex: 1
              }}
            >
              <span 
                className="absolute top-0 left-0 w-0 h-full bg-black transition-all duration-300 ease-out group-hover:w-full -z-10"
                style={{ transformOrigin: 'left' }}
              ></span>
              <ShoppingCart className="mr-2 h-5 w-5 relative z-10 group-hover:text-white transition-colors duration-300" />
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">Add to Cart</span>
            </button>
            <button 
              className="flex-1 py-6 px-4 flex items-center justify-center rounded-md bg-black text-white font-medium relative overflow-hidden group"
              style={{ 
                transition: 'all 0.3s ease',
                position: 'relative',
                zIndex: 1
              }}
            >
              <span 
                className="absolute top-0 left-0 w-0 h-full bg-white transition-all duration-300 ease-out group-hover:w-full -z-10"
                style={{ transformOrigin: 'left' }}
              ></span>
              <span className="relative z-10 group-hover:text-black transition-colors duration-300">Buy Now</span>
            </button>
          </div>
          
          {/* Delivery information */}
          <div className="bg-green-50 rounded-md p-3 text-sm">
            <div className="flex items-start">
              <Truck className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
              <div>
                <p className="font-medium text-green-700">
                  Free delivery on orders over Rs. 500
                </p>
                <p className="text-green-600 mt-1">
                  Usually ships within 1-2 business days
                </p>
              </div>
            </div>
          </div>
          
          {/* Store information */}
          <div className="text-sm bg-gray-50 rounded-md p-3">
            <p className="font-medium">
              Pickup available at <span className="font-semibold text-primary">Bagnan Mahila Bikash Hub</span>
            </p>
            <p className="text-muted-foreground mt-1">
              Usually ready in 2-4 days for pickup
            </p>
            <a href="#" className="inline-block mt-2 text-primary underline hover:no-underline">
              View store information
            </a>
          </div>
          
          {/* Product description */}
          {data?.description && (
            <>
              <div className="h-px bg-gray-100 my-1"></div>
              <div>
                <h2 className="font-semibold text-lg mb-2">About this product</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {data.description}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
