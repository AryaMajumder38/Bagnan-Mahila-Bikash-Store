"use client";

import { useCart } from "../context/cart-context";
import {
  Sheet,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CartSheetContent } from "./custom-cart-sheet";
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

  // Custom CSS for positioning the cart drawer directly under the navbar
  // Uses the --actual-navbar-height variable set by the navbar component for perfect alignment
  const cartDrawerStyles = "flex flex-col w-full sm:max-w-lg !inset-y-auto !top-[var(--actual-navbar-height,_3.625rem)] !h-[calc(100vh-var(--actual-navbar-height,_3.625rem))] border-t-0 !z-40";

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <CartSheetContent className={cartDrawerStyles} style={{ backgroundColor: "#fafafaf6" }}>
        {/* Thin top border line to match navbar design */}
        <div className="h-0.5 bg-gray-200"></div>
        
        <SheetHeader className="space-y-1.5 sm:space-y-2.5 pr-4 sm:pr-6 mt-2 sm:mt-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-base sm:text-lg">Shopping Cart ({cartCount})</SheetTitle>
            {/* Close button removed */}
          </div>
          <SheetDescription className="text-xs sm:text-sm">
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
            <div className="flex-1 overflow-y-auto py-2 sm:py-4">
              <ul className="space-y-3 sm:space-y-4">
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
                      className="flex gap-2 sm:gap-4 items-center py-2 sm:py-3"
                    >
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden bg-muted">
                        <Image
                          src={imageUrl || FALLBACK_IMAGE}
                          alt={item.product.name}
                          fill
                          sizes="(max-width: 640px) 64px, 80px"
                          className="object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                          }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-xs sm:text-sm line-clamp-2">
                          {item.product.name}
                          {item.product.selectedVariant && (
                            <span className="text-muted-foreground"> - {item.product.selectedVariant.name}</span>
                          )}
                        </h4>

                        <div className="mt-1 sm:mt-1.5 flex justify-between items-center">
                          <p className="text-xs sm:text-sm font-medium">
                            {formatPrice(item.product.selectedVariant?.price || item.product.price || 0)}
                          </p>
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 sm:h-7 sm:w-7"
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.product.id,
                                  item.product.selectedVariant?.name,
                                  item.quantity - 1
                                )
                              }
                            >
                              <Minus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                              <span className="sr-only">Decrease quantity</span>
                            </Button>
                            <span className="w-3 sm:w-4 text-center text-xs sm:text-sm">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 sm:h-7 sm:w-7"
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.product.id,
                                  item.product.selectedVariant?.name,
                                  item.quantity + 1
                                )
                              }
                            >
                              <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                              <span className="sr-only">Increase quantity</span>
                            </Button>
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 sm:h-7 sm:w-7"
                        onClick={() => handleRemoveItem(item.product.id, item.product.selectedVariant?.name)}
                      >
                        <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="space-y-3 sm:space-y-4 pt-2 sm:pt-4">
              <Separator />
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between font-medium text-sm sm:text-base">
                  <span>Total</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
              </div>

              <SheetFooter className="flex flex-col gap-1.5 sm:gap-2 pb-2 sm:pb-0">
                <Button asChild className="w-full text-xs sm:text-sm h-8 sm:h-10" size="sm">
                  <Link href="/cart">View Cart</Link>
                </Button>
                <Button variant="default" className="w-full text-xs sm:text-sm h-8 sm:h-10" size="sm">
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs sm:text-sm h-8 sm:h-10"
                  onClick={() => clearCart()}
                >
                  Clear Cart
                </Button>
              </SheetFooter>
            </div>
          </>
        )}
      </CartSheetContent>
    </Sheet>
  );
};
