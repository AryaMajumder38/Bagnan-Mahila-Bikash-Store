"use client";

import { ListFilter, ListFilterIcon, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CustomCategory } from "../types";
import { Categories } from "./categories";
import { CategoriesSidebar } from "./categories-sidebar";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props{
    disabled?: boolean;
    data: CustomCategory[];
}

export const SearchInput = ({
    disabled = false,
    data
}: Props) => {
    const[isSidebarOpen, setIsSidebarOpen] = useState(false);
    return (
        <div className="flex items-center gap-2 w-full">
            <CategoriesSidebar data={data} open = {isSidebarOpen} onOpenChange={setIsSidebarOpen}/>
            <div className="relative w-full">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500"/>
                <Input className="pl-8" placeholder="Serach Products" disabled={disabled} />
            </div>
            <Button
            variant="elevated"
            className="size-12 shrink-0 flex lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
            >
                <ListFilterIcon/>
            </Button>
        </div>
    );
}