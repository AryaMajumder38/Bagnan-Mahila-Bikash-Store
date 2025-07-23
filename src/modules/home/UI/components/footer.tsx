export const Footer = () => {
    return (
        <footer className="border-t bg-black py-6 md:py-8 px-4 md:px-6 text-center">
            <div className="container mx-auto">
                <div className="flex flex-col items-center gap-4 md:gap-6">
                    
                    {/* Copyright text */}
                    <div className="text-gray-300 text-sm mb-1 md:mb-2">
                        © 2025 Chitra
                    </div>
                    
                    {/* Policy links - stack vertically on mobile, horizontal with dots on larger screens */}
                    <div className="flex flex-col md:flex-row flex-wrap justify-center md:gap-x-6 gap-y-3 text-xs md:text-sm text-white">
                        <a href="/policies/refund-policy" className="hover:underline py-1.5 md:py-0">Refund policy</a>
                        
                        {/* Hide dots on mobile, show on larger screens */}
                        <span className="text-gray-500 hidden md:inline">•</span>
                        
                        <a href="/policies/privacy-policy" className="hover:underline py-1.5 md:py-0">Privacy policy</a>
                        
                        <span className="text-gray-500 hidden md:inline">•</span>
                        
                        <a href="/policies/terms-of-service" className="hover:underline py-1.5 md:py-0">Terms of service</a>
                        
                        <span className="text-gray-500 hidden md:inline">•</span>
                        
                        <a href="/policies/shipping-policy" className="hover:underline py-1.5 md:py-0">Shipping policy</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

