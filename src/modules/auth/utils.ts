import { Value } from "@radix-ui/react-select";
import { cookies as getCookies } from "next/headers";

interface Props{
    prefix: string;
    value: string;
}

export const  generateAuthCookies= async({
    prefix,
    value,
}:Props) => {
    const   cookies = await getCookies();
    cookies.set({
        name: `${prefix}-token`,
        value: value,
        httpOnly: true,
        path: "/",
        // sameSite: "none",
        // domain:"", // TODO cross domain cookie sharing
    });
    };

export const clearAuthCookies = async (prefix: string) => {
    const cookies = await getCookies();
    const tokenCookieName = `${prefix}-token`;
    
    cookies.delete(tokenCookieName);
};