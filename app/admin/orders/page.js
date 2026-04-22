import { getAllCustomersAction } from "@/lib/actions/customer.actions";
import { getAllOrdersAction } from "@/lib/actions/order.actions";
import { getAllProductsAction } from "@/lib/actions/product.actions";
import OrderManagerClient from "@/components/admin/OrderManagerClient";

export const metadata = {
  title: "Orders — Damai RO",
};

export default async function AdminOrdersPage({ searchParams }) {
  const params = await Promise.resolve(searchParams ?? {});
  const [ordersResponse, customersResponse, productsResponse] = await Promise.all([
    getAllOrdersAction({
      search: params.search ?? "",
      status: params.status ?? undefined,
      page: Number(params.page ?? 1),
      limit: 10,
    }),
    getAllCustomersAction({ page: 1, limit: 100 }),
    getAllProductsAction({ page: 1, limit: 200 }),
  ]);

  const orders = ordersResponse.success ? ordersResponse.data.items : [];
  const customers = customersResponse.success ? customersResponse.data.items : [];
  const products = productsResponse.success ? productsResponse.data.items : [];
  const meta = ordersResponse.success
    ? {
        total: ordersResponse.data.total,
        page: ordersResponse.data.page,
        totalPages: ordersResponse.data.totalPages,
        search: params.search ?? "",
        status: params.status ?? "",
      }
    : { total: 0, page: 1, totalPages: 1, search: params.search ?? "", status: params.status ?? "" };

  return <OrderManagerClient orders={orders} customers={customers} products={products} meta={meta} />;
}