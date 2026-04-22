"use server";

import { validateSession } from "@/lib/validations/validate-session";
import { createOrderService, getAllOrdersService, getDashboardSummaryService, getOrdersByUserService, updateOrderStatusService } from "@/lib/services/order.service";

async function requireAdminSession() {
  const sessionRes = await validateSession();
  if (!sessionRes.success) return sessionRes;
  if (sessionRes.data.user.role !== "ADMIN" && sessionRes.data.user.role !== "SUPERADMIN") {
    return { success: false, message: "Forbidden." };
  }
  return sessionRes;
}

export async function createOrderAction(payload) {
  const sessionRes = await requireAdminSession();
  if (!sessionRes.success) return sessionRes;
  return createOrderService(payload);
}

export async function getAllOrdersAction(params = {}) {
  const sessionRes = await requireAdminSession();
  if (!sessionRes.success) return sessionRes;
  return getAllOrdersService(params);
}

export async function getOrdersByUserAction(params = {}) {
  const sessionRes = await validateSession();
  if (!sessionRes.success) return sessionRes;
  return getOrdersByUserService(sessionRes.data.userId, params);
}

export async function updateOrderStatusAction(payload) {
  const sessionRes = await validateSession();
  if (!sessionRes.success) return sessionRes;
  return updateOrderStatusService({ userId: sessionRes.data.userId, role: sessionRes.data.user.role }, payload);
}

export async function getDashboardSummaryAction() {
  const sessionRes = await requireAdminSession();
  if (!sessionRes.success) return sessionRes;
  return getDashboardSummaryService();
}