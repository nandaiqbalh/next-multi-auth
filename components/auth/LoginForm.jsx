// components/auth/LoginForm.jsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { toast } from "../ui/sonner";
import { loginSchema } from "@/lib/validations/auth.schema";
import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";
import AuthDivider from "./AuthDivider";
import GoogleButton from "./GoogleButton";
import ErrorDialog from "@/components/ui/error-dialog";

export default function LoginForm() {
    const router = useRouter();
    const [dialog, setDialog] = useState({ open: false, title: "", description: "" });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: { identifier: "", password: "" },
    });

    const onSubmit = async (values) => {
        const res = await signIn("credentials", {
            redirect: false,
            identifier: values.identifier,
            password: values.password,
        });

        if (res?.error) {
            const message = "Incorrect email/username or password. Please check your credentials.";
            setDialog({ open: true, title: "Login Failed", description: message });
            toast.error(message);
            return;
        }

        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();
        const role = session?.user?.role;

        // navigate with a flag so destination page can show a toast
        router.push(
            role === "ADMIN" ? "/admin/dashboard?toast=welcome" : "/?toast=welcome"
        );
    };

    return (
        <>
            <ErrorDialog
                open={dialog.open}
                title={dialog.title}
                description={dialog.description}
                onClose={() => setDialog((d) => ({ ...d, open: false }))}
            />
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
                <AuthInput
                    id="identifier"
                    label="Email or Username"
                    type="text"
                    placeholder="you@example.com or your_username"
                    error={errors.identifier?.message}
                    autoComplete="username"
                    {...register("identifier")}
                />
                <AuthInput
                    id="password"
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    error={errors.password?.message}
                    autoComplete="current-password"
                    {...register("password")}
                />
                <div className="flex justify-end">
                    <Link
                        href="/forgot-password"
                        className="text-neutral-500 text-[11px] tracking-wide hover:text-neutral-900 transition-colors"
                    >
                        Forgot password?
                    </Link>
                </div>
                <AuthButton loading={isSubmitting}>Login</AuthButton>
                <AuthDivider />
                <GoogleButton callbackUrl="/" />
                <p className="text-center text-neutral-600 text-[11px] tracking-wide">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-neutral-800 font-medium hover:text-neutral-950 transition-colors">
                        Register Now
                    </Link>
                </p>
            </form>
        </>
    );
}