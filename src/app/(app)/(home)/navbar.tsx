"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { NavbarSidebar } from "./navbar-sidebar";
import { use, useState } from "react";
import { MenuIcon } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { LogoutButton } from "@/components/ui/logout-button";
const poppins = Poppins({
    subsets: ["latin"],
    weight: ["700"],
});


interface NavbarItemProps {
    href:string;
    children:React.ReactNode;
    isActive?:boolean;
}
const NavbarItem = ({
    href,
    children,
    isActive 
}: NavbarItemProps) => {
    return (
        <Button 
        asChild
        variant="outline"
        className={cn(
        "bg-transparent hover:bg-transparent rounded-full hover:border-primary  border-transparent px-3.5 text-lg",    
            isActive && "bg-black text-white hover:bg-black hover:text-white",
        )}
        >
            <Link href={href}>
            {children}
            </Link>
            
        </Button>
    );
}

const NavbarItems = [
    {href : "/", children: "Home"},
    {href : "/about", children: "About"},
    {href : "/contact", children: "Contact"},
    {href : "/features", children: "features"},
    {href : "/pricing", children: "pricing"},
]


    
export const Navbar = () => {

    const pathname = usePathname();
    const [isSidebarOpen, setisSidebarOpen] = useState(false);

    const trpc = useTRPC();
    const session = useQuery(trpc.auth.session.queryOptions());


    return (
        <nav className="h-20 flex border-b  justify-between font-medium bg-white">
            <Link href="/" className="pl-6 flex items-center">
                    <span className={cn("text-5xl font-semibold",poppins.className)}>
                        Website
                        </span>
                </Link>

                <NavbarSidebar
                items={NavbarItems} 
                open={isSidebarOpen}
                onOpenChange={setisSidebarOpen}
                />

                <div className="flex items-center gap-4 hidden lg:flex">
                    {NavbarItems.map((item) => (
                       <NavbarItem
                            key={item.href}
                            href={item.href}
                            isActive={pathname === item.href}
                        >
                            {item.children}
                            </NavbarItem>
                    ))}
                    </div>
                        {session.data?.user ? (
                            <div className="hidden lg:flex">
                                <Button
                                asChild
                                variant="secondary"
                                className="border-l border-t-0 border-b-0  border-r-0 px-12 h-full rounded-none bg-white hover:bg-red-400 transition-colors text-lg "
                            >
                                <Link  href="/admin">
                                    Dashboard
                                </Link>
                                </Button>
                                <LogoutButton />
                            </div>

                        ): (
                    <div className="hidden lg:flex">
                        <Button
                        asChild
                        variant="secondary"
                        className="border-l border-t-0 border-b-0  border-r-0 px-12 h-full rounded-none bg-white hover:bg-red-400 transition-colors text-lg "
                        >
                            <Link prefetch href="/sign-in">
                        Login
                        </Link>
                        </Button>
                        <Button
                        asChild
                        className="border-l border-t-0 border-b-0  border-r-0 px-12 h-full rounded-none bg-black text-white hover:bg-red-400 hover:text-black transition-colors text-lg "
                         >
                            <Link prefetch href="/sign-up">
                        Register
                        </Link>
                        </Button>
                    </div>
                    ) }

                    <div className="flex lg:hidden items-center justify-center">
                        <Button
                        variant="ghost"
                        className="size-12 border-transparent hover:bg-transparent bg-white"
                        onClick={() => setisSidebarOpen(true)}
                        >
                            <MenuIcon />
                        </Button>

                    </div>
        </nav>
    );
}