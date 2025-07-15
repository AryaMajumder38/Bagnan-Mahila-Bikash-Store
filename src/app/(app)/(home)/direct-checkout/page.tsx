"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/modules/cart/context/cart-context";
import { useDirectCheckout } from "@/modules/checkout/context/direct-checkout-context";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, LogIn, ShoppingBag, CreditCard } from "lucide-react";
import { CheckoutForm } from "@/modules/checkout/components/checkout-form";
import { OrderSummary } from "@/modules/checkout/components/order-summary";
import { Product } from "@/payload-types";
import { CartItem } from "@/modules/cart/context/cart-context";

export default function DirectCheckoutPage() {
  const { items: cartItems, cartTotal } = useCart();
  const { item: directItem, clearDirectCheckoutItem } = useDirectCheckout();
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
  const [checkoutTotal, setCheckoutTotal] = useState<number>(0);
  
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const quantity = searchParams.get("quantity") ? parseInt(searchParams.get("quantity") as string, 10) : 1;
  
  const trpc = useTRPC();
  const router = useRouter();
  
  // Fetch product if productId is provided in URL
  const { data: productData, isLoading: isProductLoading } = useQuery({
    ...trpc.products.getOne.queryOptions({ 
      id: productId as string 
    }),
    enabled: !!productId,
  });
  
  // Get user session to check if logged in
  const { data: session, isLoading: isSessionLoading } = useQuery(
    trpc.auth.session.queryOptions()
  );
  
  // Determine which items to show in checkout
  useEffect(() => {
    if (productData) {
      // If product is in URL params, use it for direct checkout
      setCheckoutItems([{ product: productData as Product, quantity }]);
      setCheckoutTotal((productData as Product).price * quantity);
    } else if (directItem) {
      // If direct checkout item is in context, use it
      setCheckoutItems([directItem]);
      setCheckoutTotal(directItem.product.price * directItem.quantity);
    } else {
      // Otherwise use the cart items
      setCheckoutItems(cartItems);
      setCheckoutTotal(cartTotal);
    }
  }, [productData, directItem, cartItems, cartTotal, quantity]);
  
  // If not logged in, show a message and redirect to sign in
  useEffect(() => {
    if (session === undefined) return; // Wait until session data loads
    
    if (!session?.user) {
      toast.error("Please sign in", {
        description: "You need to be logged in to checkout"
      });
      router.push("/sign-in");
    }
  }, [session, router]);

  // Redirect if there are no items to checkout
  useEffect(() => {
    if (!isProductLoading && !isSessionLoading && session?.user) {
      if ((!productData && !directItem && cartItems.length === 0)) {
        toast.error("No products to checkout", {
          description: "Please add products before proceeding to checkout"
        });
        router.push("/products");
      }
    }
  }, [isProductLoading, isSessionLoading, session, productData, directItem, cartItems, router]);

  // Show loading state while checking authentication or fetching product
  if (isSessionLoading || isProductLoading) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Loading...</h1>
          <p>Please wait while we prepare the checkout page</p>
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
          <p className="mb-6">You need to be signed in to checkout</p>
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

  // If there are no items to checkout, show a message
  if (checkoutItems.length === 0) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">No Products to Checkout</h1>
          <p className="mb-6">Add some products before checking out</p>
          <Button asChild>
            <Link href="/products">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Browse Products
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Checkout form - left side */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-6">Checkout</h1>
          <Button variant="ghost" asChild className="mb-6">
            <Link href={productData || directItem ? "/products" : "/cart"}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {productData || directItem ? "Back to Products" : "Back to Cart"}
            </Link>
          </Button>
          <CheckoutForm />
        </div>
        
        {/* Order summary - right side */}
        <div className="w-full md:w-1/3">
          <OrderSummary items={checkoutItems} total={checkoutTotal} />
          <Button 
            form="checkout-form"
            type="submit"
            className="w-full mt-4 py-6 bg-black hover:bg-gray-800 text-white font-medium"
          >
            <CreditCard className="mr-2 h-5 w-5" />
            Pay Now - {formatPrice(checkoutTotal)}
          </Button>
        </div>
      </div>
    </div>
  );
}
