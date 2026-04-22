"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const initialForm = {
  name: "",
  price: "",
};

export default function ProductFormDialog({ open, onOpenChange, initialData, onSubmit, isSubmitting }) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!open) {
      setForm(initialForm);
      return;
    }

    if (initialData) {
      setForm({
        name: initialData.name ?? "",
        price: String(initialData.price ?? ""),
      });
    } else {
      setForm(initialForm);
    }
  }, [open, initialData]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    await onSubmit({
      name: form.name.trim(),
      price: Number(form.price),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] p-0 flex flex-col overflow-hidden">
        <DialogHeader className="sticky top-0 z-10 border-b bg-background px-6 py-4">
          <DialogTitle>{initialData ? "Edit Product" : "Create Product"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Update product name and base price." : "Create a new product for order items."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
            <div className="space-y-1">
              <label htmlFor="product-name" className="text-sm font-medium text-slate-700">Product Name</label>
              <Input
                id="product-name"
                placeholder="Example: Isi Ulang"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="product-price" className="text-sm font-medium text-slate-700">Base Price</label>
              <Input
                id="product-price"
                type="number"
                min="1"
                placeholder="7000"
                value={form.price}
                onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
              />
            </div>
          </div>

          <DialogFooter className="sticky bottom-0 z-10 border-t bg-background px-6 py-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !form.name.trim() || Number(form.price) < 1}>
              {initialData ? "Save Changes" : "Create Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
