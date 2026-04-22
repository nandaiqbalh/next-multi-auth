"use server";

import { validateSession } from "@/lib/validations/validate-session";
import { createCustomerService, deleteCustomerService, getCustomersService, updateCustomerService } from "@/lib/services/customer.service";

async function requireAdminSession() {
  const sessionRes = await validateSession();
  if (!sessionRes.success) return sessionRes;
  if (sessionRes.data.user.role !== "ADMIN" && sessionRes.data.user.role !== "SUPERADMIN") {
    return { success: false, message: "Forbidden." };
  }
  return sessionRes;
}

export async function getAllCustomersAction(params = {}) {
  const sessionRes = await requireAdminSession();
  if (!sessionRes.success) return sessionRes;
  return getCustomersService(params);
}

export async function createCustomerAction(payload) {
  const sessionRes = await requireAdminSession();
  if (!sessionRes.success) return sessionRes;
  return createCustomerService(payload);
}

export async function updateCustomerAction(customerId, payload) {
  const sessionRes = await requireAdminSession();
  if (!sessionRes.success) return sessionRes;
  return updateCustomerService(customerId, payload);
}

export async function deleteCustomerAction(customerId) {
  const sessionRes = await requireAdminSession();
  if (!sessionRes.success) return sessionRes;
  return deleteCustomerService(customerId);
}