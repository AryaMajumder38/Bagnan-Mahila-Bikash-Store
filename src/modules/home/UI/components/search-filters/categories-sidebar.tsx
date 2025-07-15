import { el, fr, tr } from "date-fns/locale";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
    SheetHeader
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useState } from "react";
import { Chevron } from "react-day-picker";
import { ChevronLeft, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
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

    const [parentCategories, setParentCategories] = useState<CategoriesGetManyOutput | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<CategoriesGetManyOutput[1] | null>(null);


    const currentCategories = parentCategories ?? data ?? [];
    const handleOpenChange = (open: boolean) => {
        setSelectedCategories(null);
        setParentCategories(null);
        if (onOpenChange) {
            onOpenChange(open);
        }
    }

    const handleCategoryClick = (category: CategoriesGetManyOutput[1]) => {
        if (category.subcategories && category.subcategories.length > 0) {
            setParentCategories(category.subcategories as CategoriesGetManyOutput);
            setSelectedCategories(category);
        }else {
            if(parentCategories && selectedCategories){
                router.push(`/${selectedCategories.slug}/${category.slug}`);
            }
            else {
                if(category.slug === "all") {
                    router.push("/products");
                }else {
                    router.push(`/${category.slug}`);
                }
            }

            handleOpenChange(false);
        }
    }

    const handleBackClick = () => {
        if (parentCategories && parentCategories.length > 0) {
            setParentCategories(null);
            setSelectedCategories(null);
        } 
    }

    const backgroundColor= selectedCategories?.color || "white";

    return(
        <Sheet open={open} onOpenChange={handleOpenChange} >

           
            <SheetContent side="left" 
            className="p-0 transition-none"
            style={{backgroundColor: backgroundColor}}
            >
                <SheetHeader className="p-4 border-b">
                    <SheetTitle>Categories</SheetTitle>
                </SheetHeader>
                <ScrollArea
                className="flex flex-col overflow-y-auto h-full pb-2" >
                    {parentCategories && (
                        <button
                        onClick={handleBackClick}
                        className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium "
                        >
                            <ChevronLeftIcon className="size-4 mr-2" />
                            Back
                        </button>
                    )}
                    {currentCategories.map((category) => (
                        <button
                        key={category.slug}
                        onClick={() => handleCategoryClick(category)}
                        className="w-full text-left p-4 hover:bg-black hover:text-white flex justify-between items-center text-base font-medium cursor-pointer"
                        >
                            {category.name}
                            {category.subcategories && category.subcategories.length > 0 && (
                                <ChevronRightIcon className="size-4 " />
                            )}

                        </button>
                    ))}
                    
                    </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}