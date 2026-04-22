"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import LoadingState from "@/components/common/LoadingState";
import TablePagination from "@/components/common/TablePagination";
import UserFormDialog from "@/components/admin/UserFormDialog";
import { createUserAction, deleteUserAction, updateUserAction } from "@/lib/actions/user.actions";

export default function UserManagerClient({ users, meta }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState(meta.search ?? "");
  const [roleFilter, setRoleFilter] = useState(meta.role ?? "");

  useEffect(() => {
    setSearch(meta.search ?? "");
    setRoleFilter(meta.role ?? "");
  }, [meta.search, meta.role]);

  const syncFilters = () => {
    const params = new URLSearchParams(searchParams?.toString());
    if (search) params.set("search", search);
    else params.delete("search");
    if (roleFilter) params.set("role", roleFilter);
    else params.delete("role");
    params.delete("page");
    router.push(`/admin/users?${params.toString()}`);
  };

  const handleCreateClick = () => {
    setEditingUser(null);
    setDialogOpen(true);
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setDialogOpen(true);
  };

  const handleSubmit = async (payload) => {
    let result;

    if (editingUser) {
      result = await updateUserAction(editingUser.id, payload);
    } else {
      result = await createUserAction(payload);
    }

    if (!result?.success) {
      toast.error(result?.message || "Operation failed.");
      return;
    }

    toast.success(result.message || "Saved.");
    setDialogOpen(false);
    setEditingUser(null);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    startTransition(async () => {
      const result = await deleteUserAction(deleteTarget.id);
      if (!result?.success) {
        toast.error(result?.message || "Delete failed.");
        return;
      }
      toast.success(result.message || "User deleted.");
      setDeleteTarget(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Create and manage ADMIN and USER accounts."
        actionLabel="Create User"
        onAction={handleCreateClick}
        actionDisabled={isPending}
      />

      <Card className="shadow-sm">
        <CardContent className="space-y-4 p-4 md:p-6">
          <div className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
            <Input placeholder="Search name, email, phone" value={search} onChange={(event) => setSearch(event.target.value)} />
            <Select value={roleFilter || "all"} onValueChange={(value) => setRoleFilter(value === "all" ? "" : value)}>
              <SelectTrigger>
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="ADMIN">ADMIN</SelectItem>
                <SelectItem value="USER">USER</SelectItem>
              </SelectContent>
            </Select>
            <Button type="button" variant="outline" onClick={syncFilters}>Filter</Button>
          </div>

          {isPending ? <LoadingState message="Saving changes..." /> : null}

          {users.length === 0 ? (
            <EmptyState title="No users found" description="Try adjusting the filter, or create a new user." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-medium text-slate-900">{user.name || "-"}</div>
                      <div className="text-xs text-slate-500">{user.username || "No username"}</div>
                    </TableCell>
                    <TableCell>
                      <div>{user.email}</div>
                      <div className="text-slate-500">{user.phone || "-"}</div>
                    </TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button type="button" size="icon-sm" variant="outline" onClick={() => handleEditClick(user)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button type="button" size="icon-sm" variant="destructive" onClick={() => setDeleteTarget(user)}>
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

      <UserFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editingUser}
        isSubmitting={isPending}
        onSubmit={(payload) => {
          startTransition(async () => {
            await handleSubmit(payload);
          });
        }}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete user"
        description={deleteTarget ? `Delete ${deleteTarget.name || deleteTarget.email}?` : "Delete selected user?"}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onClose={() => setDeleteTarget(null)}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}