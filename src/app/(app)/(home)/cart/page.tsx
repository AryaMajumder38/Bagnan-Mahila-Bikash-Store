"use client";

import { Button } from "@/components/ui/button";
import { CartItem, useCart } from "@/modules/cart/context/cart-context";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowLeft, LogIn } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const FALLBACK_IMAGE = "/image-placeholder.svg";

export default function CartPage() {
  const { items, updateItemQuantity, removeItem, clearCart, cartTotal } = useCart() as {
    items: CartItem[];
    updateItemQuantity: (productId: string, variantName?: string, quantity?: number) => void;
    removeItem: (productId: string, variantName?: string) => void;
    clearCart: () => void;
    cartTotal: number;
  };
  const trpc = useTRPC();
  const router = useRouter();
  
  // Get user session to check if logged in
  const { data: session, isLoading: isSessionLoading } = useQuery(trpc.auth.session.queryOptions());
  
  // If not logged in, show a message and redirect to sign in
  useEffect(() => {
    if (session === undefined) return; // Wait until session data loads
    
    if (!session?.user) {
      toast.error("Please sign in", {
        description: "You need to be logged in to view your cart"
      });
      router.push("/sign-in");
    }
  }, [session, router]);

  // Show loading state while checking authentication
  if (isSessionLoading) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Loading...</h1>
          <p>Please wait while we check your account</p>
        </div>
      </div>
    );
  }

  // If session loaded but no user, show sign-in prompt
  if (!isSessionLoading && !session?.user) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Sign in required</h1>
          <p className="mb-6">You need to be signed in to view your cart</p>
          <Button asChild>
            <Link href="/sign-in">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
          <div className="rounded-full bg-muted p-6 mb-4 mx-auto w-24 h-24 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground h-12 w-12"
            >
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
          </div>
          <p className="text-muted-foreground mb-8">
            Your cart is empty. Add some products to your cart to see them here.
          </p>
          <Button asChild>
            <Link href="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="hidden sm:grid grid-cols-8 gap-6 text-sm text-muted-foreground mb-4 pb-2 border-b">
              <div className="col-span-4">Product</div>
              <div className="col-span-1 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-1 text-right">Total</div>
            </div>

            <ul className="divide-y">
              {items.map((item) => (
                <CartItemRow
                  key={item.product.id}
                  item={item}
                  updateQuantity={updateItemQuantity}
                  removeItem={removeItem}
                />
              ))}
            </ul>

            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <Button variant="ghost" asChild>
                <Link href="/products">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>
              <Button variant="outline" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-sm">Calculated at checkout</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span className="text-sm">Calculated at checkout</span>
              </div>

              <Separator className="my-2" />

              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>

              <Button className="w-full mt-4" size="lg" asChild>
                <Link href="/checkout">
                  Proceed to Checkout
                </Link>
              </Button>
              
              <div className="mt-4 text-xs text-center text-muted-foreground">
                <p>Secure checkout powered by Razorpay</p>
                <p className="mt-1">All transactions are encrypted and secure</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CartItemRowProps {
  item: CartItem;
  updateQuantity: (productId: string, variantName?: string, quantity?: number) => void;
  removeItem: (productId: string, variantName?: string) => void;
}

const CartItemRow = ({ item, updateQuantity, removeItem }: CartItemRowProps) => {
  const { product, quantity } = item;
  const imageUrl =
    typeof product.image === "object" && product.image
      ? product.image.url
      : typeof product.image === "string"
      ? product.image
      : FALLBACK_IMAGE;

  // Calculate price based on variant if available
  const price = product.selectedVariant?.price || product.price || 0;
  const itemTotal = price * quantity;

  return (
    <li className="py-4 grid grid-cols-1 sm:grid-cols-8 gap-4 sm:gap-6 items-center">
      <div className="col-span-1 sm:col-span-4 flex gap-4 items-center">
        <div className="w-20 h-20 relative rounded-md overflow-hidden bg-muted flex-shrink-0">
          <Image
            src={imageUrl || FALLBACK_IMAGE}
            alt={product.name}
            fill
            className="object-cover"
            sizes="80px"
            onError={(e) => {
              (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
            }}
          />
        </div>
        <div className="flex-grow min-w-0">
          <Link href={`/products/${product.id}`} className="hover:text-primary transition-colors">
            <h3 className="font-medium line-clamp-2">
              {product.name}
              {product.selectedVariant && (
                <span className="text-sm text-muted-foreground ml-1">
                  - {product.selectedVariant.name}
                </span>
              )}
            </h3>
          </Link>
          {typeof product.category === 'object' && product.category && (
            <p className="text-sm text-muted-foreground mt-1">
              {(product.category as any).name}
            </p>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground mt-1 h-auto p-0 sm:hidden"
            onClick={() => removeItem(product.id, product.selectedVariant?.name)}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
          </Button>
        </div>
      </div>

      <div className="col-span-1 sm:text-center">
        <div className="text-sm sm:hidden mb-1">Price:</div>
        {formatPrice(price)}
      </div>

      <div className="col-span-1 sm:col-span-2 flex items-center sm:justify-center">
        <div className="text-sm sm:hidden mb-1 mr-2">Quantity:</div>
        <div className="flex items-center border rounded-md">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-none rounded-l-md"
            onClick={() => updateQuantity(product.id, product.selectedVariant?.name, Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="h-3 w-3" />
            <span className="sr-only">Decrease quantity</span>
          </Button>
          <span className="w-8 text-center text-sm">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-none rounded-r-md"
            onClick={() => updateQuantity(product.id, product.selectedVariant?.name, quantity + 1)}
          >
            <Plus className="h-3 w-3" />
            <span className="sr-only">Increase quantity</span>
          </Button>
        </div>
      </div>

      <div className="col-span-1 text-right flex items-center justify-end">
        <div>
          <div className="text-sm sm:hidden mb-1">Total:</div>
          <span className="font-medium">{formatPrice(itemTotal)}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-2 h-8 w-8 text-muted-foreground hidden sm:flex"
          onClick={() => removeItem(product.id, product.selectedVariant?.name)}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Remove</span>
        </Button>
      </div>
    </li>
  );
};
