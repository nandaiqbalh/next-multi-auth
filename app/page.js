
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Damai RO POS",
  description: "Simple POS for Damai RO water delivery",
};

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role === "ADMIN" || session?.user?.role === "SUPERADMIN") {
    redirect("/admin/dashboard");
  }
  if (session?.user) {
    redirect("/orders");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-sky-50 px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Damai RO</p>
      <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">Water delivery POS built for a simple daily workflow.</h1>
      <p className="mt-5 max-w-2xl text-lg text-slate-600">Login to manage users, customers, and delivery orders with role-based access.</p>
      <div className="mt-8 flex gap-3">
        <a href="/login" className="rounded-md bg-slate-900 px-5 py-2.5 text-white transition hover:bg-slate-800">Login</a>
        <a href="/register" className="rounded-md border border-slate-300 px-5 py-2.5 text-slate-700 transition hover:bg-white">Register</a>
      </div>
    </main>
  );
}

