"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  username: "",
  password: "",
  role: "USER",
};

export default function UserFormDialog({ open, onOpenChange, initialData, onSubmit, isSubmitting }) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!open) {
      setForm(initialForm);
      return;
    }

    if (initialData) {
      setForm({
        name: initialData.name ?? "",
        email: initialData.email ?? "",
        phone: initialData.phone ?? "",
        username: initialData.username ?? "",
        password: "",
        role: initialData.role ?? "USER",
      });
    } else {
      setForm(initialForm);
    }
  }, [open, initialData]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      role: form.role,
      ...(form.username.trim() ? { username: form.username.trim().toLowerCase() } : {}),
      ...(form.password.trim() ? { password: form.password } : {}),
    };

    await onSubmit(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] p-0 flex flex-col overflow-hidden">
        <DialogHeader className="sticky top-0 z-10 border-b bg-background px-6 py-4">
          <DialogTitle>{initialData ? "Edit User" : "Create User"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Update user details and role." : "Create a new ADMIN or USER account."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-3 overflow-y-auto px-6 py-4">
          <div className="space-y-1">
            <label htmlFor="user-name" className="text-sm font-medium text-slate-700">Full Name</label>
          <Input
            id="user-name"
            placeholder="Full name"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          />
          </div>

          <div className="space-y-1">
            <label htmlFor="user-email" className="text-sm font-medium text-slate-700">Email</label>
          <Input
            id="user-email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          />
          </div>

          <div className="space-y-1">
            <label htmlFor="user-phone" className="text-sm font-medium text-slate-700">Phone</label>
          <Input
            id="user-phone"
            placeholder="Phone"
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
          />
          </div>

          <div className="space-y-1">
            <label htmlFor="user-username" className="text-sm font-medium text-slate-700">Username</label>
          <Input
            id="user-username"
            placeholder="Username (optional)"
            value={form.username}
            onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
          />
          </div>

          <div className="space-y-1">
            <label htmlFor="user-password" className="text-sm font-medium text-slate-700">
              {initialData ? "New Password" : "Password"}
            </label>
          <Input
            id="user-password"
            type="password"
            placeholder={initialData ? "New password (optional)" : "Password"}
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Role</label>
          <Select value={form.role} onValueChange={(value) => setForm((prev) => ({ ...prev, role: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USER">USER</SelectItem>
              <SelectItem value="ADMIN">ADMIN</SelectItem>
            </SelectContent>
          </Select>
          </div>
          </div>

          <DialogFooter className="sticky bottom-0 z-10 border-t bg-background px-6 py-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {initialData ? "Save Changes" : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
