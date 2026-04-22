"use server";

import { validateSession } from "@/lib/validations/validate-session";
import { createProductService, deleteProductService, getProductsService, updateProductService } from "@/lib/services/product.service";

async function requireAdminSession() {
  const sessionRes = await validateSession();
  if (!sessionRes.success) return sessionRes;
  if (sessionRes.data.user.role !== "ADMIN" && sessionRes.data.user.role !== "SUPERADMIN") {
    return { success: false, message: "Forbidden." };
  }
  return sessionRes;
}

export async function getAllProductsAction(params = {}) {
  const sessionRes = await requireAdminSession();
  if (!sessionRes.success) return sessionRes;
  return getProductsService(params);
}

export async function createProductAction(payload) {
  const sessionRes = await requireAdminSession();
  if (!sessionRes.success) return sessionRes;
  return createProductService(payload);
}

export async function updateProductAction(productId, payload) {
  const sessionRes = await requireAdminSession();
  if (!sessionRes.success) return sessionRes;
  return updateProductService(productId, payload);
}

export async function deleteProductAction(productId) {
  const sessionRes = await requireAdminSession();
  if (!sessionRes.success) return sessionRes;
  return deleteProductService(productId);
}
