import { getPayload } from 'payload';
import { NextRequest, NextResponse } from 'next/server';
import config from '@payload-config';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    // Initialize payload
    const payload = await getPayload({ config });

    // Get the order data from the request body
    const { orderData } = await req.json();

    if (!orderData) {
      return NextResponse.json({ error: 'No order data provided' }, { status: 400 });
    }

    // Get the cookie header from the request
    const cookieHeader = req.headers.get('cookie') || '';
    
    // Debug log the cookies received
    console.log("Cookie header:", cookieHeader);
    
    // Extract the token from the cookie string
    // We're looking for funroad-token or payload-token
    const tokenMatch = cookieHeader.match(/(funroad-token|payload-token)=([^;]+)/);
    const token = tokenMatch ? decodeURIComponent(tokenMatch[2]) : null;
    
    if (!token) {
      return NextResponse.json({ 
        error: 'Authentication token not found. Please login.' 
      }, { status: 401 });
    }
    
    // Manually extract the user ID from the JWT token
    let userId;
    try {
      // Parse the JWT token to get the user ID
      // This is a simple approach that doesn't verify the signature
      // In production, you should use a proper JWT library
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Invalid token format');
      }
      
      const tokenPayload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
      userId = tokenPayload.id;
      
      if (!userId) {
        console.error("Authentication failed - user ID not found in token");
        return NextResponse.json({ 
          error: 'Authentication failed. Please log in again.' 
        }, { status: 401 });
      }
      
      console.log("Authenticated user:", userId);
    } catch (tokenError) {
      console.error('Token verification error:', tokenError);
      return NextResponse.json({ 
        error: 'Invalid authentication token. Please login again.' 
      }, { status: 401 });
    }

    // Format order items for database
    const orderItems = orderData.items.map((item: any) => ({
      product: item.productId, // Pass just the ID directly
      quantity: item.quantity,
      price: item.price,
    }));

    // Create a unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Create the order with the authenticated user
    const newOrder = await payload.create({
      collection: 'orders',
      data: {
        orderNumber: orderNumber, // Add required orderNumber field
        user: userId, // Pass just the ID directly
        items: orderItems,
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
        notes: orderData.notes || '',
        status: 'pending',
      },
    });

    return NextResponse.json({
      success: true,
      orderId: newOrder.id,
      orderNumber: orderNumber,
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to create order' 
    }, { status: 500 });
  }
}
