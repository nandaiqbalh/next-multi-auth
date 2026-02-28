// app/admin/dashboard/page.js
//
// Placeholder dashboard screen for the admin section. Future
// components (charts, stats, etc.) will appear here.
//
// original filename comment kept below for clarity:
// app/admin/dashboard/page.jsx
export const metadata = {
  title: "Admin Dashboard — MultiAuth",
};

import ToastClient from "@/components/ui/ToastClient";

export default function AdminDashboardPage({ searchParams }) {
  const showWelcome = searchParams?.toast === "welcome";

  return (
    <>
      <ToastClient welcome={showWelcome} />
      <div className="space-y-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-neutral-600">Welcome to the admin dashboard. Select a section from the sidebar.</p>
    </div>
  );
}
