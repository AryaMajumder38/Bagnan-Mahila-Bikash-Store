import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';

export async function GET(req: NextRequest) {
  try {
    console.log("API: Starting orders fetch");
    // Initialize Payload
    const payload = await getPayload({ config });
    console.log("API: Payload initialized successfully");
    
    // Get the headers from the request
    const headers = req.headers;
    
    // Authenticate using Payload's built-in auth method
    try {
      const result = await payload.auth({ headers } as any);
      const user = result.user;
      
      if (!user) {
        console.error("API: Authentication failed - no user found");
        return NextResponse.json({ 
          error: 'Authentication failed. Please log in again.' 
        }, { status: 401 });
      }
      
      console.log("API: Authenticated user:", user.id);
      
      // Try to find orders for this user
      console.log("API: Searching orders for user", user.id);
      // Try with direct user ID first (most likely format)
      let orders = await payload.find({
        collection: 'orders',
        where: {
          user: {
            equals: user.id,
          },
        },
        sort: '-createdAt',
        depth: 1,
      });
      
      // Try alternate query formats if no orders found
      if (orders.docs.length === 0) {
        // Try different field formats that might exist in the schema
        console.log("API: Trying alternate query formats");
        try {
          // Just as a fallback - try a broader search
          orders = await payload.find({
            collection: 'orders',
            depth: 1,
            sort: '-createdAt',
            limit: 20,
          });
          
          // Filter results manually to only include orders for this user
          if (orders.docs.length > 0) {
            orders.docs = orders.docs.filter(order => {
              // Check if order belongs to current user based on various possible formats
              if (!order.user) return false;
              
              // If user is a string ID
              if (typeof order.user === 'string') {
                return order.user === user.id;
              }
              
              // If user is an object with an id field
              if (typeof order.user === 'object' && order.user !== null) {
                // @ts-ignore - handle potential nested object structure
                return order.user.id === user.id || order.user.value === user.id;
              }
              
              return false;
            });
          }
        } catch (err) {
          console.log("API: Alternative query error:", err);
        }
      }
      
      console.log(`API: Found ${orders.docs.length} orders for user ${user.id}`);
      
      return NextResponse.json({
        success: true,
        orders: orders.docs,
      });
    } catch (authError: any) {
      console.error('API: Authentication error:', authError);
      return NextResponse.json({ 
        error: authError.message || 'Authentication error' 
      }, { status: 401 });
    }
  } catch (error: any) {
    console.error('API: Error fetching user orders:', error);
    return NextResponse.json({ 
      error: error.message || 'An unexpected error occurred' 
    }, { status: 500 });
  }
}
