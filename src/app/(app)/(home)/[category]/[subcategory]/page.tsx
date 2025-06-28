 interface Props {
    params: {
        category: string;
        subcategory: string;
    };
}

const Page = async ({ params }: Props) => {
    const { category, subcategory } = await params;
    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1 bg-[#F4F4F0]">
                <h1 className="text-center text-2xl font-bold mt-10">
                    Welcome to the Category Page: {category}
                </h1>
                <h2 className="text-center text-xl font-semibold mt-2">
                    and the Subcategory: {subcategory}
                </h2>
                <p className="text-center text-lg mt-4">
                    This is a placeholder for category-specific content.
                </p>
            </div>
            <footer className="flex border-t justify-between font-medium p-6">
                <div className="flex items-center gap-2">
                    <p>
                        shopify
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default Page;