"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const initialForm = {
  customerId: "",
  items: [{ key: "item-1", productId: "", quantity: "1", price: "" }],
};

function formatRupiah(value) {
  return `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
}

function createItemKey() {
  return `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function OrderFormDialog({ open, onOpenChange, customers, products, onSubmit, isSubmitting }) {
  const [form, setForm] = useState(initialForm);

  const defaultCustomer = useMemo(() => customers?.[0]?.id ?? "", [customers]);
  const productMap = useMemo(() => {
    return new Map((products ?? []).map((product) => [product.id, product]));
  }, [products]);

  useEffect(() => {
    if (!open) {
      setForm(initialForm);
      return;
    }

    setForm((prev) => ({
      ...prev,
      customerId: prev.customerId || defaultCustomer,
    }));
  }, [open, defaultCustomer]);

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { key: createItemKey(), productId: "", quantity: "1", price: "" }],
    }));
  };

  const removeItem = (key) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.length === 1 ? prev.items : prev.items.filter((item) => item.key !== key),
    }));
  };

  const updateItem = (key, patch) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.key !== key) return item;

        const next = { ...item, ...patch };
        if (patch.productId) {
          const product = productMap.get(patch.productId);
          if (product) {
            next.price = String(product.price);
          }
        }

        return next;
      }),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const items = form.items
      .filter((item) => item.productId)
      .map((item) => ({
        productId: item.productId,
        quantity: Number(item.quantity),
        price: Number(item.price),
      }));

    await onSubmit({
      customerId: form.customerId,
      items,
    });
  };

  const totalPrice = useMemo(() => {
    return form.items.reduce((sum, item) => {
      const quantity = Number(item.quantity || 0);
      const price = Number(item.price || 0);
      return sum + quantity * price;
    }, 0);
  }, [form.items]);

  const canSubmit =
    Boolean(form.customerId) &&
    form.items.length > 0 &&
    form.items.every((item) => item.productId && Number(item.quantity) >= 1 && Number(item.price) >= 1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[80vh] p-0 flex flex-col overflow-hidden">
        <DialogHeader className="sticky top-0 z-10 border-b bg-background px-6 py-4">
          <DialogTitle>Create Order</DialogTitle>
          <DialogDescription>Create a multi-item delivery order with overridable item prices.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-4">
            <section className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Customer</h3>
              <Select value={form.customerId} onValueChange={(value) => setForm((prev) => ({ ...prev, customerId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name || customer.user?.name || "Unknown"} - {customer.phone || customer.user?.phone || "No phone"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Order Items</h3>
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                  <Plus className="h-4 w-4" />
                  Add Item
                </Button>
              </div>

              <div className="space-y-3">
                {form.items.map((item, index) => (
                  <Card key={item.key} className="border-dashed">
                    <CardContent className="space-y-3 p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-700">Item {index + 1}</p>
                        <Button type="button" size="icon-sm" variant="destructive" onClick={() => removeItem(item.key)} disabled={form.items.length === 1}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid gap-3 md:grid-cols-3">
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-sm font-medium text-slate-700">Product</label>
                          <Select value={item.productId} onValueChange={(value) => updateItem(item.key, { productId: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                              {(products ?? []).map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name} - {formatRupiah(product.price)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-sm font-medium text-slate-700">Quantity</label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(event) => updateItem(item.key, { quantity: event.target.value })}
                          />
                        </div>

                        <div className="space-y-1 md:col-span-2">
                          <label className="text-sm font-medium text-slate-700">Price (Override Allowed)</label>
                          <Input
                            type="number"
                            min="1"
                            value={item.price}
                            onChange={(event) => updateItem(item.key, { price: event.target.value })}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-sm font-medium text-slate-700">Subtotal</label>
                          <div className="rounded-md border bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                            {formatRupiah(Number(item.quantity || 0) * Number(item.price || 0))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Summary</h3>
              <div className="rounded-md border bg-slate-50 px-4 py-3 text-sm text-slate-700">
                Total Price: <span className="font-semibold">{formatRupiah(totalPrice)}</span>
              </div>
            </section>
          </div>

          <DialogFooter className="sticky bottom-0 z-10 border-t bg-background px-6 py-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !canSubmit}>
              Create Order
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
