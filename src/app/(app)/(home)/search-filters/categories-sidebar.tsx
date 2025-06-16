import { el, fr } from "date-fns/locale";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
    SheetHeader
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CustomCategory } from "../types";
import { useState } from "react";
import { Chevron } from "react-day-picker";
import { ChevronLeft, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";  

interface Props {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    data: CustomCategory[]; // Adjust type as needed
}



export const CategoriesSidebar = ({
    open,
    onOpenChange,
    data
}:Props) => {
    const router = useRouter();

    const [parentCategories, setParentCategories] = useState<CustomCategory[] | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<CustomCategory | null>(null);


    const currentCategories = parentCategories ?? data ?? [];
    const handleOpenChange = (open: boolean) => {
        setSelectedCategories(null);
        setParentCategories(null);
        if (onOpenChange) {
            onOpenChange(open);
        }
    }

    const handleCategoryClick = (category: CustomCategory) => {
        if (category.subcategories && category.subcategories.length > 0) {
            setParentCategories(category.subcategories as CustomCategory[]);
            setSelectedCategories(category);
        }else {
            if(parentCategories && selectedCategories){
                router.push(`/${selectedCategories.slug}/${category.slug}`);
            }
            else {
                if(category.slug === "all") {
                    router.push("/");
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