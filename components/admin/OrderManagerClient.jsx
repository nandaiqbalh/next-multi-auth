"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Edit } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusBadge from "@/components/common/StatusBadge";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import LoadingState from "@/components/common/LoadingState";
import TablePagination from "@/components/common/TablePagination";
import OrderFormDialog from "@/components/admin/OrderFormDialog";
import { createOrderAction, updateOrderStatusAction } from "@/lib/actions/order.actions";

const NEXT_STEPS = {
  PENDING: [{ label: "Mark In Progress", value: "IN_PROGRESS" }],
  IN_PROGRESS: [
    { label: "Mark Success", value: "SUCCESS" },
    { label: "Cancel", value: "CANCEL" },
  ],
  SUCCESS: [],
  CANCEL: [],
};

export default function OrderManagerClient({ orders, customers, meta }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);
  const [nextStatus, setNextStatus] = useState("");
  const [search, setSearch] = useState(meta.search ?? "");
  const [statusFilter, setStatusFilter] = useState(meta.status ?? "");

  useEffect(() => {
    setSearch(meta.search ?? "");
    setStatusFilter(meta.status ?? "");
  }, [meta.search, meta.status]);

  const syncFilters = () => {
    const params = new URLSearchParams(searchParams?.toString());
    if (search) params.set("search", search);
    else params.delete("search");
    if (statusFilter) params.set("status", statusFilter);
    else params.delete("status");
    params.delete("page");
    router.push(`/admin/orders?${params.toString()}`);
  };

  const handleCreate = async (payload) => {
    startTransition(async () => {
      const result = await createOrderAction(payload);

      if (!result?.success) {
        toast.error(result?.message || "Create failed.");
        return;
      }

      toast.success(result.message || "Order created.");
      setCreateDialogOpen(false);
      router.refresh();
    });
  };

  const openStatusDialog = (order) => {
    setActiveOrder(order);
    setNextStatus("");
    setStatusDialogOpen(true);
  };

  const handleNextStatus = async (orderId, nextStatus) => {
    startTransition(async () => {
      const result = await updateOrderStatusAction({ orderId, nextStatus });
      if (!result?.success) {
        toast.error(result?.message || "Update failed.");
        return;
      }
      toast.success(result.message || "Order updated.");
      setStatusDialogOpen(false);
      setActiveOrder(null);
      setNextStatus("");
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        description="Create and manage delivery orders for Damai RO."
        actionLabel="Create Order"
        onAction={() => setCreateDialogOpen(true)}
        actionDisabled={isPending}
      />

      <Card className="shadow-sm">
        <CardContent className="space-y-4 p-4 md:p-6">
          <div className="grid gap-3 md:grid-cols-[1fr_180px_auto]">
            <Input placeholder="Search customer" value={search} onChange={(e) => setSearch(e.target.value)} />
            <Select value={statusFilter || "all"} onValueChange={(value) => setStatusFilter(value === "all" ? "" : value)}>
              <SelectTrigger>
                <SelectValue placeholder="All status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="SUCCESS">Success</SelectItem>
                <SelectItem value="CANCEL">Cancel</SelectItem>
              </SelectContent>
            </Select>
            <Button type="button" variant="outline" onClick={syncFilters}>Filter</Button>
          </div>

          {isPending ? <LoadingState message="Saving changes..." /> : null}

          {orders.length === 0 ? (
            <EmptyState title="No orders found" description="Try changing the filter, or create a new order." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="font-medium text-slate-900">{order.customer?.user?.name || "-"}</div>
                      <div className="text-xs text-slate-500">{order.customer?.user?.phone || order.customer?.user?.email || "-"}</div>
                    </TableCell>
                    <TableCell>
                      <div>{order.quantity} galon</div>
                      <div className="text-slate-500">Rp {Number(order.totalPrice).toLocaleString("id-ID")}</div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button type="button" size="icon-sm" variant="outline" onClick={() => openStatusDialog(order)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <TablePagination page={meta.page} totalPages={meta.totalPages} />
        </CardContent>
      </Card>

      <OrderFormDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        customers={customers}
        isSubmitting={isPending}
        onSubmit={handleCreate}
      />

      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>Move order to the next valid state.</DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="rounded-md border bg-slate-50 p-3 text-sm text-slate-700">
              <div className="font-medium">{activeOrder?.customer?.user?.name || "-"}</div>
              <div>{activeOrder?.quantity ?? 0} galon</div>
              <div className="mt-1">Current: {activeOrder?.status || "-"}</div>
            </div>

            <Select value={nextStatus} onValueChange={setNextStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select next status" />
              </SelectTrigger>
              <SelectContent>
                {(activeOrder ? NEXT_STEPS[activeOrder.status] ?? [] : []).map((item) => (
                  <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!activeOrder || !nextStatus || isPending}
              onClick={() => activeOrder && handleNextStatus(activeOrder.id, nextStatus)}
            >
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}