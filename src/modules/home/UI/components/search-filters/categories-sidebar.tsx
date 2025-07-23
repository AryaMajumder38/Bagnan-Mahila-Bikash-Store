import { el, fr, tr } from "date-fns/locale";
import {
    Sheet,
    SheetTitle,
    SheetHeader
} from "@/components/ui/sheet";
import { CustomSheetContent } from "./custom-sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { cn } from "@/lib/utils";

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

    // Match the navbar's background color exactly
    const backgroundColor = "#fafafaf6";

    // Custom CSS for positioning the sidebar directly under the navbar
    const sidebarStyles = cn(
        "p-0 transition-none border-t-0",
        "!inset-y-auto", // Override the default inset-y-0
        "!top-[var(--actual-navbar-height,_3.625rem)]", // Use actual measured navbar height
        "!h-[calc(100vh-var(--actual-navbar-height,_3.625rem))]", // Responsive height calculation
        "!z-40",         // Ensure it has sufficient z-index to appear above content
        "[&>button]:!hidden" // Hide the close button using a stronger selector
    );

    return(
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <CustomSheetContent side="left" 
            className={sidebarStyles}
            style={{backgroundColor: backgroundColor}}
            >
                {/* Visually hidden title for accessibility */}
                <VisuallyHidden>
                    <SheetTitle>{showCategories ? "Categories" : "Menu"}</SheetTitle>
                </VisuallyHidden>

                {/* Thin top border line to match navbar design */}
                <div className="h-0.5 bg-gray-200"></div>
                
                <ScrollArea
                className="flex flex-col overflow-y-auto h-full pb-2 pt-2 sm:pt-4 px-1 sm:px-0" >
                    {showCategories ? (
                        <>
                            {/* Back button */}
                            <button
                                onClick={handleBack}
                                className="w-full text-left p-3 sm:p-4 hover:bg-black hover:text-white active:bg-gray-200 flex items-center text-sm sm:text-base font-medium min-h-[44px] sm:min-h-[48px] touch-manipulation"
                            >
                                <ChevronLeftIcon className="size-3.5 sm:size-4 mr-1.5 sm:mr-2" />
                                Back
                            </button>
                            
                            {/* Categories list */}
                            {categories.map((category) => (
                                <button
                                    key={category.slug}
                                    onClick={() => handleCategoryClick(category)}
                                    className="w-full text-left p-3 sm:p-4 hover:bg-black hover:text-white active:bg-gray-200 flex items-center text-sm sm:text-base font-medium cursor-pointer min-h-[44px] sm:min-h-[48px] touch-manipulation"
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
                                className="w-full text-left p-3 sm:p-4 hover:bg-black hover:text-white active:bg-gray-200 flex justify-between items-center text-sm sm:text-base font-medium cursor-pointer min-h-[44px] sm:min-h-[48px] touch-manipulation"
                            >
                                <div className="flex items-center">
                                    <ShoppingBag className="size-3.5 sm:size-4 mr-1.5 sm:mr-2" />
                                    Products
                                </div>
                                <ChevronRightIcon className="size-3.5 sm:size-4" />
                            </button>
                            
                            {/* About Us button */}
                            <button
                                onClick={() => {
                                    router.push('/about-us');
                                    handleOpenChange(false);
                                }}
                                className="w-full text-left p-3 sm:p-4 hover:bg-black hover:text-white active:bg-gray-200 flex items-center text-sm sm:text-base font-medium cursor-pointer min-h-[44px] sm:min-h-[48px] touch-manipulation"
                            >
                                <Info className="size-3.5 sm:size-4 mr-1.5 sm:mr-2" />
                                About Us
                            </button>
                            
                            {/* Contact button */}
                            <button
                                onClick={() => {
                                    router.push('/contact');
                                    handleOpenChange(false);
                                }}
                                className="w-full text-left p-3 sm:p-4 hover:bg-black hover:text-white active:bg-gray-200 flex items-center text-sm sm:text-base font-medium cursor-pointer min-h-[44px] sm:min-h-[48px] touch-manipulation"
                            >
                                <Phone className="size-3.5 sm:size-4 mr-1.5 sm:mr-2" />
                                Contact
                            </button>
                        </>
                    )}
                </ScrollArea>
            </CustomSheetContent>
        </Sheet>
    )
}