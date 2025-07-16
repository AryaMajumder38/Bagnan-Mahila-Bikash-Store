import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config });
    const { orderData } = await req.json();
    
    // Log the received data for debugging
    console.log('API received order data:', orderData);

    if (!orderData) {
      return NextResponse.json({ 
        error: 'No order data provided' 
      }, { status: 400 });
    }

    // Get the cookie header from the request for authentication
    const cookieHeader = req.headers.get('cookie') || '';
    
    // Debug log the cookies received
    console.log("Cookie header:", cookieHeader);
    
    try {
      // Extract the token from the cookie string
      // We're looking for funroad-token or payload-token
      const tokenMatch = cookieHeader.match(/(funroad-token|payload-token)=([^;]+)/);
      const token = tokenMatch ? decodeURIComponent(tokenMatch[2]) : null;
      
      if (!token) {
        console.error("Authentication failed - no token found in cookies");
        return NextResponse.json({ 
          error: 'Authentication token not found. Please log in again.' 
        }, { status: 401 });
      }
      
      // Parse the JWT token to get the user ID
      // This is a simple approach that doesn't verify the signature
      // In production, you should use a proper JWT library
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Invalid token format');
      }
      
      const tokenPayload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
      const userId = tokenPayload.id;
      
      if (!userId) {
        console.error("Authentication failed - user ID not found in token");
        return NextResponse.json({ 
          error: 'Authentication failed. Please log in again.' 
        }, { status: 401 });
      }
      
      console.log("Authenticated user:", userId);
      
      // Create a unique order number (timestamp-based for simplicity)
      const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Now create the order with the authenticated user ID
      const createdOrder = await payload.create({
        collection: 'orders',
        data: {
          orderNumber, // Add the required orderNumber field
          user: userId, // Pass the extracted user ID
          items: orderData.items.map((item: any) => ({
            product: item.productId, // Pass just the ID directly
            quantity: item.quantity,
            price: item.price,
          })),
          subtotal: orderData.subtotal,
          tax: orderData.tax,
          shippingCost: orderData.shippingCost,
          total: orderData.total,
          customerInfo: orderData.customerInfo,
          shippingAddress: orderData.shippingAddress,
          billingAddress: orderData.billingAddress,
          paymentInfo: {
            ...orderData.paymentInfo,
            status: 'pending',
          },
          status: 'pending',
          notes: orderData.notes || '',
        },
      });

      return NextResponse.json({
        success: true,
        orderId: createdOrder.id,
        orderNumber: orderNumber,
      });
    } catch (error: any) {
      console.error('Error creating order:', error);
      return NextResponse.json({ 
        error: error.message || 'Error creating order' 
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ 
      error: error.message || 'An unexpected error occurred' 
    }, { status: 500 });
  }
}
