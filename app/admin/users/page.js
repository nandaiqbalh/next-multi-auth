// app/admin/users/page.js
//
// User management landing page for administrators. Initially a
// stub; will later contain tables/forms to add/edit/remove users.
//
// original filename comment kept below for clarity:
// app/admin/users/page.jsx
export const metadata = {
  title: "User Management — MultiAuth",
};

export default function AdminUsersPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Users Management</h1>
      <p className="text-neutral-600">Here you can manage application users. (Functionality to be added.)</p>
    </div>
  );
}
