import { getPayload } from "payload";
import config from "@payload-config";
import { NextRequest, NextResponse } from "next/server";

// Use type assertions to work around TypeScript issues
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const orderData = body.orderData;
    
    console.log("API received order data:", orderData);

    if (!orderData) {
      return NextResponse.json(
        { error: "Missing order data" },
        { status: 400 }
      );
    }

    // Initialize Payload
    const payload = await getPayload({ config });
    
    // For Next.js App Router, we need to handle auth differently
    // Let's create a more complete request object
    const cookieHeader = request.headers.get('cookie') || '';

    // Create a complete request object that Payload expects
    const payloadRequest = {
      headers: {
        'cookie': cookieHeader,
        'user-agent': request.headers.get('user-agent') || '',
        'host': request.headers.get('host') || '',
      },
      cookies: {},
      method: 'POST',
      url: request.url,
      // Add minimal required fields
      get: () => null,
      ip: '127.0.0.1',
      body: body,
    };
    
    // Let's use our constructed request object for authentication
    let authResult;
    try {
      // Cast to any to bypass TypeScript checks
      authResult = await (payload as any).auth({
        req: payloadRequest
      });
    } catch (authError: any) {
      console.error("Authentication error:", authError);
      return NextResponse.json(
        { error: "Authentication failed: " + (authError.message || "Unknown error") },
        { status: 401 }
      );
    }
    
    if (!authResult.user) {
      return NextResponse.json(
        { error: "Unauthorized: You must be logged in to create an order" },
        { status: 401 }
      );
    }
    
    // Verify all products exist first
    for (const item of orderData.items) {
      const product = await (payload as any).findByID({
        collection: 'products',
        id: item.productId,
      });

      if (!product) {
        return NextResponse.json(
          { error: `Product with ID ${item.productId} not found` },
          { status: 404 }
        );
      }
    }

    // Format items for database - no type checking
    const orderItems = orderData.items.map((item: any) => ({
      product: {
        relationTo: 'products',
        value: item.productId,
      },
      quantity: item.quantity,
      price: item.price,
    }));

    // Create the order with type assertion to bypass TypeScript checks
    try {
      const createData = {
        collection: 'orders',
        data: {
          user: {
            relationTo: 'users',
            value: authResult.user.id,
          },
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
      };

      // Use type assertion to bypass TypeScript checks
      const newOrder = await (payload as any).create(createData);

      return NextResponse.json({
        success: true,
        orderId: newOrder.id,
        orderNumber: newOrder.id,
      });
    } catch (createError: any) {
      console.error("Failed to create order:", createError);
      return NextResponse.json(
        { 
          error: "Failed to create order in database", 
          details: createError.message 
        },
        { status: 500 }
      );
    }
  } catch (err: any) {
    console.error('Error processing order creation:', err);
    return NextResponse.json(
      { error: err.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
