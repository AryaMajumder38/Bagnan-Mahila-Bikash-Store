import { el, fr, tr } from "date-fns/locale";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
    SheetHeader
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VisuallyHidden } from "@/components/ui/visually-hidden";

import { useState } from "react";
import { Chevron } from "react-day-picker";
import { 
    ChevronLeft, 
    ChevronLeftIcon, 
    ChevronRightIcon, 
    ShoppingBag, 
    Phone, 
    Info
} from "lucide-react";
import { useRouter } from "next/navigation";  
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { CategoriesGetManyOutput } from "@/modules/categories/types";


interface Props {
    open?: boolean;
    onOpenChange?: (open: boolean) => void; // Adjust type as needed
}



export const CategoriesSidebar = ({
    open,
    onOpenChange,
}:Props) => {

    const trpc = useTRPC();
    const { data }= useQuery(trpc.categories.getMany.queryOptions());

    const router = useRouter();
    
    // Add state to track if we're showing the initial view or categories
    const [showCategories, setShowCategories] = useState(false);
    
    // Get categories from query data
    const categories = data ?? [];
    
    const handleOpenChange = (open: boolean) => {
        // Reset to initial view when sidebar closes
        if (!open) {
            setShowCategories(false);
        }
        
        if (onOpenChange) {
            onOpenChange(open);
        }
    }
    
    // Show all categories
    const handleShowCategories = () => {
        setShowCategories(true);
    }
    
    // Go back to initial view
    const handleBack = () => {
        setShowCategories(false);
    }

    // Handle category selection
    const handleCategoryClick = (category: CategoriesGetManyOutput[1]) => {
        // Redirect to the category page
        if (category.slug === "all") {
            router.push("/products");
        } else {
            router.push(`/${category.slug}`);
        }
        
        // Close the sidebar after redirecting
        handleOpenChange(false);
    }

    const backgroundColor = "white";

    return(
        <Sheet open={open} onOpenChange={handleOpenChange} >
            <SheetContent side="left" 
            className="p-0 transition-none" 
            style={{backgroundColor: backgroundColor}}
            >
                {/* Visually hidden title for accessibility */}
                <VisuallyHidden>
                    <SheetTitle>{showCategories ? "Categories" : "Menu"}</SheetTitle>
                </VisuallyHidden>
                
                <ScrollArea
                className="flex flex-col overflow-y-auto h-full pb-2 pt-4" >
                    {showCategories ? (
                        <>
                            {/* Back button */}
                            <button
                                onClick={handleBack}
                                className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
                            >
                                <ChevronLeftIcon className="size-4 mr-2" />
                                Back
                            </button>
                            
                            {/* Categories list */}
                            {categories.map((category) => (
                                <button
                                    key={category.slug}
                                    onClick={() => handleCategoryClick(category)}
                                    className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium cursor-pointer"
                                >
                                    {category.name}
                                </button>
                            ))}
                        </>
                    ) : (
                        <>
                            {/* Initial view with Products, About Us, and Contact buttons */}
                            <button
                                onClick={handleShowCategories}
                                className="w-full text-left p-4 hover:bg-black hover:text-white flex justify-between items-center text-base font-medium cursor-pointer"
                            >
                                <div className="flex items-center">
                                    <ShoppingBag className="size-4 mr-2" />
                                    Products
                                </div>
                                <ChevronRightIcon className="size-4" />
                            </button>
                            
                            {/* About Us button */}
                            <button
                                onClick={() => {
                                    router.push('/about-us');
                                    handleOpenChange(false);
                                }}
                                className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium cursor-pointer"
                            >
                                <Info className="size-4 mr-2" />
                                About Us
                            </button>
                            
                            {/* Contact button */}
                            <button
                                onClick={() => {
                                    router.push('/contact');
                                    handleOpenChange(false);
                                }}
                                className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium cursor-pointer"
                            >
                                <Phone className="size-4 mr-2" />
                                Contact
                            </button>
                        </>
                    )}
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}