"use server";

import { validateSession } from "@/lib/validations/validate-session";
import { createUserService, deleteUserService, getUsersService, updateUserService } from "@/lib/services/user.service";

async function requireAdminSession() {
  const sessionRes = await validateSession();
  if (!sessionRes.success) return sessionRes;
  if (sessionRes.data.user.role !== "ADMIN" && sessionRes.data.user.role !== "SUPERADMIN") {
    return { success: false, message: "Forbidden." };
  }
  return sessionRes;
}

export async function getAllUsersAction(params = {}) {
  const sessionRes = await requireAdminSession();
  if (!sessionRes.success) return sessionRes;
  return getUsersService(params);
}

export async function createUserAction(payload) {
  const sessionRes = await requireAdminSession();
  if (!sessionRes.success) return sessionRes;
  return createUserService(payload);
}

export async function updateUserAction(userId, payload) {
  const sessionRes = await requireAdminSession();
  if (!sessionRes.success) return sessionRes;
  return updateUserService(userId, payload);
}

export async function deleteUserAction(userId) {
  const sessionRes = await requireAdminSession();
  if (!sessionRes.success) return sessionRes;
  return deleteUserService(userId);
}