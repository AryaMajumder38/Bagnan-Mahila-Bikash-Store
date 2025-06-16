"use client";

import { CategoryDropdown } from "./category-dropdown";
import { CustomCategory } from "../types";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ListFilterIcon } from "lucide-react";
import { CategoriesSidebar } from "./categories-sidebar";

interface Props {
    data: CustomCategory[]; // Adjust type as needed
}

export const Categories = ({ data }: Props) => {
    const conatainerRef = useRef<HTMLDivElement>(null);
    const measureRef = useRef<HTMLDivElement>(null);
    const viewAllRef = useRef<HTMLDivElement>(null);

    const [visibleCount, setVisibleCount] = useState(data.length);
    const [isAnyHovered, setIsAnyHovered] = useState(false);
    //const [isAnyHovered, setIsAnyHovered] = useState(data.length);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const activeCategory= "all" ;

    const activeCategoryIndex = data.findIndex((cat) => cat.slug === activeCategory);
    const isActiveCategoryIndex = activeCategoryIndex >= visibleCount  && activeCategoryIndex !== -1;
    useEffect(() => {
        const calculateVisible = () => {
            if (!conatainerRef.current || !measureRef.current || !viewAllRef.current) return;

            const containerWidth = conatainerRef.current.offsetWidth;
            const viewAllWidth = viewAllRef.current.offsetWidth;
            const availableWidth = containerWidth - viewAllWidth;


            // Calculate how many categories can fit in the container
            const items = Array.from(conatainerRef.current.children);
            let totalWidth = 0;
            let visible = 0;
            
            for (const item of items) {
                const width = item.getBoundingClientRect().width;
                
                if (totalWidth + width > availableWidth) break;
                    totalWidth += width;
                    visible++;
                
                }

            setVisibleCount(visible);
        }

        const resiveObserver = new ResizeObserver(calculateVisible);
        resiveObserver.observe(conatainerRef.current!);

        return () => resiveObserver.disconnect(); 
    }, [data.length]);


    return (
        
        
        <div className="realtive w-full">

            <CategoriesSidebar open = {isSidebarOpen} onOpenChange={setIsSidebarOpen} data={data}/>

            <div 
                ref={measureRef}
                className="absolute opacity-0 pointer-events-none flex"
                style={{ position: "fixed", top:-9999, left: -9999 }}
            >
            {data.map((category) => (
                <div key={category.id} >
                    <CategoryDropdown
                     category={category}
                     isActive={activeCategory === category.slug} 
                     isNavigationHovered={false} // Adjust logic for navigation hover state as needed
                    />
                </div>
            ))} 
            </div>
            <div 
            ref={conatainerRef}
            className="flex flex-nowrap items-center"
            onMouseEnter={() => setIsAnyHovered(true)}
            onMouseLeave={() => setIsAnyHovered(false)}
            >
            {data.slice(0,visibleCount).map((category) => (
                <div key={category.id} >
                    <CategoryDropdown
                     category={category}
                     isActive={activeCategory === category.slug} 
                     isNavigationHovered={isAnyHovered} // Adjust logic for navigation hover state as needed
                    />
                </div>
            ))} 
            <div ref={viewAllRef}
            className="shrink-0"
            >
                <Button
                onClick={() => setIsSidebarOpen(true)}
                className={
                    cn("h-11 px-4 bg-transparent border-transparent rounded-full  hover:bg-whithe hover:border-primary text-black",
                    isActiveCategoryIndex && !isAnyHovered && "bg-white border-primary")
                }
                >
                    View All
                    <ListFilterIcon className="ml-2"/>
                </Button>

            </div>
            </div>
        </div>
    );
}; 