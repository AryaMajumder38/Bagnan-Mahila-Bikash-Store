import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware logs image requests for debugging purposes
// and provides fallbacks for missing images
export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  
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
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
