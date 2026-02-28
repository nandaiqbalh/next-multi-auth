import { z } from "zod";

export const nameSchema = z
  .string()
  .min(1, "Full name is required.")
  .min(2, "Full name must be at least 2 characters.")
  .max(100, "Full name must not exceed 100 characters.")
  .trim();

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters.")
  .max(30, "Username must not exceed 30 characters.")
  .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores.")
  .trim()
  .toLowerCase()
  .optional()
  .or(z.literal(""));

export const phoneSchema = z
  .string()
  .regex(/^(2|0)[0-9]{8,13}$/, "Invalid phone number format. Example: 081234567890")
  .trim()
  .optional()
  .or(z.literal(""));

export const genderSchema = z.enum(
    ["Male", "Female", "Prefer not to say"],
  { message: "Please select a valid gender." }
);

export const birthdateSchema = z
  .string()
  .refine(
    (date) => !date || /^\d{4}-\d{2}-\d{2}$/.test(date),
    "Invalid date format."
  )
  .refine(
    (date) => {
      if (!date) return true;
      const birthDate = new Date(date);
      const today = new Date();
      return birthDate <= today;
    },
    "Birth date cannot be in the future."
  )
  .refine(
    (date) => {
      if (!date) return true;
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 13;
    },
    "You must be at least 13 years old."
  )
  .optional()
  .or(z.literal(""));

/**
 * Profile update schema
 * Used in: ProfileForm (client), updateProfileAction (server)
 */
export const profileSchema = z.object({
  name: nameSchema,
  username: usernameSchema,
  phone: phoneSchema,
  gender: genderSchema.optional(),
  birthdate: birthdateSchema,
});

/**
 * Helper: flatten Zod errors into a field-keyed object
 */
export function flattenZodErrors(zodError) {
  return Object.fromEntries(
    Object.entries(zodError.flatten().fieldErrors).map(([k, v]) => [k, v?.[0] ?? ""])
  );
}