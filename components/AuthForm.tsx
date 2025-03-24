"use client";

import { useState } from "react";
import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { authFormSchema } from "@/lib/utils";
import FormField from "@/components/FormField";
import { Loader2 } from "lucide-react";
import { signIn, signUp } from "@/lib/actions/auth.action";
import { auth } from "@/firebase/client";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const AuthForm = ({ type }: { type: FormType }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const formSchema = authFormSchema(type);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
        if (type === "sign-up") {
            const { name, email, password } = values;

            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const result = await signUp({
                uid: userCredential.user.uid,
                name: name!,
                email,
                password
            });
            if(!result.success) {
                toast.error(result.message);
                return;
            }
            toast.success(`Welcome to Fanikiwa! ${name}`);
            router.push("/sign-in");
        } else {
            const { email, password } = values;
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            const idToken = await userCredential.user.getIdToken();
            if (!idToken) {
                toast.error("Signed Failed. Please try again");
                return;
            }
            await signIn({
                email,
                idToken
            });
            toast.success(`Welcome back!`);
            router.push("/");
        }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    const isSignIn = type === "sign-in";
  return (
    <div className="card-border lg:min-w-[566px]">
        <div className="flex flex-col gap-6 card py-14 px-10">
            <div className="flex flex-row justify-center gap-2">
                <Image src="/images/logo.webp" alt="Logo" width={38} height={38} />
                <h2 className="text-primary-100">Fanikiwa</h2>
            </div>
            <h3 className="text-2xl font-bold">Practice your job interviews the right way!🔥</h3>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4 form">
                    {!isSignIn && (
                        <FormField
                            control={form.control}
                            name="name"
                            label="Name"
                            placeholder="Enter your name"
                            type="text" 
                        />
                    )}
                    <FormField
                        control={form.control}
                        name="email"
                        label="Email"
                        placeholder="Enter your email"
                        type="email"
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        label="Password"
                        placeholder="Enter your password"
                        type="password"
                    />
                    <Button type="submit" className="btn" disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin ml-2" />  : ""}
                        {isSignIn ? "Sign In" : "Create Account"}
                    </Button>
                </form>
            </Form>
            <p className="text-center">
                {isSignIn
                    ? "Don't have an account?"
                    : "Already have an account?"}
                <Link
                    href={isSignIn ? "/sign-up" : "/sign-in"}
                    className="font-bold text-user-primary ml-1"
                >
                    {isSignIn ? "Sign Up" : "Sign In"}
                </Link>
            </p>
        </div>
    </div>
  )
}

export default AuthForm