import {
  findUserById,
  updateUser,
  findUserByUsername,
  findUserByPhone,
} from "@/lib/repositories/user.repository";
import {
  profileSchema,
  flattenZodErrors,
} from "@/lib/validations/profile.schema";

/**
 * Update user profile with server-side validation.
 * - Validates input schema (name, username, phone, gender, birthdate)
 * - Checks for duplicate username/phone (if being changed)
 * - Updates user record
 * 
 * @param {string} userId - User ID from session
 * @param {{ name: string, username?: string, phone?: string, gender?: string, birthdate?: string }} payload
 * @returns {Promise<{ success: boolean, message: string, errors?: Record<string, string> }>}
 */
export async function updateUserProfile(userId, payload) {
  // ── Schema validation ──
  const parsed = profileSchema.safeParse(payload);
  if (!parsed.success) {
    const errors = flattenZodErrors(parsed.error);
    const firstMessage = Object.values(errors).find(Boolean) ?? "Invalid input.";
    return { success: false, message: firstMessage, errors };
  }

  // ── Verify user exists ──
  const userRes = await findUserById(userId);
  if (!userRes.success || !userRes.data) {
    return { success: false, message: "User not found." };
  }

  const user = userRes.data;
  const { name, username, phone, gender, birthdate } = parsed.data;

  // ── Check for duplicate username (if provided and different) ──
  if (username && username !== user.username) {
    const usernameRes = await findUserByUsername(username);
    if (usernameRes.success && usernameRes.data) {
      return {
        success: false,
        message: "Username is already taken.",
        errors: { username: "Username is already taken." },
      };
    }
  }

  // ── Check for duplicate phone (if provided and different) ──
  if (phone && phone !== user.phone) {
    const phoneRes = await findUserByPhone(phone);
    if (phoneRes.success && phoneRes.data) {
      return {
        success: false,
        message: "Phone number is already in use.",
        errors: { phone: "Phone number is already in use." },
      };
    }
  }

  // ── Update user profile ──
  const updateRes = await updateUser(userId, {
    name,
    ...(username && { username }),
    ...(phone && { phone }),
    ...(gender && { gender }),
    ...(birthdate && { birthdate }),
  });

  if (!updateRes.success) {
    return { success: false, message: updateRes.message };
  }

  return {
    success: true,
    message: "Profile updated successfully.",
  };
}

/**
 * Get user profile by ID.
 * @param {string} userId
 * @returns {Promise<{ success: boolean, message: string, data?: object }>}
 */
export async function getUserProfileById(userId) {
  const userRes = await findUserById(userId);
  if (!userRes.success || !userRes.data) {
    return { success: false, message: "User not found." };
  }

  const user = userRes.data;
  return {
    success: true,
    message: "Profile retrieved successfully.",
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image ?? null,
      username: user.username,
      phone: user.phone,
      gender: user.gender,
      birthdate: user.birthdate,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  };
}