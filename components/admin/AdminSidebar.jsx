"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, PackageCheck, Users, UserRound, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const menus = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/customers", label: "Customers", icon: UserRound },
  { href: "/admin/orders", label: "Orders", icon: PackageCheck },
];

export default function AdminSidebar({ onNavigate }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="border-b px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Damai RO</p>
        <p className="mt-1 text-lg font-semibold text-slate-900">Admin Panel</p>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {menus.map((menu) => {
          const active = pathname === menu.href || pathname?.startsWith(`${menu.href}/`);
          const Icon = menu.icon;

          return (
            <Link
              key={menu.href}
              href={menu.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-emerald-50 text-emerald-800"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <Icon className="h-4 w-4" />
              {menu.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-3">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-700 transition hover:bg-rose-50"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
