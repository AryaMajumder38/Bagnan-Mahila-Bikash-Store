"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { useCart } from "@/modules/cart/context/cart-context";
import { useDirectCheckout } from "@/modules/checkout/context/direct-checkout-context";

// Define form schema with Zod
const checkoutSchema = z.object({
  // Personal information
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  company: z.string().optional(),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  
  // Shipping address
  shippingAddress: z.string().min(5, { message: "Address must be at least 5 characters" }),
  shippingApartment: z.string().optional(),
  shippingCity: z.string().min(2, { message: "City must be at least 2 characters" }),
  shippingState: z.string().min(2, { message: "State must be at least 2 characters" }),
  shippingPinCode: z.string().min(6, { message: "Please enter a valid PIN code" }),
  
  // Billing address
  sameAsShipping: z.boolean().default(true),
  billingAddress: z.string().optional(),
  billingApartment: z.string().optional(),
  billingCity: z.string().optional(),
  billingState: z.string().optional(),
  billingPinCode: z.string().optional(),
});

// Conditionally require billing fields if sameAsShipping is false
const conditionalCheckoutSchema = z.discriminatedUnion("sameAsShipping", [
  z.object({
    sameAsShipping: z.literal(true),
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    company: z.string().optional(),
    phone: z.string().min(10),
    email: z.string().email(),
    shippingAddress: z.string().min(5),
    shippingApartment: z.string().optional(),
    shippingCity: z.string().min(2),
    shippingState: z.string().min(2),
    shippingPinCode: z.string().min(6),
    billingAddress: z.string().optional(),
    billingApartment: z.string().optional(),
    billingCity: z.string().optional(),
    billingState: z.string().optional(),
    billingPinCode: z.string().optional(),
  }),
  z.object({
    sameAsShipping: z.literal(false),
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    company: z.string().optional(),
    phone: z.string().min(10),
    email: z.string().email(),
    shippingAddress: z.string().min(5),
    shippingApartment: z.string().optional(),
    shippingCity: z.string().min(2),
    shippingState: z.string().min(2),
    shippingPinCode: z.string().min(6),
    billingAddress: z.string().min(5, { message: "Address must be at least 5 characters" }),
    billingApartment: z.string().optional(),
    billingCity: z.string().min(2, { message: "City must be at least 2 characters" }),
    billingState: z.string().min(2, { message: "State must be at least 2 characters" }),
    billingPinCode: z.string().min(6, { message: "Please enter a valid PIN code" }),
  })
]);

type CheckoutFormValues = z.infer<typeof conditionalCheckoutSchema>;

interface CheckoutFormProps {
  items: Array<{
    product: any & {
      selectedVariant?: {
        name: string;
        price: number;
        stock: number;
      } | null;
    };
    quantity: number;
  }>;
  total: number;
}

export function CheckoutForm({ items, total }: CheckoutFormProps) {
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { clearCart } = useCart();
  const { clearDirectCheckoutItem } = useDirectCheckout();
  const router = useRouter();
  const trpc = useTRPC();

  // Initialize form with react-hook-form
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(conditionalCheckoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      company: "",
      phone: "",
      email: "",
      shippingAddress: "",
      shippingApartment: "",
      shippingCity: "",
      shippingState: "",
      shippingPinCode: "",
      sameAsShipping: true,
      billingAddress: "",
      billingApartment: "",
      billingCity: "",
      billingState: "",
      billingPinCode: "",
    },
  });

  const handleSubmit = async (values: CheckoutFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Calculate subtotal, tax, and shipping costs
      const subtotal = items.reduce((sum, item) => {
        const price = item.product.selectedVariant?.price || item.product.price || 0;
        return sum + (price * item.quantity);
      }, 0);
      const tax = subtotal * 0.05; // 5% tax
      const shippingCost = subtotal > 1000 ? 0 : 100; // Free shipping for orders over ₹1000
      
      // Format items for API
      const orderItems = items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.selectedVariant?.price || item.product.price || 0,
        variantName: item.product.selectedVariant?.name || null,
      }));
      
      // Format billing address based on sameAsShipping
      const billingAddress = values.sameAsShipping
        ? { sameAsShipping: true }
        : {
            sameAsShipping: false,
            address: values.billingAddress || "",
            apartment: values.billingApartment,
            city: values.billingCity || "",
            state: values.billingState || "",
            pinCode: values.billingPinCode || "",
          };
      
      // Create order data
      const orderData = {
        items: orderItems,
        subtotal,
        tax,
        shippingCost,
        total: subtotal + tax + shippingCost,
        customerInfo: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          company: values.company || "",
        },
        shippingAddress: {
          address: values.shippingAddress,
          apartment: values.shippingApartment || "",
          city: values.shippingCity,
          state: values.shippingState,
          pinCode: values.shippingPinCode,
        },
        billingAddress,
        paymentInfo: {
          method: "cod", // Default to Cash on Delivery
        },
        notes: "", // Optional order notes
      };
      
      console.log("Submitting order data:", orderData);
      
      // Use our simplified API endpoint
      const response = await fetch('/api/simple-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderData
        }),
        credentials: 'include', // Important! This ensures cookies are sent with the request
      });
      
      // First get the response text for debugging
      const responseText = await response.text();
      console.log("Raw response:", responseText);
      
      // Try to parse the JSON
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse response as JSON:", e);
        throw new Error("Server returned invalid JSON response");
      }
      
      if (!response.ok) {
        console.error("Failed response:", result);
        throw new Error(result.error || `Server returned ${response.status}: ${response.statusText}`);
      }
      
      console.log("Order creation result:", result);
      
      if (result.success) {
        // Clear cart and direct checkout item
        clearCart();
        clearDirectCheckoutItem();
        
        // Show success message
        toast.success("Order placed successfully!", {
          description: `Order #${result.orderNumber || result.orderId} has been received.`,
        });
        
        // Redirect to order confirmation page
        router.push(`/orders/${result.orderId}`);
      } else {
        throw new Error(result.error || 'Failed to create order');
      }
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast.error("Failed to place order", {
        description: error.message || "Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form id="checkout-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* Personal Information Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="johndoe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Company Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <Separator />
        
        {/* Shipping Address Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
          <FormField
            control={form.control}
            name="shippingAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street Address *</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="shippingApartment"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Apartment, Suite, etc. (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Apt 4B" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <FormField
              control={form.control}
              name="shippingCity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City *</FormLabel>
                  <FormControl>
                    <Input placeholder="City" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shippingState"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State/Province *</FormLabel>
                  <FormControl>
                    <Input placeholder="State" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shippingPinCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PIN Code *</FormLabel>
                  <FormControl>
                    <Input placeholder="123456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <Separator />
        
        {/* Billing Address Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Billing Address</h2>
          <div className="flex items-center space-x-2 mb-6">
            <FormField
              control={form.control}
              name="sameAsShipping"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2">
                  <FormControl>
                    <Checkbox 
                      checked={field.value} 
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        setSameAsShipping(!!checked);
                      }} 
                    />
                  </FormControl>
                  <FormLabel className="cursor-pointer">Same as shipping address</FormLabel>
                </FormItem>
              )}
            />
          </div>
          
          {!sameAsShipping && (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="billingAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address *</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="billingApartment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apartment, Suite, etc. (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Apt 4B" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="billingCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City *</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="billingState"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State/Province *</FormLabel>
                      <FormControl>
                        <Input placeholder="State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="billingPinCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PIN Code *</FormLabel>
                      <FormControl>
                        <Input placeholder="123456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}
        </div>
      </form>
    </Form>
  );
}
