// app/admin/dashboard/page.js
//
// Placeholder dashboard screen for the admin section. Future
// components (charts, stats, etc.) will appear here.
//
// original filename comment kept below for clarity:
// app/admin/dashboard/page.jsx
export const metadata = {
  title: "Admin Dashboard — Damai RO",
};

import { getDashboardSummaryAction } from "@/lib/actions/order.actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminDashboardPage({ searchParams }) {
  const params = await Promise.resolve(searchParams ?? {});
  const summaryResponse = await getDashboardSummaryAction();
  const summary = summaryResponse.success ? summaryResponse.data : { todayOrders: 0, todayRevenue: 0, totalOrders: 0 };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-slate-600">Overview of today&apos;s Damai RO order activity.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Total Orders Today</CardDescription>
            <CardTitle className="text-3xl">{summary.todayOrders}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Revenue Today</CardDescription>
            <CardTitle className="text-3xl">Rp {Number(summary.todayRevenue).toLocaleString("id-ID")}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>All Orders</CardDescription>
            <CardTitle className="text-3xl">{summary.totalOrders}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Notes</CardTitle>
          <CardDescription>Use the sidebar to manage users, customers, and orders.</CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-800">POS is ready</Badge>
          <p className="mt-3 text-sm text-slate-600">{params.toast === "welcome" ? "Welcome back. Your session is active." : ""}</p>
        </CardContent>
      </Card>
    </div>
  );
}
