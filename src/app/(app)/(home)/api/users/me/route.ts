import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';

export async function GET(req: NextRequest) {
  try {
    console.log("API: Fetching user information");
    // Initialize Payload
    const payload = await getPayload({ config });
    console.log("API: Payload initialized");
    
    // Get the headers from the request
    const headers = req.headers;
    
    try {
      // Get user information
      const result = await payload.auth({ headers } as any);
      console.log("API: Auth check completed");
      
      if (!result.user) {
        console.log("API: No authenticated user found");
        return NextResponse.json({ 
          user: null, 
          message: 'Not authenticated' 
        }, { status: 401 });
      }
      
      console.log(`API: Found authenticated user: ${result.user.id}`);
      
      return NextResponse.json({
        user: result.user,
        message: 'Authentication successful'
      });
      
    } catch (authError) {
      console.error("API: Auth error:", authError);
      return NextResponse.json({ 
        error: 'Authentication failed',
        details: String(authError)
      }, { status: 401 });
    }
    
  } catch (error) {
    console.error("API: Server error:", error);
    return NextResponse.json({ 
      error: 'Server error',
      details: String(error)
    }, { status: 500 });
  }
}
