import { createProduct, deleteProduct, findProductById, listProducts, updateProduct } from "@/lib/repositories/product.repository";
import { createProductSchema, productFilterSchema, updateProductSchema } from "@/lib/validations/product.schema";
import { flattenZodErrors } from "@/lib/validations/helpers";

function firstErrorMessage(errors, fallback = "Invalid input.") {
  return Object.values(errors).find(Boolean) ?? fallback;
}

export async function getProductsService(params = {}) {
  const parsed = productFilterSchema.safeParse(params);
  if (!parsed.success) {
    const errors = flattenZodErrors(parsed.error);
    return { success: false, message: firstErrorMessage(errors), errors };
  }

  return listProducts(parsed.data);
}

export async function createProductService(payload) {
  const parsed = createProductSchema.safeParse(payload);
  if (!parsed.success) {
    const errors = flattenZodErrors(parsed.error);
    return { success: false, message: firstErrorMessage(errors), errors };
  }

  return createProduct(parsed.data);
}

export async function updateProductService(productId, payload) {
  const parsed = updateProductSchema.safeParse(payload);
  if (!parsed.success) {
    const errors = flattenZodErrors(parsed.error);
    return { success: false, message: firstErrorMessage(errors), errors };
  }

  if (!Object.values(parsed.data).some((value) => value !== undefined)) {
    return { success: false, message: "At least one field must be provided." };
  }

  const productRes = await findProductById(productId);
  if (!productRes.success || !productRes.data) {
    return { success: false, message: "Product not found." };
  }

  return updateProduct(productId, parsed.data);
}

export async function deleteProductService(productId) {
  const productRes = await findProductById(productId);
  if (!productRes.success || !productRes.data) {
    return { success: false, message: "Product not found." };
  }

  return deleteProduct(productId);
}
