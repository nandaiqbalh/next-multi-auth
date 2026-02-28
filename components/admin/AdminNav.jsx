// components/admin/AdminNav.jsx
//
// Client-side navigation wrapper used in the admin section.  
// Renders a mobile header with a hamburger button, a desktop sidebar
// and uses a SideDialog for the slide‑in mobile menu.  
// This component is responsible only for showing/hiding the
// navigation and does not know about the current route.

"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

// -------- helper components moved here to keep admin nav self-contained ---

// Simple vertical list of links used inside the admin navigation.
// Highlights the active route by comparing `usePathname()` with
// each link. Designed to be embedded in both desktop and mobile
// containers (sidebar or dialog).
import Link from "next/link";
import { usePathname } from "next/navigation";
function AdminSidebar() {
  const pathname = usePathname();

  const linkClass = (path) => {
    const base = "text-sm font-medium px-2 py-1 rounded";
    const active = pathname === path || pathname?.startsWith(path + "/");
    return `${base} ${active ? "bg-neutral-100 text-neutral-900" : "text-neutral-600 hover:bg-neutral-50"}`;
  };

  return (
    <nav className="flex flex-col space-y-1">
      <Link href="/admin/dashboard" className={linkClass("/admin/dashboard")}>Dashboard</Link>
      <Link href="/admin/users" className={linkClass("/admin/users")}>Users</Link>
    </nav>
  );
}

// A thin wrapper around SideDialog configured for the admin
// navigation drawer.  It always slides from the left and uses a
// fixed title.  Because SideDialog is also used elsewhere in the
// app (e.g. the buyer checkout panel) we keep this wrapper
// separate so that changes specific to the admin nav don't affect
// other dialogs.
import SideDialog from "@/components/common/SideDialog";
function AdminDrawer({ open, onClose, children }) {
  return (
    <SideDialog
      open={open}
      title="Menu"
      side="left"
      onClose={onClose}
    >
      {children}
    </SideDialog>
  );
}

// -------------------------------------------------------------------------

export default function AdminNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* mobile header with hamburger */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-neutral-200 bg-white">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-neutral-700 hover:text-neutral-900"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" strokeWidth={1.6} />
        </button>
        <span className="text-lg font-semibold">Admin</span>
      </div>

      {/* desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-0">
        <AdminSidebar />
      </aside>

      {/* mobile drawer */}
      <AdminDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      >
        <AdminSidebar />
      </AdminDrawer>
    </>
  );
}
