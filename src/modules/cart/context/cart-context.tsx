"use client";

import { Product } from "@/payload-types";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

// Define the cart item type which extends the Product type with quantity
// Define a variant type
export interface ProductVariant {
  name: string;
  price: number;
  sku?: string;
  stock: number;
}

export interface CartItem {
  product: Product & { 
    selectedVariant?: ProductVariant | null;
  };
  quantity: number;
}

// Define the cart context type
interface CartContextType {
  items: CartItem[];
  addItem: (product: Product & { selectedVariant?: ProductVariant | null }, quantity: number) => void;
  updateItemQuantity: (productId: string, variantName?: string, quantity?: number) => void;
  removeItem: (productId: string, variantName?: string) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  cartTotal: number;
  cartCount: number;
  isLoading: boolean;
}

// Create the cart context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create a provider component
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const trpc = useTRPC();
  
  // Get user session to determine if user is logged in
  const { data: session, isLoading: isSessionLoading } = useQuery(
    trpc.auth.session.queryOptions()
  );
  
  // Get cart storage key based on whether user is logged in
  const getCartStorageKey = () => {
    if (session?.user?.id) {
      return `cart-${session.user.id}`;
    }
    return "guest-cart";
  };
  
  // Initialize cart from localStorage on component mount
  useEffect(() => {
    setMounted(true);
    
    if (mounted) {
      const cartKey = getCartStorageKey();
      const savedCart = localStorage.getItem(cartKey);
      
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart));
        } catch (error) {
          console.error(`Error parsing cart data from localStorage (${cartKey})`, error);
          localStorage.removeItem(cartKey);
        }
      }
      
      setIsLoading(false);
    }
  }, [session?.user?.id, mounted]);

  // Save cart to localStorage when it changes
  useEffect(() => {
    if (mounted) {
      const cartKey = getCartStorageKey();
      localStorage.setItem(cartKey, JSON.stringify(items));
    }
  }, [items, mounted, session?.user?.id]);

  // Add item to cart
  const addItem = (product: Product & { selectedVariant?: ProductVariant | null }, quantity: number) => {
    // Check if user is logged in
    if (!session?.user) {
      toast.error("Please sign in", {
        description: "You need to be logged in to add items to your cart",
        action: {
          label: "Sign In",
          onClick: () => window.location.href = "/sign-in"
        }
      });
      return;
    }

    setItems((prevItems) => {
      // Check if product already exists in cart
      // For products with variants, check both product ID and variant name
      const existingItem = prevItems.find(item => {
        // If both have variants selected, match by product ID and variant name
        if (item.product.selectedVariant && product.selectedVariant) {
          return item.product.id === product.id && 
                 item.product.selectedVariant.name === product.selectedVariant.name;
        }
        // If neither have variants, match just by product ID
        if (!item.product.selectedVariant && !product.selectedVariant) {
          return item.product.id === product.id;
        }
        // One has variant and the other doesn't, so they don't match
        return false;
      });

      if (existingItem) {
        // Update quantity if product with same variant already exists
        return prevItems.map((item) => {
          // Check if this is the item to update
          if ((item.product.selectedVariant && product.selectedVariant &&
               item.product.id === product.id && 
               item.product.selectedVariant.name === product.selectedVariant.name) ||
              (!item.product.selectedVariant && !product.selectedVariant && 
               item.product.id === product.id)) {
            return { ...item, quantity: item.quantity + quantity };
          }
          return item;
        });
      } else {
        // Add new product to cart
        return [...prevItems, { product, quantity }];
      }
    });

    const variantInfo = product.selectedVariant ? ` (${product.selectedVariant.name})` : '';
    toast.success("Item added to cart", {
      description: `${quantity} × ${product.name}${variantInfo} added to your cart`,
    });

    // Open cart drawer when adding item
    setIsOpen(true);
  };

  // Update item quantity - now supports variants
  const updateItemQuantity = (productId: string, variantName?: string, quantity: number = 0) => {
    // Check if user is logged in
    if (!session?.user) {
      toast.error("Please sign in", {
        description: "You need to be logged in to update items in your cart",
        action: {
          label: "Sign In",
          onClick: () => window.location.href = "/sign-in"
        }
      });
      return;
    }
    
    if (quantity <= 0) {
      removeItem(productId, variantName);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) => {
        // For items with variants, match both product ID and variant name
        if (variantName && item.product.selectedVariant) {
          if (item.product.id === productId && item.product.selectedVariant.name === variantName) {
            return { ...item, quantity };
          }
          return item;
        }
        
        // For items without variants, just match product ID
        if (!variantName && !item.product.selectedVariant && item.product.id === productId) {
          return { ...item, quantity };
        }
        
        return item;
      })
    );
  };

  // Remove item from cart - now supports variants
  const removeItem = (productId: string, variantName?: string) => {
    // Check if user is logged in
    if (!session?.user) {
      toast.error("Please sign in", {
        description: "You need to be logged in to remove items from your cart",
        action: {
          label: "Sign In",
          onClick: () => window.location.href = "/sign-in"
        }
      });
      return;
    }
    
    setItems((prevItems) => prevItems.filter((item) => {
      // For items with variants, match both product ID and variant name
      if (variantName && item.product.selectedVariant) {
        return !(item.product.id === productId && 
                item.product.selectedVariant.name === variantName);
      }
      
      // For items without variants, just match product ID
      if (!variantName && !item.product.selectedVariant) {
        return item.product.id !== productId;
      }
      
      // If we're looking for non-variant but item has variant (or vice versa), keep the item
      return true;
    }));
    
    toast.info("Item removed from cart");
  };

  // Clear cart
  const clearCart = () => {
    // Check if user is logged in
    if (!session?.user) {
      toast.error("Please sign in", {
        description: "You need to be logged in to clear your cart",
        action: {
          label: "Sign In",
          onClick: () => window.location.href = "/sign-in"
        }
      });
      return;
    }
    
    setItems([]);
    toast.info("Cart cleared");
  };

  // Open cart drawer
  const openCart = () => setIsOpen(true);

  // Close cart drawer
  const closeCart = () => setIsOpen(false);

  // Calculate total price of all items in cart
  const cartTotal = items.reduce((total, item) => {
    // Use variant price if available, otherwise fallback to product price
    const price = item.product.selectedVariant?.price || item.product.price || 0;
    return total + price * item.quantity;
  }, 0);

  // Calculate total number of items in cart
  const cartCount = items.reduce((count, item) => count + item.quantity, 0);

  // Determine overall loading state
  const loading = isSessionLoading || isLoading;

  // Handle login/logout effect to migrate guest cart to user cart
  useEffect(() => {
    if (session?.user?.id && mounted) {
      // User just logged in, check if there's a guest cart to migrate
      const guestCart = localStorage.getItem("guest-cart");
      
      if (guestCart) {
        try {
          const guestItems = JSON.parse(guestCart) as CartItem[];
          
          // If there are items in the guest cart, migrate them to the user cart
          if (guestItems.length > 0) {
            // First see if there's an existing user cart
            const userCartKey = `cart-${session.user.id}`;
            const existingUserCart = localStorage.getItem(userCartKey);
            
            if (existingUserCart) {
              try {
                // Merge the guest cart with the user cart
                const userCartItems = JSON.parse(existingUserCart) as CartItem[];
                
                // Combine the carts, adding quantities for duplicate products
                const mergedItems = [...userCartItems];
                
                guestItems.forEach(guestItem => {
                  const existingItemIndex = mergedItems.findIndex(
                    item => item.product.id === guestItem.product.id
                  );
                  
                  if (existingItemIndex >= 0) {
                    // Product exists in user cart, add quantities
                    mergedItems[existingItemIndex].quantity += guestItem.quantity;
                  } else {
                    // Product doesn't exist in user cart, add it
                    mergedItems.push(guestItem);
                  }
                });
                
                // Update local storage and state with merged cart
                localStorage.setItem(userCartKey, JSON.stringify(mergedItems));
                setItems(mergedItems);
              } catch (error) {
                console.error("Error merging cart data", error);
                // If merge fails, just use the guest cart
                localStorage.setItem(userCartKey, guestCart);
                setItems(guestItems);
              }
            } else {
              // No existing user cart, just copy the guest cart
              localStorage.setItem(userCartKey, guestCart);
              setItems(guestItems);
            }
            
            // Clear the guest cart after migration
            localStorage.removeItem("guest-cart");
            
            toast.success("Your cart items have been saved to your account");
          }
        } catch (error) {
          console.error("Error migrating guest cart", error);
        }
      }
    }
  }, [session?.user?.id, mounted]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateItemQuantity,
        removeItem,
        clearCart,
        isOpen,
        openCart,
        closeCart,
        cartTotal,
        cartCount,
        isLoading: loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use the cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
