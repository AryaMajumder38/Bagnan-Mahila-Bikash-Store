
import{
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet";

import { ScrollArea } from "@radix-ui/react-scroll-area";
import Link from "next/link";
import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface NavbarItem  {
    href: string;
  children: React.ReactNode;
  isActive: boolean;
}


interface  Props {
    items: NavbarItem[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const NavbarSidebar = ({
    items,
    open,
    onOpenChange,
}: Props) => {
    const trpc = useTRPC();
    const session = useQuery(trpc.auth.session.queryOptions());
    const router = useRouter();
    const queryClient = useQueryClient();
    
    const logoutMutation = useMutation(trpc.auth.logout.mutationOptions({
        onSuccess: () => {
            queryClient.clear();
            router.push("/");
            router.refresh();
            onOpenChange(false);
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
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
            side="left"
            className=" p-0 transition-none"
            >
                <SheetHeader className="p-4">
                    <div>
                    <SheetTitle className="flex items-center">
                        Menu
                    </SheetTitle>
                    </div>
                </SheetHeader>

                <div className="border-t" />
                <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
                        {items.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium "
                                onClick={() => onOpenChange(false)}
                            >
                                {item.children}
                            </Link>
                        ))}
                        
                        <div className="border-t">
                            {session.data?.user ? (
                                <>
                                    <Link       
                                        onClick={() => onOpenChange(false)}
                                        href="/admin"
                                    >
                                        <div className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium">
                                            Dashboard
                                        </div>
                                    </Link>
                                    <Button
                                        onClick={handleLogout}
                                        disabled={logoutMutation.isPending}
                                        className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium bg-transparent border-0 rounded-none justify-start"
                                    >
                                        <LogOutIcon className="mr-2 h-4 w-4" />
                                        {logoutMutation.isPending ? "Logging out..." : "Logout"}
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link       
                                        onClick={() => onOpenChange(false)}
                                        href="/sign-in"
                                    >
                                        <div className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium">
                                            Log in
                                        </div>
                                    </Link>
                                    <Link 
                                        onClick={() => onOpenChange(false)}
                                        href="/sign-up"
                                    >
                                        <div className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium">
                                            Start Selling
                                        </div>
                                    </Link>
                                </>
                            )}
                        </div>

                    
                </ScrollArea>

            </SheetContent> 

            </Sheet>

)
};