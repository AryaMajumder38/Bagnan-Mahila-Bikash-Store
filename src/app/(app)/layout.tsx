import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/modules/cart/context/cart-context";
import { CartDrawer } from "@/modules/cart/components/cart-drawer";
import { DirectCheckoutProvider } from "@/modules/checkout/context/direct-checkout-context";

const dmSans = DM_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Seva Wings - Bagnan Mahila Bikash Store",
  description: "Empowering women through sustainable commerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.className} antialiased`}
      >
        <TRPCReactProvider>
          <CartProvider>
            <DirectCheckoutProvider>
              {children}
              <CartDrawer />
              <Toaster />
            </DirectCheckoutProvider>
          </CartProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
