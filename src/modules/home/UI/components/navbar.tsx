"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogoutButton } from "@/components/ui/logout-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronDown,
  Menu,
  X,
  ShoppingCart,
  LogIn,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { ReactNode } from "react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

interface NavbarItemProps {
  href: string;
  children: ReactNode;
  isActive: boolean;
}

const NavbarItem = ({ href, children, isActive }: NavbarItemProps) => {
  return (
    <Button
      asChild
      variant="outline"
      className={cn(
        "bg-transparent hover:bg-transparent rounded-full hover:border-primary border-transparent px-3.5 text-lg",
        isActive && "bg-black text-white hover:bg-black hover:text-white"
      )}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
};

const NavbarItems = [
  { href: "/", children: "Home" },
  { href: "/about", children: "About" },
  { href: "/contact", children: "Contact" },
  { href: "/features", children: "Features" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const cartItemCount = 3;
  const pathname = usePathname();
  const trpc = useTRPC();
  const session = useQuery(trpc.auth.session.queryOptions());

  return (
    <header className="bg-white shadow-sm border-b border-earth-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Website Logo-like Button (Amazon style) */}
          <Link href="/" className="flex items-center">
            <div className="flex items-center justify-center px-2 py-1">
              <span className={cn("text-2xl font-bold text-black mr-1", poppins.className)}>SEVA</span>
              <span className={cn("text-2xl font-bold text-black mr-1", poppins.className)}>WINGS</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {NavbarItems.map((item) => (
              <NavbarItem
                key={item.href}
                href={item.href}
                isActive={pathname === item.href}
              >
                {item.children}
              </NavbarItem>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 text-sage-700 hover:text-sage-800 font-medium transition-colors">
                <span>Shop</span>
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border border-earth-200 shadow-lg">
                <DropdownMenuItem className="text-sage-700 hover:bg-earth-100">
                  Clothes
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sage-700 hover:bg-earth-100">
                  Spices
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sage-700 hover:bg-earth-100">
                  Household Products
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              className="border-terracotta-400 text-terracotta-600 hover:bg-terracotta-50"
            >
              Donate
            </Button>
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {session.data?.user ? (
              <>
                <Button
                  asChild
                  className="hidden lg:flex border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none bg-black text-white hover:bg-red-400 hover:text-black transition-colors text-lg"
                >
                  <Link href="/admin">Dashboard</Link>
                </Button>
                <LogoutButton />
              </>
            ) : (
              <div className="hidden lg:flex">
                <Button
                  asChild
                  variant="secondary"
                  className="border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none bg-white hover:bg-red-400 transition-colors text-lg"
                >
                  <Link href="/sign-in">Login</Link>
                </Button>
                <Button
                  asChild
                  className="border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none bg-black text-white hover:bg-red-400 hover:text-black transition-colors text-lg"
                >
                  <Link href="/sign-up">Register</Link>
                </Button>
              </div>
            )}

            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="relative h-8 w-8 sm:h-10 sm:w-10"
              >
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-sage-700" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center p-0 bg-terracotta-500 text-white text-xs">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </div>

            <Avatar className="hidden sm:flex h-8 w-8 sm:h-10 sm:w-10 ring-2 ring-sage-200">
              <AvatarImage
                src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
                alt="User"
              />
              <AvatarFallback className="bg-sage-100 text-sage-700">
                JD
              </AvatarFallback>
            </Avatar>

            <Button
              variant="ghost"
              className="lg:hidden size-12 border-transparent hover:bg-transparent bg-white"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu />
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t border-earth-200 pt-4">
            <div className="flex flex-col space-y-3">
              {NavbarItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sage-700 hover:text-sage-800 font-medium"
                >
                  {item.children}
                </Link>
              ))}
              <div className="space-y-2">
                <div className="text-sage-700 font-medium">Shop</div>
                <div className="ml-4 space-y-2">
                  <Link
                    href="#"
                    className="block text-sage-600 hover:text-sage-800"
                  >
                    Clothes
                  </Link>
                  <Link
                    href="#"
                    className="block text-sage-600 hover:text-sage-800"
                  >
                    Spices
                  </Link>
                  <Link
                    href="#"
                    className="block text-sage-600 hover:text-sage-800"
                  >
                    Household Products
                  </Link>
                </div>
              </div>
              <Button
                variant="outline"
                className="border-terracotta-400 text-terracotta-600 hover:bg-terracotta-50 w-fit"
              >
                Donate
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;

