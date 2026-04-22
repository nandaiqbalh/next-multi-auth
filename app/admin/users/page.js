// app/admin/users/page.js
//
// User management landing page for administrators. Initially a
// stub; will later contain tables/forms to add/edit/remove users.
//
// original filename comment kept below for clarity:
// app/admin/users/page.jsx
export const metadata = {
  title: "User Management — Damai RO",
};

import { getAllUsersAction } from "@/lib/actions/user.actions";
import UserManagerClient from "@/components/admin/UserManagerClient";

export default async function AdminUsersPage({ searchParams }) {
  const params = await Promise.resolve(searchParams ?? {});
  const response = await getAllUsersAction({
    search: params.search ?? "",
    role: params.role ?? undefined,
    page: Number(params.page ?? 1),
    limit: 10,
  });

  const users = response.success ? response.data.items : [];
  const meta = response.success
    ? { total: response.data.total, page: response.data.page, totalPages: response.data.totalPages, search: params.search ?? "", role: params.role ?? "" }
    : { total: 0, page: 1, totalPages: 1, search: params.search ?? "", role: params.role ?? "" };

  return <UserManagerClient users={users} meta={meta} />;
}
