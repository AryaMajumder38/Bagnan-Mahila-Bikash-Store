"use client";

import { CartItem } from "@/modules/cart/context/cart-context";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

interface OrderSummaryProps {
  items: CartItem[];
  total: number;
}

export function OrderSummary({ items, total }: OrderSummaryProps) {
  // Calculate subtotal and shipping cost
  const subtotal = total;
  const shipping = 0; // Free shipping for now, could be calculated based on order
  const tax = Math.round(subtotal * 0.18); // 18% tax rate example (GST in India)
  const orderTotal = subtotal + shipping + tax;
  
  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      
      {/* Product list */}
      <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
        {items.map((item) => (
          <div key={item.product.id} className="flex gap-4">
            <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">                <Image 
                src={typeof item.product.image === 'string' ? item.product.image : item.product.image?.url || "/image-placeholder.svg"}
                alt={item.product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-grow">
              <p className="font-medium">
                {item.product.name}
                {item.product.selectedVariant && (
                  <span className="text-sm text-gray-500 ml-1">
                    - {item.product.selectedVariant.name}
                  </span>
                )}
              </p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                <p className="font-medium">{formatPrice((item.product.selectedVariant?.price || item.product.price || 0) * item.quantity)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <Separator className="my-4" />
      
      {/* Cost breakdown */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tax (18% GST)</span>
          <span>{formatPrice(tax)}</span>
        </div>
        
        <Separator className="my-2" />
        
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>{formatPrice(orderTotal)}</span>
        </div>
      </div>
    </div>
  );
}
