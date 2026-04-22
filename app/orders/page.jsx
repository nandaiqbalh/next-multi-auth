import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getOrdersByUserAction } from "@/lib/actions/order.actions";
import UserOrderList from "@/components/orders/UserOrderList";
import LogoutButton from "@/components/common/LogoutButton";

export const metadata = {
  title: "My Orders — Damai RO",
};

export default async function OrdersPage({ searchParams }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role === "ADMIN" || session.user.role === "SUPERADMIN") {
    redirect("/admin/dashboard");
  }

  const params = await Promise.resolve(searchParams ?? {});
  const response = await getOrdersByUserAction({
    search: params.search ?? "",
    status: params.status ?? undefined,
    page: Number(params.page ?? 1),
    limit: 10,
  });

  const orders = response.success ? response.data.items : [];
  const meta = response.success
    ? { total: response.data.total, page: response.data.page, totalPages: response.data.totalPages, search: params.search ?? "", status: params.status ?? "" }
    : { total: 0, page: 1, totalPages: 1, search: params.search ?? "", status: params.status ?? "" };

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl border border-emerald-100 bg-white/80 p-6 shadow-sm backdrop-blur md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-700">Damai RO</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">My Orders</h1>
            <p className="mt-2 max-w-2xl text-slate-600">Track your delivery status and update the workflow when the order moves forward.</p>
          </div>
          <LogoutButton callbackUrl="/login" />
        </div>

        <UserOrderList orders={orders} meta={meta} />
      </div>
    </main>
  );
}