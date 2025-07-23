// Custom Sheet component without close button for cart
import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

// This is a custom SheetContent component that doesn't include the close button
export function CartSheetContent({
  className,
  children,
  side = "right",
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left";
}) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay
        className={cn(
          "fixed inset-0 z-40 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        )}
      />
      <SheetPrimitive.Content
        className={cn(
          "bg-background fixed z-40 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "right" &&
            "right-0 h-[calc(100vh-var(--actual-navbar-height,_3.625rem))] w-4/5 border-l sm:w-3/4 sm:max-w-sm top-[var(--actual-navbar-height,_3.625rem)] data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
          side === "left" &&
            "left-0 h-[calc(100vh-var(--actual-navbar-height,_3.625rem))] w-4/5 border-r sm:w-3/4 sm:max-w-sm top-[var(--actual-navbar-height,_3.625rem)] data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
          side === "top" &&
            "inset-x-0 top-0 h-auto border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
          side === "bottom" &&
            "inset-x-0 bottom-0 h-auto border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
          className
        )}
        {...props}
      >
        {children}
        {/* Close button is intentionally removed */}
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
}
