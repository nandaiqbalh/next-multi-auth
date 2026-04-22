import { getAllCustomersAction } from "@/lib/actions/customer.actions";
import CustomerManagerClient from "@/components/admin/CustomerManagerClient";

export const metadata = {
  title: "Customers — Damai RO",
};

export default async function AdminCustomersPage({ searchParams }) {
  const params = await Promise.resolve(searchParams ?? {});
  const response = await getAllCustomersAction({
    search: params.search ?? "",
    page: Number(params.page ?? 1),
    limit: 10,
  });

  const customers = response.success ? response.data.items : [];
  const meta = response.success
    ? { total: response.data.total, page: response.data.page, totalPages: response.data.totalPages, search: params.search ?? "" }
    : { total: 0, page: 1, totalPages: 1, search: params.search ?? "" };

  return <CustomerManagerClient customers={customers} meta={meta} />;
}