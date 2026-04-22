"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const initialForm = {
  customerId: "",
  quantity: "1",
  price: "",
};

export default function OrderFormDialog({ open, onOpenChange, customers, onSubmit, isSubmitting }) {
  const [form, setForm] = useState(initialForm);

  const defaultCustomer = useMemo(() => customers?.[0]?.id ?? "", [customers]);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit({
      customerId: form.customerId,
      quantity: Number(form.quantity),
      price: Number(form.price),
    });
  };

  const totalPrice = Number(form.quantity || 0) * Number(form.price || 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Order</DialogTitle>
          <DialogDescription>Create a new galon delivery order.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Select value={form.customerId} onValueChange={(value) => setForm((prev) => ({ ...prev, customerId: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select customer" />
            </SelectTrigger>
            <SelectContent>
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.user?.name || "Unknown"} - {customer.user?.phone || "No phone"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              min="1"
              placeholder="Quantity"
              value={form.quantity}
              onChange={(event) => setForm((prev) => ({ ...prev, quantity: event.target.value }))}
            />
            <Input
              type="number"
              min="1"
              placeholder="Price"
              value={form.price}
              onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
            />
          </div>

          <div className="rounded-md border bg-slate-50 px-3 py-2 text-sm text-slate-700">
            Total Price: <span className="font-semibold">Rp {Number.isFinite(totalPrice) ? totalPrice.toLocaleString("id-ID") : "0"}</span>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !form.customerId}>
              Create Order
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
