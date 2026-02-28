import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
    title: "Register — MultiAuth",
};

export default function RegisterPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-neutral-50">
            <div className="w-full max-w-md p-6">
                <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>
                <RegisterForm />
            </div>
        </main>
    );
}

