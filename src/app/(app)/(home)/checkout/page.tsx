"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/modules/cart/context/cart-context";
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

export default function CheckoutPage() {
  const { items, cartTotal } = useCart();
  const trpc = useTRPC();
  const router = useRouter();
  
  // Get user session to check if logged in
  const { data: session, isLoading: isSessionLoading } = useQuery(
    trpc.auth.session.queryOptions()
  );
  
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

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      toast.error("Your cart is empty", {
        description: "Add some products to your cart before checking out"
      });
      router.push("/cart");
    }
  }, [items, router]);

  // Show loading state while checking authentication
  if (isSessionLoading) {
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

  // If cart is empty, redirect to products
  if (items.length === 0) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Your Cart is Empty</h1>
          <p className="mb-6">Add some products to your cart before checking out</p>
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
            <Link href="/cart">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cart
            </Link>
          </Button>
          <CheckoutForm items={items} total={cartTotal} />
        </div>
        
        {/* Order summary - right side */}
        <div className="w-full md:w-1/3">
          <OrderSummary items={items} total={cartTotal} />
          <Button 
            form="checkout-form"
            type="submit"
            className="w-full mt-4 py-6 bg-black hover:bg-gray-800 text-white font-medium"
          >
            <CreditCard className="mr-2 h-5 w-5" />
            Pay Now - {formatPrice(cartTotal)}
          </Button>
        </div>
      </div>
    </div>
  );
}
