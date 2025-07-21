"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col items-center space-y-2">
          <div className="p-3 bg-red-100 rounded-full">
            <AlertTriangle className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-center">Access Denied</h1>
        </div>
        
        <div className="space-y-4 text-center">
          <p className="text-gray-600">
            You do not have permission to access this area.
          </p>
          <p className="text-gray-500 text-sm">
            This area is restricted to administrators only. If you believe you should have access, please contact the system administrator.
          </p>
        </div>
        
        <div className="pt-4 flex flex-col space-y-3">
          <Button 
            onClick={() => router.push('/')}
            variant="default"
            className="w-full"
          >
            Return to Homepage
          </Button>
          
          <Button 
            asChild
            variant="outline"
            className="w-full"
          >
            <Link href="/sign-in?redirect=/admin">
              Sign in with another account
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
