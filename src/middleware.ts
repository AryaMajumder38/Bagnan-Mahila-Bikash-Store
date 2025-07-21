import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware handles:
// 1. Media request debugging and redirection
// 2. Basic auth token check for admin routes (full role check happens in the layout)
export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  
  // Basic admin route protection - check if token exists
  if (url.pathname.startsWith('/admin')) {
    // Check for auth token - looking for both payload-token and funroad-token
    const payloadToken = request.cookies.get('payload-token');
    const funroadToken = request.cookies.get('funroad-token');
    
    if (!payloadToken && !funroadToken) {
      // No authentication token found, redirect to login
      console.log('No auth token found for admin access, redirecting to login');
      const loginUrl = new URL('/sign-in', request.url);
      loginUrl.searchParams.set('redirect', url.pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Allow access with token - we'll check for admin role in the layout component
    console.log('Auth token found for admin access, continuing to app');
  }
  
  // Log media request patterns for debugging
  if (url.pathname.includes('/media/') || url.pathname.includes('/api/media/')) {
    console.log(`[Media Debug] Requested: ${url.pathname}`);
    
    // If it's a request for /api/media/file/ path, redirect to /media/ path
    if (url.pathname.startsWith('/api/media/file/')) {
      const filename = url.pathname.replace('/api/media/file/', '');
      const newUrl = new URL(`/media/${filename}`, request.url);
      console.log(`[Media Debug] Redirecting: ${url.pathname} → ${newUrl.pathname}`);
      return NextResponse.redirect(newUrl);
    }
  }
  
  return NextResponse.next();
}

// Configure the middleware to run for relevant paths
export const config = {
  matcher: [
    // Handle API media paths and log other paths
    '/api/media/file/:path*',
    // Admin paths (both with and without trailing slash)
    '/admin',
    '/admin/:path*', 
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
