import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload.config';

export async function GET(req: Request) {
  try {
    ("API /users/me: Processing request");
    // Initialize Payload
    const payload = await getPayload({ config });
    
    // Get the cookie header from the request for authentication
    const cookieHeader = req.headers.get('cookie') || '';
    ("API /users/me: Cookie header exists:", !!cookieHeader);
    
    // Get the current user from the request
    const { user } = await payload.auth({
      // Cast headers to any to bypass TypeScript checks
      headers: req.headers as any
    });
    
    // If no user is found, return a 401 unauthorized status
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Not authenticated' 
        }, 
        { status: 401 }
      );
    }
    
    ("API /users/me: User authenticated:", user.id);
    ("API /users/me: User roles:", (user as any).roles || []);
    
    // Return the user data with cache control headers
    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          roles: (user as any).roles || [],
        },
      },
      {
        headers: {
          // Add cache control headers to prevent caching
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      }
    );
  } catch (error) {
    console.error('Error getting current user:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Authentication error' 
      }, 
      { status: 500 }
    );
  }
}
