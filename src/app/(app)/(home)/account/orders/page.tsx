"use client";

import { useEffect, useState } from 'react';
import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, Package, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AccountOrdersPage() {
  const router = useRouter();
  const trpc = useTRPC();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);

  // Fetch user session
  const { 
    data: session, 
    isLoading: sessionLoading 
  } = useQuery(
    trpc.auth.session.queryOptions()
  );

  // Debug logging
  useEffect(() => {
    console.log("Orders page mounted");
    console.log("Session state:", { 
      loading: sessionLoading, 
      user: session?.user ? "exists" : "none"
    });
    
    return () => console.log("Orders page unmounted");
  }, [session, sessionLoading]);

  // Handle session and fetch orders
  useEffect(() => {
    // Skip if session is still loading
    if (sessionLoading) {
      console.log("Session still loading...");
      return;
    }
    
    // Set session as checked
    setSessionChecked(true);
    
    // If we have a user, fetch orders
    if (session?.user) {
      console.log("User found, fetching orders");
      
      const fetchOrders = async () => {
        try {
          setIsLoading(true);
          setError(null);
          
          const response = await fetch('/api/orders/user', {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });
          
          console.log(`API response status: ${response.status}`);
          
          if (!response.ok) {
            let errorText = `Error ${response.status}`;
            
            try {
              const errorData = await response.json();
              errorText = errorData.error || errorText;
            } catch (e) {
              // Ignore JSON parse errors
            }
            
            console.error('Error response:', errorText);
            
            if (response.status === 401) {
              setError('Your session has expired. Please sign in again.');
            } else {
              setError(`Failed to fetch orders: ${errorText}`);
            }
            
            setOrders([]);
            setIsLoading(false);
            return;
          }
          
          const data = await response.json();
          console.log('Orders data received:', data);
          
          if (data.success && Array.isArray(data.orders)) {
            setOrders(data.orders);
          } else {
            console.log('No orders found or invalid format', data);
            setOrders([]);
          }
        } catch (err: any) {
          console.error('Error fetching orders:', err);
          setError(err.message || 'Failed to load orders');
          setOrders([]);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchOrders();
    }
  }, [session, sessionLoading]);

  // Handle redirect for unauthenticated users
  useEffect(() => {
    if (!sessionLoading && sessionChecked && !session?.user) {
      console.log("No authenticated user found, redirecting to login");
      
      // Add a small delay to prevent immediate redirect
      const timer = setTimeout(() => {
        router.push('/sign-in?redirect=/account/orders');
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [session, sessionLoading, sessionChecked, router]);

  // Handle loading state
  if (sessionLoading || isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="mb-6">
            <Skeleton className="h-[200px] w-full rounded-lg" />
          </div>
        ))}
      </div>
    );
  }
  
  // Handle error state
  if (error) {
    return (
      <div className="container max-w-4xl mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error loading orders</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="flex space-x-4">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Homepage
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Handle no orders
  if (!orders || orders.length === 0) {
    return (
      <div className="container max-w-4xl mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <Card className="bg-white text-center">
          <CardHeader>
            <CardTitle>No Orders Yet</CardTitle>
            <CardDescription>You haven't placed any orders yet.</CardDescription>
          </CardHeader>
          <CardContent className="py-8">
            <ShoppingCart className="mx-auto h-16 w-16 text-gray-400" />
          </CardContent>
          <CardFooter className="justify-center">
            <Button variant="outline" asChild>
              <Link href="/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Get status color for badge
  const getStatusColor = (status: string) => {
    // Handle undefined or null status
    if (!status) return 'bg-gray-100 text-gray-800';
    
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
      case 'canceled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order: any) => (
          <Card key={order.id || Math.random().toString(36)} className="bg-white overflow-hidden">
            <CardHeader className="bg-gray-50 border-b">
              <div className="flex flex-wrap justify-between items-center">
                <CardTitle className="text-lg">
                  Order #{order.id ? order.id.substring(0, 8) : 'Unknown'}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Unknown date'}
                  </span>
                  <Badge className={getStatusColor(order.status || 'unknown')}>
                    {order.status || 'Unknown'}
                  </Badge>
                </div>
              </div>
              <CardDescription>
                {(order.items?.length || 0)} {(order.items?.length || 0) === 1 ? 'item' : 'items'} • Total: {formatPrice(order.total || 0)}
              </CardDescription>
            </CardHeader>
            <CardContent className="py-4">
              <div className="space-y-2">
                {Array.isArray(order.items) ? order.items.slice(0, 2).map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                        <Package className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {/* Handle different possible formats of product data */}
                          {(item.product?.title || 
                            (typeof item.product === 'object' && item.product.title) || 
                            (typeof item.product === 'string' ? 'Product ' + item.product.substring(0, 6) : 'Product'))} × {item.quantity || 1}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatPrice(item.price || 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                )) : <p>No items found</p>}
                {Array.isArray(order.items) && order.items.length > 2 && (
                  <p className="text-sm text-gray-500 italic">
                    +{order.items.length - 2} more items
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t bg-gray-50">
              <Button 
                variant="link" 
                size="sm" 
                className="ml-auto"
                asChild
              >
                <Link href={`/orders/${order.id}`}>
                  View Details
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
