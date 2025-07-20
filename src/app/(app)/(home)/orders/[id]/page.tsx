"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckCircle2, 
  ArrowLeftCircle, 
  PackageCheck 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';
import { formatPrice } from '@/lib/utils';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function OrderSuccess() {
  const params = useParams<{ id: string }>();
  const orderId = params.id;
  const trpc = useTRPC();
  
  // Local state for handling loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [orderData, setOrderData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch order data using direct API call
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      
      try {
        setIsLoading(true);
        console.log('Fetching order with ID:', orderId);
        
        // Using fetch directly to avoid tRPC typing issues
        const response = await fetch(`/api/trpc/orders.getOne?batch=1&input=${encodeURIComponent(JSON.stringify({ "0": { json: { id: orderId } } }))}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        const data = await response.json();
        console.log('Order API response:', data);
        
        if (data[0]?.result?.data) {
          // Extract the order result data
          const orderResult = data[0].result.data;
          
          // The actual order data is nested inside a 'json' property
          let actualOrderData = orderResult.json || orderResult;
          
          console.log('Order data structure:', {
            hasJson: !!orderResult.json,
            topLevelKeys: Object.keys(orderResult)
          });
          
          // Apply new business rules to the order data
          // If subtotal > 300, shipping is free (0), otherwise shipping is 50
          // Tax is not included in the total
          if (actualOrderData.subtotal) {
            const updatedShippingCost = actualOrderData.subtotal >= 300 ? 0 : 50;
            const updatedTotal = actualOrderData.subtotal + updatedShippingCost;
            
            // Create a modified order data object with the new rules applied
            actualOrderData = {
              ...actualOrderData,
              shippingCost: updatedShippingCost,
              // Store original total as displayTotal for reference
              displayTotal: actualOrderData.total,
              total: updatedTotal
            };
            
            console.log('Applied new pricing rules:');
            console.log('- Original total:', actualOrderData.displayTotal);
            console.log('- Updated total:', updatedTotal);
            console.log('- Subtotal:', actualOrderData.subtotal);
            console.log('- Shipping cost:', updatedShippingCost);
            console.log('- Tax (not applied):', actualOrderData.tax);
          }
          
          // Log all properties to see what's available
          console.log('Order data keys:', Object.keys(actualOrderData));
          console.log('Order total value type:', typeof actualOrderData.total);
          console.log('Order total value:', actualOrderData.total);
          console.log('Order date value type:', typeof actualOrderData.createdAt);
          console.log('Order date value:', actualOrderData.createdAt);
          
          setOrderData(actualOrderData);
        } else {
          console.error('Order data not found in response');
          setError('Order data not found');
        }
      } catch (err: any) {
        console.error('Error fetching order:', err);
        setError(err.message || 'Failed to load order details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-10 px-4">
        <div className="space-y-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto py-10 px-4">
        <Alert variant="destructive">
          <AlertTitle>Error loading order</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-6">
          <Link href="/">
            <Button>
              <ArrowLeftCircle className="mr-2 h-4 w-4" />
              Return to Homepage
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="container max-w-4xl mx-auto py-10 px-4">
        <Alert>
          <AlertTitle>Order Not Found</AlertTitle>
          <AlertDescription>The requested order could not be found.</AlertDescription>
        </Alert>
        <div className="mt-6">
          <Link href="/">
            <Button>
              <ArrowLeftCircle className="mr-2 h-4 w-4" />
              Return to Homepage
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <div className="flex flex-col items-center text-center mb-10">
        <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Order Successfully Placed!</h1>
        <p className="text-lg text-muted-foreground">
          Thank you for your order. We are processing it now.
        </p>
      </div>

      <div className="border rounded-lg p-6 mb-8 bg-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            Order #{orderData.orderNumber || orderData.id || 'Unknown'}
          </h2>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            {orderData.status || 'Processing'}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Order Date</p>
            <p className="font-medium">
              {orderData.createdAt 
                ? new Date(orderData.createdAt).toLocaleDateString() 
                : 'Unknown date'}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="font-medium">
              {typeof orderData.total === 'number' 
                ? formatPrice(orderData.total) 
                : 'Invalid amount'}
            </p>
          </div>
        </div>
        
        {/* Shipping policy info banner */}
        <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100 text-blue-800 text-sm">
          <p className="font-medium">Shipping Policy</p>
          <p>Orders over ₹300 qualify for free shipping. Orders under ₹300 have a shipping charge of ₹50.</p>
        </div>

        {/* Product details */}
        {orderData.items && orderData.items.length > 0 && (
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-medium mb-3">Order Items</h3>
            <div className="space-y-4">
              {orderData.items.map((item: any, index: number) => (
                <div key={item.id || index} className="flex items-start gap-3 p-3 rounded bg-muted/50">
                  {item.product?.image && (
                    <div className="w-16 h-16 bg-white rounded overflow-hidden">
                      <img 
                        src={item.product.image.thumbnailURL || item.product.image.url} 
                        alt={item.product.name || 'Product'} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{item.product?.name || 'Product'}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Order Summary */}
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-medium mb-3">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(orderData.subtotal)}</span>
            </div>
            
            {/* Shipping only shown if applicable based on new business rules */}
            {orderData.subtotal && orderData.subtotal < 300 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{formatPrice(50)}</span>
              </div>
            )}
            
            {orderData.subtotal && orderData.subtotal >= 300 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
            )}
            
            {/* Calculate the actual total based on business rules */}
            <div className="flex justify-between font-medium text-lg pt-2 border-t">
              <span>Total</span>
              <span>
                {formatPrice(
                  orderData.subtotal + 
                  (orderData.subtotal < 300 ? 50 : 0)
                )}
              </span>
            </div>
            
            {/* Show original order total for reference if different */}
            {orderData.total !== (orderData.subtotal + (orderData.subtotal < 300 ? 50 : 0)) && (
              <div className="text-xs text-muted-foreground text-right mt-1">
                * Total has been recalculated based on current pricing policy
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipping Information */}
          <div>
            <h3 className="text-lg font-medium mb-2">Shipping Information</h3>
            <div className="p-3 bg-muted/50 rounded">
              <p className="font-medium">
                {orderData.customerInfo?.firstName} {orderData.customerInfo?.lastName}
              </p>
              <p className="text-sm">{orderData.shippingAddress?.address}</p>
              {orderData.shippingAddress?.apartment && (
                <p className="text-sm">{orderData.shippingAddress.apartment}</p>
              )}
              <p className="text-sm">
                {orderData.shippingAddress?.city}, {orderData.shippingAddress?.state} {orderData.shippingAddress?.pinCode}
              </p>
              <p className="text-sm mt-2">{orderData.customerInfo?.phone}</p>
              <p className="text-sm">{orderData.customerInfo?.email}</p>
            </div>
          </div>
          
          {/* Payment Information */}
          <div>
            <h3 className="text-lg font-medium mb-2">Payment Details</h3>
            <div className="p-3 bg-muted/50 rounded">
              <p className="font-medium">
                Method: {orderData.paymentInfo?.method === 'cod' ? 'Cash on Delivery' : orderData.paymentInfo?.method}
              </p>
              <p className="text-sm">
                Status: {orderData.paymentInfo?.status || 'Processing'}
              </p>
              {orderData.paymentInfo?.transactionId && (
                <p className="text-sm mt-2">Transaction ID: {orderData.paymentInfo.transactionId}</p>
              )}
              <p className="text-sm mt-3 text-green-600">
                * No tax is applied to your order
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center pt-4 border-t mt-6">
          <div className="flex items-center text-sm text-muted-foreground">
            <PackageCheck className="mr-2 h-4 w-4" />
            We'll send shipping updates to your email
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/">
          <Button variant="outline">
            <ArrowLeftCircle className="mr-2 h-4 w-4" />
            Continue Shopping
          </Button>
        </Link>
        <Link href="/account/orders">
          <Button>
            View All Orders
          </Button>
        </Link>
      </div>
    </div>
  );
}
