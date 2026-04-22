import { z } from "zod";
import { flattenZodErrors } from "./helpers";

export const orderStatusSchema = z.enum(["PENDING", "IN_PROGRESS", "SUCCESS", "CANCEL"]);

export const createOrderSchema = z.object({
  customerId: z.string().min(1, "Customer is required."),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1."),
  price: z.coerce.number().int().min(1, "Price must be at least 1."),
});

export const updateOrderStatusSchema = z.object({
  orderId: z.string().min(1, "Order is required."),
  nextStatus: orderStatusSchema,
});

export const orderFilterSchema = z.object({
  status: orderStatusSchema.optional(),
  search: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export { flattenZodErrors };