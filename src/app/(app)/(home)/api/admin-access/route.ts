import { NextResponse, NextRequest } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';

export async function GET(req: NextRequest) {
  try {
    // Initialize Payload
    const payload = await getPayload({ config });
    
    // Get auth information
    const { user } = await payload.auth({
      headers: req.headers as any,
    });
    
    if (!user) {
      return NextResponse.json({
        authenticated: false,
        message: 'Not authenticated',
      }, { status: 401 });
    }
    
    // Determine if user is admin
    // We need to use type assertion since roles isn't known in the type definition
    const roles = (user as any).roles || [];
    const isAdmin = Array.isArray(roles) && roles.includes('super-admin');
    
    return NextResponse.json({
      authenticated: true,
      isAdmin: isAdmin,
      user: {
        id: user.id,
        email: user.email,
        roles: roles
      },
      message: isAdmin ? 'User has admin access' : 'User is authenticated but not an admin'
    });
    
  } catch (error: any) {
    console.error('Admin access check error:', error);
    return NextResponse.json({
      authenticated: false,
      error: error.message || 'Unknown error',
      message: 'Error checking admin access'
    }, { status: 500 });
  }
}
