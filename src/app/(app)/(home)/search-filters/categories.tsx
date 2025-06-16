import { Category } from "@/payload-types";
import { CategoryDropdown } from "./category-dropdown";

interface Props {
    data: any; // Adjust type as needed
}

export const Categories = ({ data }: Props) => {
    return (
        <div className="realtive w-full">
            <div className="flex flex-nowrap items-center">
            {data.map((category: Category) => (
                <div key={category.id} >
                    <CategoryDropdown
                     category={category}
                     isActive={false} // Adjust logic for active state as needed
                     isNavigationHovered={false} // Adjust logic for navigation hover state as needed
                    />
                </div>
            ))} 
            </div>
        </div>
    );
}; 