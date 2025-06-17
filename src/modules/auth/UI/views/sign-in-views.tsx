"use client";

import z from "zod";

import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mutation, useMutation } from "@tanstack/react-query";
import {toast } from "sonner";
import { useRouter } from "next/navigation";


import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"; 
import Link from "next/link";

import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";

import { loginSchema } from "@/modules/auth/schemas";
import { useTRPC } from "@/trpc/client";
import { error } from "console";



   const poppins = Poppins({
       subsets: ["latin"],
       weight: ["400", "600"]
   });

export const SignInView = () => {
   const router = useRouter();

   const trpc= useTRPC();
   const login = useMutation(trpc.auth.login.mutationOptions({
   onError: (error) => {
           toast.error(error.message);
       },
   onSuccess: () => {
           toast.success("Account created successfully");
           router.push("/");
       },
    } ));

   const form = useForm<z.infer<typeof loginSchema>>({
       mode: "all",
       resolver: zodResolver(loginSchema),
       defaultValues:{
           email: "",
           password: "",
       }
   });

   const onSubmit = (values: z.infer<typeof loginSchema>) => {
       login.mutate(values)
   }

   
   

   return (
       <div className="grid grid-cols-1 lg:grid-cols-5" >
           <div className="bg-[#F4F4F0] h-screen w-full lg:col-span-3 overflow-y--auto">
               <Form {...form}>
                   <form
                   onSubmit ={form.handleSubmit(onSubmit)}
                   className="flex flex-col gap-8 lg:p-16"
                   >
                    <div className="flex items-center justify-between mb-8">
                       <Link href="/">
                           <span className=  {cn("text-2xl font-bold ", poppins.className)}>
                               Website
                           </span>
                       
                       </Link>
                       <Button
                           asChild
                           variant="ghost"
                           size={"icon"}
                           className="text-base border-none  underline"
                           >
                           <Link prefetch href="/sign-up">
                               Sign up
                           </Link>
                       </Button>
                       </div>   
                       <h1 className="text-4xl font-medium">
                           Welcome Back
                       </h1>
                       

                       <FormField
                           name="email"
                           render={({ field }) => (
                               <FormItem>
                                   <FormLabel className="text-base">Email</FormLabel>
                                   <FormControl>
                                       <Input{...field} className="bg-white"/>
                                   </FormControl>
                                   
                                       <FormMessage/>
                               </FormItem>
                           )}
                      />

                       <FormField
                           name="password"
                           render={({ field }) => (
                               <FormItem>
                                   <FormLabel className="text-base">Password</FormLabel>
                                   <FormControl>
                                       <Input{...field} className="bg-white" type="password"/ >
                                   </FormControl>
                                       <FormMessage/>
                               </FormItem>
                           )}
                      />

                      <Button
                      disabled={login.isPending}
                      type="submit"
                      size={"lg"}
                      variant="elevated"
                      className="bg-black text-white border border-black hover:bg-white hover:text-black transition-colors "
                      >
                       Log in
                      </Button>
                   </form>
                   </Form>
           </div>
           <div className="h-screen w-full lg:col-span-2 hidden lg:block"
           style={{
               backgroundImage: "url('/bagnan_sign_up_bg_pic.webp')",
               backgroundSize: "cover",
               backgroundPosition: "center",
           }}/>
       </div>

   )
} 