import Link from "next/link";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,

} from "@/components/ui/breadcrumb";

interface Props{
    activeCategoryName?: string | null;
    activeCategory?: string | undefined;
    activeSubCategory?: string | undefined;
    activeSubCategoryName?: string | null;
}

export const BreadcrumbNavigation = ({
    activeCategoryName,
    activeCategory,
    activeSubCategory,
    activeSubCategoryName,
}: Props) => {  
    if (!activeCategoryName && activeCategory !== "all") {
        return null; // Don't render if no category is active
    }

    return(

        <Breadcrumb>
            <BreadcrumbList>
                {activeCategory === "all" ? (
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild className="text-xl font-medium underline text-primary">
                            <Link href="/products">
                                All Products
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                ) : (
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild className="text-xl font-medium underline text-primary">
                            <Link href={`/${activeCategory}`}>
                                {activeCategoryName}
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                )}
                
                {activeSubCategoryName && (
                    <>
                        <BreadcrumbSeparator className="text-xl font-medium">
                            /
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbPage className="text-xl font-medium">
                                {activeSubCategoryName}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </>
                )}      
            </BreadcrumbList>
        </Breadcrumb>
    )



}