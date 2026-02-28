"use server";

import { validateSession } from "@/lib/validations/validate-session";
import { updateUserProfile, getUserProfileById } from "@/lib/services/profile.service";

/**
 * Server action to update user profile.
 * - Validates session
 * - Calls updateUserProfile service
 * - Returns success/error response
 *
 * @param {{ name: string, username?: string, phone?: string, gender?: string, birthdate?: string }} data
 * @returns {{ success: boolean, message: string, errors?: Record<string, string> }}
 */
export async function updateProfileAction(data) {
  // ── Validate session ──
  const sessionRes = await validateSession();
  if (!sessionRes.success) {
    return {
      success: false,
      message: sessionRes.message,
    };
  }

  const userId = sessionRes.data.userId;

  // ── Call service for validation and update ──
  const res = await updateUserProfile(userId, {
    name: data.name,
    username: data.username,
    phone: data.phone,
    gender: data.gender,
    birthdate: data.birthdate,
  });

  return {
    success: res.success,
    message: res.message,
    ...(res.errors && { errors: res.errors }),
  };
}

/**
 * Server action to get user profile.
 * - Validates session
 * - Retrieves user profile data
 *
 * @returns {{ success: boolean, message: string, data?: object }}
 */
export async function getProfileAction() {
  // ── Validate session ──
  const sessionRes = await validateSession();
  if (!sessionRes.success) {
    return {
      success: false,
      message: sessionRes.message,
    };
  }

  const userId = sessionRes.data.userId;

  // ── Get profile from service ──
  const res = await getUserProfileById(userId);

  return {
    success: res.success,
    message: res.message,
    ...(res.data && { data: res.data }),
  };
}