"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User } from "lucide-react";

export default function ProfilePage() {
  const trpc = useTRPC();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get user profile data
  const { data: session, isLoading, refetch } = useQuery(
    trpc.auth.session.queryOptions()
  );
  
  // When data loads, set initial form values
  useState(() => {
    if (session?.user) {
      setUsername((session.user as any).username || "");
      setEmail(session.user.email || "");
    }
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id) return;
    
    try {
      setIsSubmitting(true);
      
      // Call API to update user profile
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: session.user.id,
          username,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      
      await refetch();
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error("Error updating profile", {
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }
  
  if (!session?.user) {
    return <div>Please sign in to view your profile.</div>;
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
        <p className="text-muted-foreground">
          Manage your account details and preferences.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            Account Details
          </CardTitle>
          <CardDescription>
            Your personal information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="profile-form" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                {isEditing ? (
                  <Input 
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isSubmitting}
                  />
                ) : (
                  <div className="flex items-center justify-between border rounded-md p-2 bg-muted/40">
                    <span>{(session.user as any).username}</span>
                  </div>
                )}
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <div className="flex items-center justify-between border rounded-md p-2 bg-muted/40">
                  <span>{session.user.email}</span>
                  <span className="text-xs text-muted-foreground">(Cannot be changed)</span>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          {isEditing ? (
            <>
              <Button 
                variant="ghost" 
                onClick={() => setIsEditing(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                form="profile-form"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
