"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AdminAccessGuardProps {
  children: React.ReactNode;
}

export default function AdminAccessGuard({ children }: AdminAccessGuardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Use a flag to prevent multiple redirects
    let isRedirecting = false;
    
    const checkAdminAccess = async () => {
      try {
        console.log("AdminAccessGuard: Checking admin access");
        // Fetch the current user's profile using the /api/users/me endpoint
        const response = await fetch("/api/users/me", {
          credentials: "include", // Include cookies for authentication
          // Add cache: 'no-store' to prevent caching
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error("Not authenticated");
        }

        const userData = await response.json();
        console.log("AdminAccessGuard: User data received", userData.user?.roles);
        
        // Check if the user has the super-admin role
        const hasAdminRole = Array.isArray(userData.user?.roles) && 
          userData.user?.roles.includes("super-admin");

        if (!hasAdminRole) {
          // User is authenticated but doesn't have admin role
          if (!isRedirecting) {
            isRedirecting = true;
            console.log("AdminAccessGuard: User does not have admin role, redirecting");
            toast.error("You don't have permission to access the admin area");
            router.push("/unauthorized");
            return;
          }
        }

        // User has admin role, allow access
        console.log("AdminAccessGuard: User authorized as admin");
        setIsAuthorized(true);
      } catch (error) {
        console.error("Admin access check failed:", error);
        // Redirect to login
        if (!isRedirecting) {
          isRedirecting = true;
          router.push("/sign-in?redirect=/admin");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAccess();
  }, [router]);

  // Show loading state while checking authorization
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-xl">Checking authorization...</div>
      </div>
    );
  }

  // Render children only if authorized
  return isAuthorized ? <>{children}</> : null;
}
