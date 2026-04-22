// app/admin/layout.jsx
//
// Root layout for all `/admin` routes.  This server component
// performs an authentication check (redirecting non-admin users
// to `/login`) and provides the global navigation via
// AdminNav.  Children are rendered in the main content area.

import { dmSans } from "@/lib/fonts";
import AdminNav from "@/components/admin/AdminNav";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin — Damai RO",
};

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user?.role !== "ADMIN" && session.user?.role !== "SUPERADMIN")) {
    // send unauthenticated users to login
    redirect("/login");
  }

  return (
    <div className={`${dmSans.className} min-h-screen bg-slate-50`}>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 lg:block">
        <AdminSidebar />
      </aside>

      <div className="flex min-h-screen flex-col lg:pl-64">
        <AdminNav />
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
