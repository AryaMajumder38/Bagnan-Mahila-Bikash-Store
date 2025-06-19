"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const LogoutButton = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  
  const logoutMutation = useMutation(trpc.auth.logout.mutationOptions({
    onSuccess: () => {
      // Clear all queries to reset the session state
      queryClient.clear();
      // Redirect to home page
      router.push("/");
      router.refresh();
      toast.success("Logged out successfully");
    },
    onError: (error: any) => {
      toast.error("Failed to logout");
      console.error("Logout error:", error);
    },
  }));

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <Button
      onClick={handleLogout}
      disabled={logoutMutation.isPending}
      className="border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none bg-black text-white hover:bg-red-400 hover:text-black transition-colors text-lg"
    >
      {logoutMutation.isPending ? (
        "Logging out..."
      ) : (
        <>
          <LogOutIcon className="mr-2 h-4 w-4" />
          Logout
        </>
      )}
    </Button>
  );
};
