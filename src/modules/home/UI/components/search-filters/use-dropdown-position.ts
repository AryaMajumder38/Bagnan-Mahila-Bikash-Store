import { RefObject } from "react";

export const useDropdownPosition = (
    ref: RefObject<HTMLDivElement | null > | RefObject<HTMLDivElement>,
)=> {

    const getDropdownPosition = () => {

        if (!ref.current) return {top: 0, left: 0};

        const rect= ref.current.getBoundingClientRect();
        const dropdownWidth = 240; // Width of dropdown in pixels (w-60 =15rem = 240 px )

        // Calculate the initial position
        const top = rect.bottom + window.scrollY;
        let left = rect.left + window.scrollX;

        if (left + dropdownWidth > window.innerWidth) {
            // If the dropdown exceeds the viewport width, adjust its position
            left = rect.right+ window.scrollX - dropdownWidth ; // 16px for padding
        } 

        // if left 

        if( left < 0) {
            // If the dropdown exceeds the viewport on the left, adjust its position
            left = window.innerWidth - dropdownWidth - 16; // 16px for padding
        }

        if(left < 0){
            left = 16; // Ensure left position is not negative
        }

        return {top, left};


    }

    return {getDropdownPosition}
}