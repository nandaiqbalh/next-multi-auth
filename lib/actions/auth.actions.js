"use server";

import { changePassword, getUserProfile } from "@/lib/services/auth.service";
import { registerUser } from "@/lib/services/auth.service";
import { validateSession } from "@/lib/validations/validate-session";

/**
 * Server action for registration.
 * Can be invoked directly from form action or API route.
 *
 * @param {{ name: string, username: string, phone: string, email: string, password: string }} formData
 * @returns {{ success: boolean, message: string, user?: object }}
 */
export async function registerAction(formData) {
  const res = await registerUser({
    name: formData.name,
    username: formData.username,
    phone: formData.phone,
    email: formData.email,
    password: formData.password,
  });

  if (res.success) {
    return {
      success: true,
      message: res.message,
      user: res.data,
    };
  } else {
    return {
      success: false,
      message: res.message,
      errors: res.errors,
    };
  }
}

/**
 * Server action to change password.
 * - Validates session (user must be authenticated)
 * - Validates input (oldPassword, newPassword, confirmNewPassword)
 * - Calls changePassword service with proper error handling
 *
 * @param {{ oldPassword: string, newPassword: string, confirmNewPassword: string }} data
 * @returns {{ success: boolean, message: string, errors?: Record<string, string> }}
 */
export async function changePasswordAction({
  oldPassword,
  newPassword,
  confirmNewPassword,
}) {
  // ── Validate session ──
  const sessionRes = await validateSession();
  if (!sessionRes.success) {
    return {
      success: false,
      message: sessionRes.message,
    };
  }

  const userId = sessionRes.data.userId;

  // ── Basic input validation ──
  if (!oldPassword || !newPassword || !confirmNewPassword) {
    return {
      success: false,
      message: "All fields are required.",
    };
  }

  // ── Verify passwords match ──
  if (newPassword !== confirmNewPassword) {
    return {
      success: false,
      message: "New passwords do not match.",
      errors: { confirmNewPassword: "Passwords do not match." },
    };
  }

  // ── Call service for validation and password change ──
  const res = await changePassword(userId, oldPassword, newPassword);

  return {
    success: res.success,
    message: res.message,
    ...(res.errors && { errors: res.errors }),
  };
}

/**
 * Server action to get user profile.
 * - Validates session
 * - Retrieves and returns user profile data
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
  const res = await getUserProfile(userId);

  return {
    success: res.success,
    message: res.message,
    ...(res.data && { data: res.data }),
  };
}