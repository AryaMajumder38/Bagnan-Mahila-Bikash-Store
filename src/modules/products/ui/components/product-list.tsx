"use client"

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { use } from "react";

interface Props{
    category?:string
}

export const ProductList = ({  category ,}: Props)=> {
const trpc = useTRPC();
const {data}= useSuspenseQuery(trpc.products.getMany.queryOptions(
    {category}
));


return(
    <div>
        {JSON.stringify(data, null, 2)}
    </div>
)

}

export const ProductListSkeleton = () => {
    return (
        <div className="flex flex-col gap-4">
            Loading .....
            <div className="h-10 bg-gray-200 animate-pulse rounded-md w-full"/>
            <div className="h-10 bg-gray-200 animate-pulse rounded-md w-full"/>
            <div className="h-10 bg-gray-200 animate-pulse rounded-md w-full"/>
        </div>
    );
}