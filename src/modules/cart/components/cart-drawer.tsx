"use client";

import { useCart } from "../context/cart-context";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Minus, Plus, Trash2, X } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";

const FALLBACK_IMAGE = "/image-placeholder.svg";

export const CartDrawer = () => {
  const {
    items,
    isOpen,
    closeCart,
    updateItemQuantity,
    removeItem,
    clearCart,
    cartTotal,
    cartCount,
  } = useCart();

  const handleUpdateQuantity = (productId: string, variantName: string | undefined, quantity: number) => {
    updateItemQuantity(productId, variantName, quantity);
  };

  const handleRemoveItem = (productId: string, variantName: string | undefined) => {
    removeItem(productId, variantName);
  };

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="flex flex-col h-full w-full sm:max-w-lg">
        <SheetHeader className="space-y-2.5 pr-6">
          <div className="flex items-center justify-between">
            <SheetTitle>Shopping Cart ({cartCount})</SheetTitle>
            <SheetClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </SheetClose>
          </div>
          <SheetDescription>
            {items.length === 0
              ? "Your cart is empty"
              : "Review your items before proceeding to checkout"}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 py-16">
            <div className="rounded-full bg-muted p-6 mb-4">
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
                className="text-muted-foreground h-10 w-10"
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
            </div>
            <p className="text-muted-foreground mb-4 text-center">
              Your cart is empty. Start shopping to add items to your cart.
            </p>
            <Button asChild onClick={closeCart}>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-4">
                {items.map((item) => {
                  const imageUrl =
                    typeof item.product.image === "object" && item.product.image
                      ? item.product.image.url
                      : typeof item.product.image === "string"
                      ? item.product.image
                      : FALLBACK_IMAGE;

                  return (
                    <li
                      key={item.product.id}
                      className="flex gap-4 items-center py-3"
                    >
                      <div className="relative w-20 h-20 rounded-md overflow-hidden bg-muted">
                        <Image
                          src={imageUrl || FALLBACK_IMAGE}
                          alt={item.product.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                          }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2">
                          {item.product.name}
                          {item.product.selectedVariant && (
                            <span className="text-muted-foreground"> - {item.product.selectedVariant.name}</span>
                          )}
                        </h4>

                        <div className="mt-1.5 flex justify-between items-center">
                          <p className="text-sm font-medium">
                            {formatPrice(item.product.selectedVariant?.price || item.product.price || 0)}
                          </p>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.product.id,
                                  item.product.selectedVariant?.name,
                                  item.quantity - 1
                                )
                              }
                            >
                              <Minus className="h-3 w-3" />
                              <span className="sr-only">Decrease quantity</span>
                            </Button>
                            <span className="w-4 text-center text-sm">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.product.id,
                                  item.product.selectedVariant?.name,
                                  item.quantity + 1
                                )
                              }
                            >
                              <Plus className="h-3 w-3" />
                              <span className="sr-only">Increase quantity</span>
                            </Button>
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleRemoveItem(item.product.id, item.product.selectedVariant?.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="space-y-4 pt-4">
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between font-medium">
                  <span>Total</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
              </div>

              <SheetFooter className="flex flex-col gap-2">
                <Button asChild className="w-full">
                  <Link href="/cart">View Cart</Link>
                </Button>
                <Button variant="default" className="w-full">
                  Proceed to Checkout
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => clearCart()}
                >
                  Clear Cart
                </Button>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
