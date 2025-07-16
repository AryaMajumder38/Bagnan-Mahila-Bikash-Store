"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function TestOrdersPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Sample order data for testing
  const sampleOrderData = {
    items: [
      {
        productId: "648e274e86eeab5c1b8f0c1d", // Replace with a valid product ID in your database
        quantity: 2,
        price: 450.00
      }
    ],
    subtotal: 900.00,
    tax: 45.00,
    shippingCost: 50.00,
    total: 995.00,
    customerInfo: {
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      phone: "1234567890",
      company: "Test Company"
    },
    shippingAddress: {
      address: "123 Test Street",
      apartment: "Apt 456",
      city: "Test City",
      state: "Test State",
      pinCode: "123456"
    },
    billingAddress: {
      address: "123 Test Street",
      apartment: "Apt 456",
      city: "Test City",
      state: "Test State",
      pinCode: "123456"
    },
    paymentInfo: {
      method: "cod",
      details: {}
    },
    notes: "This is a test order."
  };

  const testOrderAPI = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      console.log("Sending test order data:", sampleOrderData);
      
      const response = await fetch('/api/simple-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderData: sampleOrderData
        }),
        credentials: 'include', // Important for auth cookies
      });
      
      // First get raw response for debugging
      const responseText = await response.text();
      console.log("Raw response:", responseText);
      
      // Try to parse the JSON
      let parsedResult;
      try {
        parsedResult = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Invalid JSON response: ${responseText}`);
      }
      
      if (!response.ok) {
        throw new Error(parsedResult.error || `Error ${response.status}: ${response.statusText}`);
      }
      
      setResult(parsedResult);
    } catch (err: any) {
      console.error("Test failed:", err);
      setError(err.message || "Unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Order API Test</h1>
      
      <div className="mb-8">
        <Button 
          onClick={testOrderAPI} 
          disabled={isLoading} 
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            "Test Order API"
          )}
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="whitespace-pre-wrap font-mono text-sm">
            {error}
          </AlertDescription>
        </Alert>
      )}
      
      {result && (
        <div className="space-y-4">
          <Alert variant="default" className="bg-green-50 border-green-200">
            <AlertTitle className="text-green-800">Success!</AlertTitle>
            <AlertDescription className="text-green-700">
              Order API test completed successfully.
            </AlertDescription>
          </Alert>
          
          <div className="border rounded-md p-4 bg-muted/20">
            <h3 className="text-sm font-medium mb-2">API Response:</h3>
            <pre className="text-xs p-4 bg-black text-white rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}
      
      <div className="mt-8 border-t pt-4">
        <h3 className="text-sm font-medium mb-2">Test Payload:</h3>
        <pre className="text-xs p-4 bg-muted rounded overflow-auto">
          {JSON.stringify(sampleOrderData, null, 2)}
        </pre>
      </div>
    </div>
  );
}
