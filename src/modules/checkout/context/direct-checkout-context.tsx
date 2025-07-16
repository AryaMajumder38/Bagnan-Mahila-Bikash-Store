"use client";

import { Product } from "@/payload-types";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Import the ProductVariant type from cart context
import { ProductVariant } from "@/modules/cart/context/cart-context";

// Define the interface for direct checkout
interface DirectCheckoutItem {
  product: Product & {
    selectedVariant?: ProductVariant | null;
  };
  quantity: number;
}

interface DirectCheckoutContextType {
  item: DirectCheckoutItem | null;
  setDirectCheckoutItem: (product: Product, quantity: number) => void;
  clearDirectCheckoutItem: () => void;
}

// Create the context
const DirectCheckoutContext = createContext<DirectCheckoutContextType | undefined>(undefined);

// Provider component
export function DirectCheckoutProvider({ children }: { children: ReactNode }) {
  const [item, setItem] = useState<DirectCheckoutItem | null>(null);
  
  // Set a direct checkout item
  const setDirectCheckoutItem = (
    product: Product & { selectedVariant?: ProductVariant | null }, 
    quantity: number
  ) => {
    setItem({ product, quantity });
  };
  
  // Clear the direct checkout item
  const clearDirectCheckoutItem = () => {
    setItem(null);
  };
  
  // Clear direct checkout item on route change
  useEffect(() => {
    return () => {
      clearDirectCheckoutItem();
    };
  }, []);
  
  return (
    <DirectCheckoutContext.Provider value={{ 
      item, 
      setDirectCheckoutItem, 
      clearDirectCheckoutItem 
    }}>
      {children}
    </DirectCheckoutContext.Provider>
  );
}

// Custom hook to use the direct checkout context
export function useDirectCheckout() {
  const context = useContext(DirectCheckoutContext);
  if (context === undefined) {
    throw new Error("useDirectCheckout must be used within a DirectCheckoutProvider");
  }
  return context;
}
