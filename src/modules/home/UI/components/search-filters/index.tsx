"use client";


import { da } from "date-fns/locale";
import { SearchInput } from "./search-input";
import { Categories } from "./categories";
import { CustomCategory } from "../../../../../app/(app)/(home)/types";
import { use } from "react";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { DEFAULT_BG_COLOR } from "@/modules/home/constant";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { BreadcrumbNavigation } from "./breadcumbs-navigation";





export const SearchFilters = ({
}) => {
    const trpc = useTRPC();
    const {data}= useSuspenseQuery(trpc.categories.getMany.queryOptions())
    
    const params= useParams();
    const categoryParam = params.category as string | undefined;
    const activeCategory = categoryParam || "all";
    const activeCategoryData  = data.find((category) => category.slug === activeCategory);

    const activeCategoryColor = activeCategoryData?.color || DEFAULT_BG_COLOR ; // Default color if not found
    const activeCategoryName = activeCategoryData?.name || null; // Default name if not found

    const activeSubCategory = params.subcategory as string | undefined;
    const activeSubCategoryName = activeCategoryData?.subcategories?.find(
        (subcategory) => subcategory.slug === activeSubCategory
    )?.name || null; // Default name if not found

    return (
        <div className="px-4 lg:px-12 py-8 border flex flex-col gap-4 w-full"
        style={{backgroundColor: activeCategoryColor}}
        >
            <SearchInput  />
            <div className="hidden lg:block">
            <Categories data={data} />
            </div>
            <BreadcrumbNavigation 
                activeCategoryName={activeCategoryName}
                activeCategory={activeCategory}
                activeSubCategory={activeSubCategory}
                activeSubCategoryName={activeSubCategoryName}
            />
        </div>
    );

}

export const SearchFiltersLoading = () => {
    return (
        <div className="px-4 lg:px-12 py-8 border flex flex-col gap-4 w-full"
        style={{backgroundColor: "#F5F5F5"}}
        >
            <SearchInput  disabled />
            <div className="hidden lg:block">
                <div className="h-10"/>
            </div>
        </div>
    );
}