import { z } from "zod";

// ── Reusable field schemas ──────────────────────────────────────────────────

export const nameSchema = z
  .string()
  .min(1, "Full name is required.")
  .trim();

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters.")
  .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores.")
  .trim()
  .toLowerCase();

export const phoneSchema = z
  .string()
  .regex(/^(2|0)[0-9]{8,13}$/, "Invalid phone number format. Example: 081234567890")
  .trim();

export const emailSchema = z
  .string()
  .min(1, "Email is required.")
  .email("Invalid email format.")
  .trim()
  .toLowerCase();

export const passwordSchema = z
  .string()
  .min(1, "Password is required.")
  .min(8, "Password must be at least 8 characters.")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
  .regex(/[0-9]/, "Password must contain at least one number.")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character.");

export const confirmPasswordSchema = z.string().min(1, "Password confirmation is required.");

// ── Composite schemas ───────────────────────────────────────────────────────

/**
 * Used in: RegisterForm (client), registerAction (server), registerUser (service)
 */
export const registerSchema = z
  .object({
    name: nameSchema,
    username: usernameSchema,
    phone: phoneSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

/**
 * Schema without confirmPassword — used server-side only (service / action)
 * where confirmPassword has already been validated on the client.
 */
export const registerServiceSchema = z.object({
  name: nameSchema,
  username: usernameSchema,
  phone: phoneSchema,
  email: emailSchema,
  password: passwordSchema,
});

/**
 * Used in: LoginForm (client), validateCredentials (service)
 */
export const loginSchema = z
  .object({
    // user may supply either an email address or a username
    identifier: z.string().min(1, "Email or username is required."),
    password: z.string().min(1, "Password is required."),
  })
  .refine((data) => {
    // valid if identifier passes either email or username schema
    const emailValid = emailSchema.safeParse(data.identifier).success;
    const usernameValid = usernameSchema.safeParse(data.identifier).success;
    return emailValid || usernameValid;
  }, {
    message: "Invalid email or username format.",
    path: ["identifier"],
  });

/**
 * Used in: ChangePasswordForm (client), changePasswordAction (server)
 */
export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required."),
    newPassword: passwordSchema,
    confirmNewPassword: confirmPasswordSchema,
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match.",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "New password must be different from current password.",
    path: ["newPassword"],
  });

/**
 * Server-side schema for changing password (without confirmNewPassword)
 */
export const changePasswordServiceSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required."),
    newPassword: passwordSchema,
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "New password must be different from current password.",
    path: ["newPassword"],
  });

// ── Helper: flatten Zod errors into a field-keyed object ───────────────────

/**
 * Converts a ZodError into a flat { field: firstMessage } map.
 * @param {import("zod").ZodError} zodError
 * @returns {Record<string, string>}
 */
export function flattenZodErrors(zodError) {
  return Object.fromEntries(
    Object.entries(zodError.flatten().fieldErrors).map(([k, v]) => [k, v?.[0] ?? ""])
  );
}