import { z } from "zod";
import { emailSchema, nameSchema, passwordSchema, phoneSchema, usernameSchema } from "./auth.schema";
import { flattenZodErrors } from "./helpers";

export const userRoleSchema = z.enum(["SUPERADMIN", "ADMIN", "USER"]);

export const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  role: userRoleSchema.default("USER"),
  username: usernameSchema.optional(),
});

export const updateUserSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional(),
  phone: phoneSchema.optional(),
  password: passwordSchema.optional(),
  role: userRoleSchema.optional(),
  username: usernameSchema.optional(),
});

export const userFilterSchema = z.object({
  search: z.string().trim().optional(),
  role: userRoleSchema.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export { flattenZodErrors };