"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { UserCircle, Package } from "lucide-react";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const trpc = useTRPC();
  
  // Get user session
  const { data: session, isLoading } = useQuery(
    trpc.auth.session.queryOptions()
  );
  
  // Redirect to sign-in page if not logged in
  useEffect(() => {
    if (!isLoading && !session?.user) {
      router.push("/sign-in");
    }
  }, [session, isLoading, router]);
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }
  
  if (!session?.user) {
    return null; // Redirecting to sign-in page
  }
  
  return (
    <div className="container mx-auto py-4 sm:py-8 md:py-10 px-2 sm:px-4">
      <div className="max-w-4xl mx-auto space-y-3 sm:space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">My Account</h1>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground truncate">
            Welcome back, {(session.user as any).username || session.user.email}
          </p>
        </div>

        {/* Account navigation */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-2 gap-2 w-full sm:w-auto">
            <TabsTrigger value="profile" asChild>
              <Link href="/account/profile" className="flex items-center justify-center px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm">
                <UserCircle className="h-4 w-4 mr-1 sm:mr-2" />
                <span>Profile</span>
              </Link>
            </TabsTrigger>
            <TabsTrigger value="orders" asChild>
              <Link href="/account/orders" className="flex items-center justify-center px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm">
                <Package className="h-4 w-4 mr-1 sm:mr-2" />
                <span>Orders</span>
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Page content */}
        <div className="bg-white rounded-lg border p-3 sm:p-6 shadow-sm overflow-x-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
