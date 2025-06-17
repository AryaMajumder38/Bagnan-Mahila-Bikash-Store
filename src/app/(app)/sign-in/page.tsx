import { SignInView } from "@/modules/auth/UI/views/sign-in-views";
import { caller } from "@/trpc/server";
import { redirect } from "next/navigation";

const Page = async () => {
    const session =  await caller.auth.session();

    if(session.user){
        redirect("/"); // Redirect to home if user is already signed in
    }
    return <SignInView/>
}

export default Page;