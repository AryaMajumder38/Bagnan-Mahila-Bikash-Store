'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import AdminAccessGuard from '@/components/admin-access-guard';

// This layout automatically ensures the user is sent to the correct admin URL
// And also verifies that the user has proper admin permissions
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  
  useEffect(() => {
    // The issue might be that the user is navigating to /admin instead of /admin/
    // Payload CMS typically requires the trailing slash
    const currentPath = window.location.pathname;
    
    // Check if we're at exactly /admin with no trailing slash
    // Only redirect if we're exactly at /admin without a trailing slash
    if (currentPath === '/admin') {
      console.log('Redirecting to /admin/ (with trailing slash)');
      // Use a flag in sessionStorage to prevent infinite redirects
      if (!sessionStorage.getItem('adminRedirected')) {
        sessionStorage.setItem('adminRedirected', 'true');
        window.location.href = '/admin/';
        return;
      }
    } else {
      // Clear the flag when on other admin paths
      sessionStorage.removeItem('adminRedirected');
    }
    
    console.log('Admin layout loaded at path:', currentPath);
  }, []);
  
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">
      <div className="animate-pulse text-xl">Loading admin interface...</div>
    </div>}>
      <AdminAccessGuard>{children}</AdminAccessGuard>
    </Suspense>
  );
}
