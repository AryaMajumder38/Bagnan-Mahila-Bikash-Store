import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware specifically protects admin routes with basic auth check
// Full role check is done in AdminAccessGuard component
export function middleware(request: NextRequest) {
  // Only run this middleware for admin paths
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  try {
    console.log('Admin middleware: Checking basic auth for path', request.nextUrl.pathname);
    
    // Just check if any auth token exists
    // The detailed role check will happen in the AdminAccessGuard component
    const payloadToken = request.cookies.get('payload-token');
    const funroadToken = request.cookies.get('funroad-token');
    
    if (!payloadToken && !funroadToken) {
      // No authentication token found, redirect to login
      console.log('No auth token found, redirecting to login');
      return redirectToLogin(request);
    }
    
    // Token exists, proceed to the admin page
    // The AdminAccessGuard component will handle detailed role-based permission check
    console.log('Auth token found, proceeding to admin (role check will happen in component)');
    return NextResponse.next();
    
  } catch (error) {
    console.error('Admin middleware error:', error);
    return redirectToLogin(request);
  }
}

// Helper function to redirect to login page
function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL('/sign-in', request.url);
  loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

// Helper function to redirect unauthorized users to a specific page
function redirectToUnauthorized(request: NextRequest) {
  const unauthorizedUrl = new URL('/unauthorized', request.url);
  return NextResponse.redirect(unauthorizedUrl);
}

export const config = {
  matcher: ['/admin', '/admin/:path*']
};
