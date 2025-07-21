"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogoutButton } from "@/components/ui/logout-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// Updated icon import to use ShoppingBag
import { Menu, ShoppingBag, User } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/modules/cart/context/cart-context";
import { CategoriesSidebar } from "@/modules/home/UI/components/search-filters/categories-sidebar";

const Navbar = () => {
  // State for the categories sidebar, triggered by the left hamburger menu
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const router = useRouter();
  const trpc = useTRPC();
  const session = useQuery(trpc.auth.session.queryOptions());
  const { cartCount, openCart } = useCart();

  const navigateToAccount = () => {
    router.push('/account/profile');
  };

  const user = session.data?.user;
  const userInitials = user?.email ? user.email.substring(0, 2).toUpperCase() : "U";

  return (
    <header className="bg-white sticky top-0 z-50">
      {/* Thin top border line as seen in the design */}
      <div className="h-0.5 bg-gray-200"></div>

      {/* Categories Sidebar (functionality retained from original code) */}
      <CategoriesSidebar 
        open={isSidebarOpen} 
        onOpenChange={(open) => {
          // Only update state if the value is actually different
          if (open !== isSidebarOpen) {
            setIsSidebarOpen(open);
          }
        }} 
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-20">
          
          {/* Left Section: Hamburger Menu for Sidebar */}
          <Button
            variant="ghost"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open menu"
            className="hover:bg-transparent"
          >
            <Menu className="h-6 w-6 text-black" />
          </Button>

          {/* Center Section: Logo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link href="/" className="flex flex-col items-center" aria-label="Back to homepage">
              {/* Placeholder for the oval logo from the image */}
              <div className="h-10 w-5 bg-black rounded-full"></div>
              <span className="text-xs font-medium tracking-widest text-gray-700 mt-1">
                Apna Bazar
              </span>
            </Link>
          </div>

          {/* Right Section: User and Cart Icons */}
          <div className="flex items-center justify-end space-x-2 sm:space-x-4">
            {/* User Icon and Dropdown */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" aria-label="User account" className="hover:bg-transparent">
                     <User className="h-6 w-6 text-black" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={navigateToAccount}>
                    <User className="mr-2 h-4 w-4" />
                    <span>My Account</span>
                  </DropdownMenuItem>
                   {/* Optional: Add a link to the admin dashboard if it exists */}
                  {/* Only show Dashboard link for admin users */}
                  {(user as any)?.roles?.includes('super-admin') && (
                    <DropdownMenuItem onClick={() => router.push('/admin')}>
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <LogoutButton />
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // If logged out, show a user icon that links to the sign-in page
              <Link href="/sign-in" aria-label="Sign in">
                <Button variant="ghost" className="hover:bg-transparent">
                  <User className="h-6 w-6 text-black" />
                </Button>
              </Link>
            )}
            
            {/* Cart Icon - Swapped to ShoppingBag */}
            <Button
              variant="ghost"
              className="relative hover:bg-transparent"
              onClick={openCart}
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <ShoppingBag className="h-6 w-6 text-black" />
              {cartCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {cartCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
