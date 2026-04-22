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
import ProductFormDialog from "@/components/admin/ProductFormDialog";
import { createProductAction, deleteProductAction, updateProductAction } from "@/lib/actions/product.actions";

function formatRupiah(value) {
  return `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
}

export default function ProductManagerClient({ products, meta }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
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
    router.push(`/admin/products?${params.toString()}`);
  };

  const handleCreateClick = () => {
    setEditingProduct(null);
    setDialogOpen(true);
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const handleSubmit = async (payload) => {
    let result;

    if (editingProduct) {
      result = await updateProductAction(editingProduct.id, payload);
    } else {
      result = await createProductAction(payload);
    }

    if (!result?.success) {
      toast.error(result?.message || "Operation failed.");
      return;
    }

    toast.success(result.message || "Saved.");
    setDialogOpen(false);
    setEditingProduct(null);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    startTransition(async () => {
      const result = await deleteProductAction(deleteTarget.id);
      if (!result?.success) {
        toast.error(result?.message || "Delete failed.");
        return;
      }
      toast.success(result.message || "Product deleted.");
      setDeleteTarget(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage product catalog and base prices."
        actionLabel="Create Product"
        onAction={handleCreateClick}
        actionDisabled={isPending}
      />

      <Card className="shadow-sm">
        <CardContent className="space-y-4 p-4 md:p-6">
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <Input placeholder="Search products" value={search} onChange={(event) => setSearch(event.target.value)} />
            <Button type="button" variant="outline" onClick={syncFilters}>Filter</Button>
          </div>

          {isPending ? <LoadingState message="Saving changes..." /> : null}

          {products.length === 0 ? (
            <EmptyState title="No products found" description="Try adjusting the filter, or create a new product." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Base Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium text-slate-900">{product.name}</TableCell>
                    <TableCell>{formatRupiah(product.price)}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button type="button" size="icon-sm" variant="outline" onClick={() => handleEditClick(product)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button type="button" size="icon-sm" variant="destructive" onClick={() => setDeleteTarget(product)}>
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

      <ProductFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editingProduct}
        isSubmitting={isPending}
        onSubmit={(payload) => {
          startTransition(async () => {
            await handleSubmit(payload);
          });
        }}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete product"
        description={deleteTarget ? `Delete ${deleteTarget.name}?` : "Delete selected product?"}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onClose={() => setDeleteTarget(null)}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
