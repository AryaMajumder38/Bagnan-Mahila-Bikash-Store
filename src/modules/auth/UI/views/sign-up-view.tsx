 "use client";

 import z from "zod";

 import { Poppins } from "next/font/google";
 import { cn } from "@/lib/utils";

 import { useForm } from "react-hook-form";
 import { zodResolver } from "@hookform/resolvers/zod";
 import { Mutation, useMutation, useQueryClient } from "@tanstack/react-query";
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
 
 import { registerSchema } from "@/modules/auth/schemas";
 import { useTRPC } from "@/trpc/client";
import { error } from "console";



    const poppins = Poppins({
        subsets: ["latin"],
        weight: ["400", "600"]
    });
 
 export const SignUpView = () => {
    const router = useRouter();

    const trpc= useTRPC();
    const queryClient = useQueryClient();
    const register = useMutation(trpc.auth.register.mutationOptions({
    onError: (error) => {
            toast.error(error.message);
        },
    onSuccess: async () => {
            toast.success("Account created successfully");
            await queryClient.invalidateQueries(trpc.auth.session.queryFilter());
            router.push("/");
        },
     } ));

    const form = useForm<z.infer<typeof registerSchema>>({
        mode: "all",
        resolver: zodResolver(registerSchema),
        defaultValues:{
            email: "",
            password: "",
            username: ""
        }
    });

    const onSubmit = (values: z.infer<typeof registerSchema>) => {
        register.mutate(values)
    }

    const username = form.watch("username");
    const email = form.watch("email");
    const usernameError = form.formState.errors.username;

    const showPreview = username && !usernameError;

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
                            <Link prefetch href="/sign-in">
                                Sign In
                            </Link>
                        </Button>
                        </div>   
                        <h1 className="text-4xl font-medium">
                            Join the website 
                        </h1>
                        <FormField
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">Username</FormLabel>
                                    <FormControl>
                                        <Input{...field} className="bg-white"/>
                                    </FormControl>
                                    <FormDescription className={cn("hidden", showPreview && "block", "text-black")}>
                                        Your username for our website iwill be : .
                                        <strong>{username}</strong>
                                        </FormDescription>
                                        <FormMessage/>
                                </FormItem>
                            )}
                       />

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
                       disabled={register.isPending}
                       type="submit"
                       size={"lg"}
                       variant="elevated"
                       className="bg-black text-white border border-black hover:bg-white hover:text-black transition-colors "
                       >
                        Create Account
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