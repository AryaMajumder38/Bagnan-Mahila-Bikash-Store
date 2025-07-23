"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogoutButton } from "@/components/ui/logout-button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// Updated icon imports to include Search
import { Menu, ShoppingBag, User, Search, X } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/modules/cart/context/cart-context";
import { CategoriesSidebar } from "@/modules/home/UI/components/search-filters/categories-sidebar";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  // State for the categories sidebar, triggered by the left hamburger menu
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // State for search functionality
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const router = useRouter();
  const trpc = useTRPC();
  const session = useQuery(trpc.auth.session.queryOptions());
  const { cartCount, openCart } = useCart();

  const navigateToAccount = () => {
    router.push('/account/profile');
  };

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  // Focus search input when search is opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }

    // Add keyboard listeners for search interaction
    const handleKeyDown = (e: KeyboardEvent) => {
      // Close search with Escape key
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
      
      // Open search with / key when not in an input field
      if (e.key === '/' && !isSearchOpen && 
          !(e.target instanceof HTMLInputElement) && 
          !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSearchOpen]);
  
  const user = session.data?.user;
  const userInitials = user?.email ? user.email.substring(0, 2).toUpperCase() : "U";

  return (
    <header className="bg-white sticky top-0 z-50">
      {/* Thin top border line as seen in the design */}
      <div className="h-0.5 bg-gray-200"></div>
      
      {/* Search overlay that slides from the top and covers the navbar */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              className="fixed inset-0 bg-black/20 z-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
            />
            
            {/* Search overlay that slides from top */}
            <motion.div 
              className="absolute top-0 left-0 right-0 bg-white shadow-lg z-40 w-full border-b border-gray-200"
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ 
                duration: 0.4, 
                type: "spring", 
                stiffness: 300, 
                damping: 25,
                opacity: { duration: 0.2 } 
              }}
            >
              <div className="container mx-auto h-20 flex items-center px-4 sm:px-6 lg:px-8">
                <form onSubmit={handleSearch} className="flex-1 flex items-center">
                  <motion.div 
                    className="relative flex-1 flex items-center"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                  >
                    <Search className="h-5 w-5 text-gray-400 absolute left-3" />
                    <div className="relative w-full">
                      <Input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search products or categories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-12 pl-10 pr-4 border-gray-200 bg-gray-50 focus:bg-white focus:border-black focus:ring-0 rounded-md shadow-sm text-base transition-all duration-200"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSearch(e);
                          }
                        }}
                      />
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.2 }}
                    className="ml-4"
                  >
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      className="h-10 w-10 rounded-full hover:bg-gray-100"
                      onClick={() => setIsSearchOpen(false)}
                      aria-label="Close search"
                    >
                      <X className="h-5 w-5 text-gray-500 hover:text-black" />
                    </Button>
                  </motion.div>
                </form>
              </div>
              
              {/* Clear button inside the search input */}
              {searchQuery.length > 0 && (
                <div className="absolute right-[70px] top-[30px] sm:right-[86px] md:right-[102px] lg:right-[118px]">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      className="h-6 w-6 p-0 hover:bg-transparent"
                      onClick={() => setSearchQuery('')}
                    >
                      <X className="h-4 w-4 text-gray-400 hover:text-black" />
                    </Button>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

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

          {/* Right Section: Search, User and Cart Icons */}
          <div className="flex items-center justify-end space-x-2 sm:space-x-4">
            {/* Search Button */}
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="ghost" 
                  className="hover:bg-gray-100 transition-colors" 
                  onClick={() => setIsSearchOpen(true)}
                  aria-label="Search products"
                >
                  <Search className="h-6 w-6 text-black" />
                </Button>
              </motion.div>
            </div>

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
