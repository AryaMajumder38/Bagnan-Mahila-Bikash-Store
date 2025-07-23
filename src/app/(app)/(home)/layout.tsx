

import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { Footer } from "@/modules/home/UI/components/footer";
import  Navbar  from "@/modules/home/UI/components/navbar";
//import { SearchFilters } from "@/modules/home/UI/components/search-filters";


import { Category } from '@/payload-types';
import { CustomCategory } from './types';
import { getQueryClient, trpc } from '@/trpc/server';
import { Suspense } from 'react';
``
interface Props {
    children: React.ReactNode;
}


const Layout = async  ({ children }: Props) => {
    
  const queryClient= getQueryClient();
  void queryClient.prefetchQuery(
    trpc.categories.getMany.queryOptions(),
  );


    return (
        <div className="flex flex-col min-h-screen bg-[#faf9f6]">
            <Navbar/>
            <HydrationBoundary state={dehydrate(queryClient)}>
              <Suspense fallback= {<p>..Loading..</p>}>
            {/* <SearchFilters /> */}
            </Suspense>
            </HydrationBoundary>
            <div className="flex-1 bg-[#fafafaf6]">
        {children}
            </div>
        <Footer />
        </div>
    );
}

    export default Layout;