import { getAllProductsAction } from "@/lib/actions/product.actions";
import ProductManagerClient from "@/components/admin/ProductManagerClient";

export const metadata = {
  title: "Products - Damai RO",
};

export default async function AdminProductsPage({ searchParams }) {
  const params = await Promise.resolve(searchParams ?? {});
  const response = await getAllProductsAction({
    search: params.search ?? "",
    page: Number(params.page ?? 1),
    limit: 10,
  });

  const products = response.success ? response.data.items : [];
  const meta = response.success
    ? { total: response.data.total, page: response.data.page, totalPages: response.data.totalPages, search: params.search ?? "" }
    : { total: 0, page: 1, totalPages: 1, search: params.search ?? "" };

  return <ProductManagerClient products={products} meta={meta} />;
}
