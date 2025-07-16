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

export default function AccountOrdersPage() {
  const router = useRouter();
  const trpc = useTRPC();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user session
  const { data: session, isLoading: sessionLoading } = useQuery(
    trpc.auth.session.queryOptions()
  );
  
  // Fetch orders using fetch API instead of TRPC query
  useEffect(() => {
    const fetchOrders = async () => {
      if (!session?.user) return;
      
      try {
        setIsLoading(true);
        const response = await fetch('/api/trpc/orders.getUserOrders', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        const data = await response.json();
        if (data.result && data.result.data) {
          setOrders(data.result.data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchOrders();
    } else if (!sessionLoading) {
      setIsLoading(false);
    }
  }, [session, sessionLoading]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!sessionLoading && !session?.user) {
      router.push('/sign-in?redirect=/account/orders');
    }
  }, [session, sessionLoading, router]);

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
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order: any) => (
          <Card key={order.id} className="bg-white overflow-hidden">
            <CardHeader className="bg-gray-50 border-b">
              <div className="flex flex-wrap justify-between items-center">
                <CardTitle className="text-lg">
                  Order #{order.id.substring(0, 8)}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
              </div>
              <CardDescription>
                {order.items.length} {order.items.length === 1 ? 'item' : 'items'} • Total: {formatPrice(order.total)}
              </CardDescription>
            </CardHeader>
            <CardContent className="py-4">
              <div className="space-y-2">
                {order.items.slice(0, 2).map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                        <Package className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {item.product?.title || 'Product'} × {item.quantity}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {order.items.length > 2 && (
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
