import { da } from "date-fns/locale";
import { SearchInput } from "./search-input";
import { Categories } from "./categories";
import { CustomCategory } from "../types";

interface Props {
    data: CustomCategory[]; // Adjust type as needed
}


export const SearchFilters = ({
    data,
}:Props) => {
    return (
        <div className="px-4 lg:px-12 py-8 border flex flex-col gap-4 w-full">
            <SearchInput data={data} />
            <div className="hidden lg:block">
            <Categories data={data} />
            </div>
        </div>
    );

}