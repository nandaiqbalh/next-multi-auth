"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/common/StatusBadge";
import { updateOrderStatusAction } from "@/lib/actions/order.actions";

const NEXT_STEPS = {
  PENDING: [{ label: "Start Process", value: "IN_PROGRESS" }],
  IN_PROGRESS: [
    { label: "Success", value: "SUCCESS" },
    { label: "Cancel", value: "CANCEL" },
  ],
  SUCCESS: [],
  CANCEL: [],
};

function summarizeItems(items = []) {
  return items.map((item) => `${item.quantity}x ${item.product?.name || "Product"}`).join(", ");
}

export default function UserOrderList({ orders, meta }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [statusFilter, setStatusFilter] = useState(meta.status ?? "");
  const [search, setSearch] = useState(meta.search ?? "");

  useEffect(() => {
    setStatusFilter(meta.status ?? "");
    setSearch(meta.search ?? "");
  }, [meta.status, meta.search]);

  const syncFilters = () => {
    const params = new URLSearchParams(searchParams?.toString());
    if (search) params.set("search", search);
    else params.delete("search");
    if (statusFilter) params.set("status", statusFilter);
    else params.delete("status");
    params.delete("page");
    router.push(`/orders?${params.toString()}`);
  };

  const handleNextStatus = async (orderId, nextStatus) => {
    startTransition(async () => {
      const result = await updateOrderStatusAction({ orderId, nextStatus });
      if (!result?.success) {
        toast.error(result?.message || "Update failed.");
        return;
      }
      toast.success(result.message || "Order updated.");
      router.refresh();
    });
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle>My Orders</CardTitle>
        <CardDescription>Total {meta.total} orders</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-[1fr_180px_auto]">
          <Input placeholder="Search order" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-9 rounded-md border border-input bg-transparent px-3 text-sm">
            <option value="">All status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="SUCCESS">Success</option>
            <option value="CANCEL">Cancel</option>
          </select>
          <Button type="button" variant="outline" onClick={syncFilters}>Filter</Button>
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="px-4 py-3">
                    <div className="font-medium">{summarizeItems(order.items)}</div>
                    <div className="text-xs text-slate-500">Rp {Number(order.totalPrice).toLocaleString("id-ID")}</div>
                    <div className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleString("id-ID")}</div>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {(NEXT_STEPS[order.status] ?? []).map((step) => (
                        <Button key={step.value} type="button" size="sm" variant={step.value === "CANCEL" ? "destructive" : "outline"} disabled={isPending} onClick={() => handleNextStatus(order.id, step.value)}>
                          {step.label}
                        </Button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-4 py-8 text-center text-slate-500">No orders found.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}