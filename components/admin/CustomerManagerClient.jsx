"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import LoadingState from "@/components/common/LoadingState";
import TablePagination from "@/components/common/TablePagination";
import CustomerFormDialog from "@/components/admin/CustomerFormDialog";
import { createCustomerAction, deleteCustomerAction, updateCustomerAction } from "@/lib/actions/customer.actions";

export default function CustomerManagerClient({ customers, meta }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState(meta.search ?? "");

  useEffect(() => {
    setSearch(meta.search ?? "");
  }, [meta.search]);

  const syncFilters = () => {
    const params = new URLSearchParams(searchParams?.toString());
    if (search) params.set("search", search);
    else params.delete("search");
    params.delete("page");
    router.push(`/admin/customers?${params.toString()}`);
  };

  const handleCreateClick = () => {
    setEditingCustomer(null);
    setDialogOpen(true);
  };

  const handleEditClick = (customer) => {
    setEditingCustomer(customer);
    setDialogOpen(true);
  };

  const handleSubmit = async (payload) => {
    let result;

    if (editingCustomer) {
      result = await updateCustomerAction(editingCustomer.id, payload);
    } else {
      result = await createCustomerAction(payload);
    }

    if (!result?.success) {
      toast.error(result?.message || "Operation failed.");
      return;
    }

    toast.success(result.message || "Saved.");
    setDialogOpen(false);
    setEditingCustomer(null);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    startTransition(async () => {
      const result = await deleteCustomerAction(deleteTarget.id);
      if (!result?.success) {
        toast.error(result?.message || "Delete failed.");
        return;
      }
      toast.success(result.message || "Customer deleted.");
      setDeleteTarget(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Manage Damai RO customer profiles."
        actionLabel="Create Customer"
        onAction={handleCreateClick}
        actionDisabled={isPending}
      />

      <Card className="shadow-sm">
        <CardContent className="space-y-4 p-4 md:p-6">
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <Input placeholder="Search customers" value={search} onChange={(event) => setSearch(event.target.value)} />
            <Button type="button" variant="outline" onClick={syncFilters}>Filter</Button>
          </div>

          {isPending ? <LoadingState message="Saving changes..." /> : null}

          {customers.length === 0 ? (
            <EmptyState title="No customers found" description="Try adjusting the filter, or create a new customer." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Total Orders</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="font-medium text-slate-900">{customer.user?.name || "-"}</div>
                      <div className="text-xs text-slate-500">{customer.user?.email || "-"}</div>
                      <div className="text-xs text-slate-500">{customer.user?.phone || "-"}</div>
                    </TableCell>
                    <TableCell>{customer.address || "-"}</TableCell>
                    <TableCell>{customer._count?.orders ?? 0}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button type="button" size="icon-sm" variant="outline" onClick={() => handleEditClick(customer)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button type="button" size="icon-sm" variant="destructive" onClick={() => setDeleteTarget(customer)}>
                          <Trash2 className="h-4 w-4" />
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

      <CustomerFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editingCustomer}
        isSubmitting={isPending}
        onSubmit={(payload) => {
          startTransition(async () => {
            await handleSubmit(payload);
          });
        }}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete customer"
        description={deleteTarget ? `Delete ${deleteTarget.user?.name || deleteTarget.user?.email}?` : "Delete selected customer?"}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onClose={() => setDeleteTarget(null)}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}