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
import { formatPrice } from '@/lib/utils';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function OrderSuccess() {
  const params = useParams<{ id: string }>();
  const orderId = params.id;

  // Local state for handling loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [orderData, setOrderData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Simplified order fetch for this example
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Just simulate getting data without making an actual API call
        // In a real implementation, you would get this from your API
        setOrderData({
          id: orderId,
          orderNumber: `ORD-${orderId.slice(0, 8)}`,
          status: 'pending',
          total: 1250.00,
          createdAt: new Date().toISOString(),
        });
        setIsLoading(false);
      } catch (err: any) {
        console.error('Error fetching order:', err);
        setError(err.message || 'Failed to load order details');
        setIsLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
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
          <h2 className="text-xl font-semibold">Order #{orderData.orderNumber}</h2>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            {orderData.status}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Order Date</p>
            <p className="font-medium">
              {new Date(orderData.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="font-medium">{formatPrice(orderData.total)}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
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
