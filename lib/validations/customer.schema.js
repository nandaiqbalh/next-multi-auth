import { z } from "zod";
import { emailSchema, nameSchema, passwordSchema, phoneSchema } from "./auth.schema";
import { flattenZodErrors } from "./helpers";

export const createCustomerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  address: z.string().min(1, "Address is required.").trim(),
  note: z.string().max(500, "Note is too long.").trim().optional().or(z.literal("")),
});

export const updateCustomerSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional(),
  phone: phoneSchema.optional(),
  password: passwordSchema.optional(),
  address: z.string().trim().optional(),
  note: z.string().max(500, "Note is too long.").trim().optional().or(z.literal("")),
});

export const customerFilterSchema = z.object({
  search: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export { flattenZodErrors };