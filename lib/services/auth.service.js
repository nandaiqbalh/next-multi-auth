import bcrypt from "bcrypt";
import {
  findUserByEmail,
  findUserByUsername,
  findUserByPhone,
  createUser,
  findUserById,
  updateUser,
} from "@/lib/repositories/user.repository";
import {
  registerServiceSchema,
  loginSchema,
  changePasswordServiceSchema,
  flattenZodErrors,
} from "@/lib/validations/auth.schema";

const SALT_ROUNDS = 12;

/**
 * Validate and create a new user account.
 * @param {{ name: string, username: string, phone: string, email: string, password: string }} payload
 * @returns {Promise<{ success: boolean, message: string, data?: object }>}
 */
export async function registerUser(payload) {
  // ── Schema validation ──
  const parsed = registerServiceSchema.safeParse(payload);
  if (!parsed.success) {
    const errors = flattenZodErrors(parsed.error);
    const firstMessage = Object.values(errors).find(Boolean) ?? "Invalid input.";
    return { success: false, message: firstMessage, data: null, errors };
  }

  const { name, username, phone, email, password } = parsed.data;

  // ── Duplicate check ──
  const emailRes = await findUserByEmail(email);
  if (emailRes.success && emailRes.data) return { success: false, message: "Email is already registered.", data: null };

  const usernameRes = await findUserByUsername(username);
  if (usernameRes.success && usernameRes.data) return { success: false, message: "Username is already taken.", data: null };

  const phoneRes = await findUserByPhone(phone);
  if (phoneRes.success && phoneRes.data) return { success: false, message: "Phone number is already in use.", data: null };

  // ── Hash password & save ──
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const userRes = await createUser({
    name,
    username,
    phone,
    email,
    password: hashedPassword,
    role: "USER",
  });

  if (!userRes.success) {
    // pass along specific message if it's one of the known ones, otherwise generic
    const msg = userRes.message || "Registration failed. Please try again later.";
    return { success: false, message: msg, data: null };
  }

  const user = userRes.data;
  return {
    success: true,
    message: userRes.message,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

/**
 * Validate credentials for NextAuth authorize().
 * @param {{ identifier: string, password: string }} credentials  // email or username
 * @returns {Promise<{ success: boolean, message: string, data?: object }>}
 */
export async function validateCredentials(credentials) {
  // ── Schema validation ──
  const parsed = loginSchema.safeParse(credentials);
  if (!parsed.success) {
    const firstMessage = Object.values(flattenZodErrors(parsed.error)).find(Boolean) ?? "Invalid input.";
    return { success: false, message: firstMessage, data: null };
  }

  const { identifier, password } = parsed.data;

  // determine whether to search by email or username
  let userRes;
  // simple heuristic: if it contains an @, treat as email; otherwise username
  if (identifier.includes("@")) {
    userRes = await findUserByEmail(identifier);
  } else {
    userRes = await findUserByUsername(identifier);
  }

  if (!userRes.success || !userRes.data) {
    return { success: false, message: "Incorrect email/username or password.", data: null };
  }

  const user = userRes.data;
  // if the account was created via OAuth (Google), no password will be set
  if (!user.password) {
    return { success: false, message: "Incorrect email/username or password.", data: null };
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return { success: false, message: "Incorrect email/username or password.", data: null };

  return {
    success: true,
    message: "Login successful.",
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image ?? null,
      role: user.role,
    },
  };
}

/**
 * Change user password with server-side validation.
 * - Validates input schema (oldPassword, newPassword)
 * - Verifies user exists and session is valid
 * - Verifies current password is correct
 * - Prevents password reuse (oldPassword !== newPassword)
 * - Hashes and saves new password
 * 
 * @param {string} userId - User ID from session
 * @param {string} oldPassword - Current password (plain text)
 * @param {string} newPassword - New password (plain text)
 * @returns {Promise<{ success: boolean, message: string, errors?: Record<string, string> }>}
 */
export async function changePassword(userId, oldPassword, newPassword) {
  // ── Input schema validation ──
  // Remove confirmPassword at this point; it was already validated on client
  const parsed = changePasswordServiceSchema.safeParse({ oldPassword, newPassword });
  if (!parsed.success) {
    const errors = flattenZodErrors(parsed.error);
    const firstMessage = Object.values(errors).find(Boolean) ?? "Invalid input.";
    return { success: false, message: firstMessage, errors };
  }

  // ── Verify session: user exists ──
  const userRes = await findUserById(userId);
  if (!userRes.success || !userRes.data) {
    return { success: false, message: "User session is invalid. Please log in again." };
  }

  const user = userRes.data;

  // if user has no password set (oauth account), they cannot change it directly
  if (!user.password) {
    return {
      success: false,
      message: "No password is set for this account. Please log in with Google or set a password first.",
      errors: { oldPassword: "No existing password." },
    };
  }

  // ── Verify current password ──
  const passwordMatch = await bcrypt.compare(oldPassword, user.password);
  if (!passwordMatch) {
    return {
      success: false,
      message: "Current password is incorrect.",
      errors: { oldPassword: "Current password is incorrect." },
    };
  }

  // ── Hash new password and update ──
  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
  const updateRes = await updateUser(userId, { password: hashedPassword });

  if (!updateRes.success) {
    return { success: false, message: updateRes.message };
  }

  return {
    success: true,
    message: "Password changed successfully.",
  };
}

/**
 * Get user profile data.
 * @param {string} userId - User ID from session
 * @returns {Promise<{ success: boolean, message: string, data?: object }>}
 */
export async function getUserProfile(userId) {
  const userRes = await findUserById(userId);
  if (!userRes.success || !userRes.data) {
    return { success: false, message: "User not found." };
  }

  const user = userRes.data;
  return {
    success: true,
    message: "User profile retrieved successfully.",
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image ?? null,
      username: user.username,
      phone: user.phone,
      role: user.role,
    },
  };
}