
import{
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet";

import { ScrollArea } from "@radix-ui/react-scroll-area";
import Link from "next/link";

interface NavbarItem  {
    href: string;
    children: React.ReactNode;
}


interface  Props {
    items: NavbarItem[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const NavbarSidebar = ({
    items,
    open,
    onOpenChange,
}: Props) => {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
            side="left"
            className=" p-0 transition-none"
            >
                <SheetHeader className="p-4">
                    <div>
                    <SheetTitle className="flex items-center">
                        Menu
                    </SheetTitle>
                    </div>
                </SheetHeader>

                <div className="border-t" />
                <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
                        {items.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium "
                                onClick={() => onOpenChange(false)}
                            >
                                {item.children}
                            </Link>
                        ))}
                        <div className="border-t">
                            <Link       
                            onClick={() => onOpenChange(false)}
                            href="/sign-in">
                                <div className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium">
                                    Log in
                                </div>
                            </Link>
                        <Link onClick={() => onOpenChange(false)}
                        href="/sign-up">
                                <div className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium">
                                    Strat Selling
                                </div>
                            </Link>

                        </div>

                    
                </ScrollArea>

            </SheetContent> 

            </Sheet>

)};