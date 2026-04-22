import { z } from "zod";
import { flattenZodErrors } from "./helpers";

export const createProductSchema = z.object({
  name: z.string().trim().min(1, "Product name is required."),
  price: z.coerce.number().int().min(1, "Price must be at least 1."),
});

export const updateProductSchema = z.object({
  name: z.string().trim().min(1, "Product name is required.").optional(),
  price: z.coerce.number().int().min(1, "Price must be at least 1.").optional(),
});

export const productFilterSchema = z.object({
  search: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export { flattenZodErrors };
