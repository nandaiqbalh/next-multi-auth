"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const initialForm = {
  name: "",
  phone: "",
  address: "",
  mapUrl: "",
  housePhoto: "",
  locationNote: "",
  subscriptionNote: "",
  note: "",
};

export default function CustomerFormDialog({ open, onOpenChange, initialData, onSubmit, isSubmitting }) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!open) {
      setForm(initialForm);
      return;
    }

    if (initialData) {
      setForm({
        name: initialData.name ?? initialData.user?.name ?? "",
        phone: initialData.phone ?? initialData.user?.phone ?? "",
        address: initialData.address ?? "",
        mapUrl: initialData.mapUrl ?? "",
        housePhoto: initialData.housePhoto ?? "",
        locationNote: initialData.locationNote ?? "",
        subscriptionNote: initialData.subscriptionNote ?? "",
        note: initialData.note ?? "",
      });
    } else {
      setForm(initialForm);
    }
  }, [open, initialData]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      mapUrl: form.mapUrl.trim(),
      housePhoto: form.housePhoto.trim(),
      locationNote: form.locationNote.trim(),
      subscriptionNote: form.subscriptionNote.trim(),
      note: form.note.trim(),
    };

    await onSubmit(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl h-[80vh] p-0 flex flex-col overflow-hidden">
        <DialogHeader className="sticky top-0 z-10 border-b bg-background px-6 py-4">
          <DialogTitle>{initialData ? "Edit Customer" : "Create Customer"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Update customer profile information." : "Create customer profile."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
          <div className="space-y-1">
            <label htmlFor="customer-name" className="text-sm font-medium text-slate-700">Name</label>
          <Input
            id="customer-name"
            placeholder="Name"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          />
          </div>

          <div className="space-y-1">
            <label htmlFor="customer-phone" className="text-sm font-medium text-slate-700">Phone</label>
          <Input
            id="customer-phone"
            placeholder="Phone"
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
          />
          </div>

          <div className="space-y-1">
            <label htmlFor="customer-address" className="text-sm font-medium text-slate-700">Address</label>
          <Textarea
            id="customer-address"
            placeholder="Address"
            value={form.address}
            onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
          />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <label htmlFor="customer-map-url" className="text-sm font-medium text-slate-700">Map URL</label>
              <Input
                id="customer-map-url"
                placeholder="https://maps.google.com/..."
                value={form.mapUrl}
                onChange={(event) => setForm((prev) => ({ ...prev, mapUrl: event.target.value }))}
              />
              {form.mapUrl ? (
                <a href={form.mapUrl} target="_blank" rel="noreferrer" className="text-xs font-medium text-emerald-700 underline">
                  Open Map
                </a>
              ) : null}
            </div>

            <div className="space-y-1">
              <label htmlFor="customer-house-photo" className="text-sm font-medium text-slate-700">House Photo URL</label>
              <Input
                id="customer-house-photo"
                placeholder="https://.../house.jpg"
                value={form.housePhoto}
                onChange={(event) => setForm((prev) => ({ ...prev, housePhoto: event.target.value }))}
              />
            </div>
          </div>

          {form.housePhoto ? (
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-700">House Photo Preview</p>
              <img src={form.housePhoto} alt="House preview" className="h-36 w-full rounded-md border object-cover" />
            </div>
          ) : null}

          <div className="space-y-1">
            <label htmlFor="customer-location-note" className="text-sm font-medium text-slate-700">Location Note</label>
            <Textarea
              id="customer-location-note"
              placeholder="Example: House after the corner store"
              value={form.locationNote}
              onChange={(event) => setForm((prev) => ({ ...prev, locationNote: event.target.value }))}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="customer-subscription-note" className="text-sm font-medium text-slate-700">Subscription Note</label>
            <Textarea
              id="customer-subscription-note"
              placeholder="Example: Weekly 3x refill"
              value={form.subscriptionNote}
              onChange={(event) => setForm((prev) => ({ ...prev, subscriptionNote: event.target.value }))}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="customer-note" className="text-sm font-medium text-slate-700">Note</label>
          <Textarea
            id="customer-note"
            placeholder="Note (optional)"
            value={form.note}
            onChange={(event) => setForm((prev) => ({ ...prev, note: event.target.value }))}
          />
          </div>
          </div>

          <DialogFooter className="sticky bottom-0 z-10 border-t bg-background px-6 py-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {initialData ? "Save Changes" : "Create Customer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
