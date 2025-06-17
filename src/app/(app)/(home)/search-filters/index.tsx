"use client";


import { da } from "date-fns/locale";
import { SearchInput } from "./search-input";
import { Categories } from "./categories";
import { CustomCategory } from "../types";
import { use } from "react";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";



export const SearchFilters = ({
}) => {
    const trpc = useTRPC();
    const {data}= useSuspenseQuery(trpc.categories.getMany.queryOptions())
    
    return (
        <div className="px-4 lg:px-12 py-8 border flex flex-col gap-4 w-full"
        style={{backgroundColor: "#F5F5F5"}}
        >
            <SearchInput  />
            <div className="hidden lg:block">
            <Categories data={data} />
            </div>
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