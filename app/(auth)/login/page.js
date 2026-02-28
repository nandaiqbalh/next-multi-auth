import LoginForm from "@/components/auth/LoginForm";
import ToastClient from "@/components/ui/ToastClient";
import redirectIfAuthenticated from "./redirect-if-auth";

export const metadata = {
    title: "Login — MultiAuth",
};

export default async function LoginPage(props) {
    await redirectIfAuthenticated();
    const searchParams = props.searchParams ? await props.searchParams : {};
    const justRegistered = searchParams?.registered === "1";
    const showWelcome = searchParams?.toast === "welcome";

    return (
        <>
            <ToastClient registered={justRegistered} welcome={showWelcome} />
            <main className="min-h-screen flex items-center justify-center bg-neutral-50">
                <div className="w-full max-w-md p-6">
                    <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
                    <LoginForm />
                </div>
            </main>
        </>
    );
}

