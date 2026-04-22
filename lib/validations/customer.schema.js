import { z } from "zod";
import { nameSchema, phoneSchema } from "./auth.schema";
import { flattenZodErrors } from "./helpers";

const optionalUrlSchema = z.string().trim().url("Must be a valid URL.").optional().or(z.literal(""));

export const createCustomerSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  address: z.string().trim().optional().or(z.literal("")),
  mapUrl: optionalUrlSchema,
  housePhoto: optionalUrlSchema,
  locationNote: z.string().max(500, "Location note is too long.").trim().optional().or(z.literal("")),
  subscriptionNote: z.string().max(500, "Subscription note is too long.").trim().optional().or(z.literal("")),
  note: z.string().max(500, "Note is too long.").trim().optional().or(z.literal("")),
});

export const updateCustomerSchema = z.object({
  name: nameSchema.optional(),
  phone: phoneSchema.optional(),
  address: z.string().trim().optional(),
  mapUrl: optionalUrlSchema,
  housePhoto: optionalUrlSchema,
  locationNote: z.string().max(500, "Location note is too long.").trim().optional().or(z.literal("")),
  subscriptionNote: z.string().max(500, "Subscription note is too long.").trim().optional().or(z.literal("")),
  note: z.string().max(500, "Note is too long.").trim().optional().or(z.literal("")),
});

export const customerFilterSchema = z.object({
  search: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export { flattenZodErrors };