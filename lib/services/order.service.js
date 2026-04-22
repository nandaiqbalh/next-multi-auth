import { createOrderSchema, orderFilterSchema, updateOrderStatusSchema } from "@/lib/validations/order.schema";
import { flattenZodErrors } from "@/lib/validations/helpers";
import { findCustomerById, findCustomerByUserId } from "@/lib/repositories/customer.repository";
import { createOrder, findOrderById, getOrderSummary, listOrders, updateOrderStatus } from "@/lib/repositories/order.repository";
import { findProductsByIds } from "@/lib/repositories/product.repository";

const ORDER_TRANSITIONS = {
  PENDING: ["IN_PROGRESS"],
  IN_PROGRESS: ["SUCCESS", "CANCEL"],
  SUCCESS: [],
  CANCEL: [],
};

function firstErrorMessage(errors, fallback = "Invalid input.") {
  return Object.values(errors).find(Boolean) ?? fallback;
}

function canTransitionOrderStatus(currentStatus, nextStatus) {
  return ORDER_TRANSITIONS[currentStatus]?.includes(nextStatus) ?? false;
}

export { canTransitionOrderStatus };

export async function createOrderService(payload) {
  const parsed = createOrderSchema.safeParse(payload);
  if (!parsed.success) {
    const errors = flattenZodErrors(parsed.error);
    return { success: false, message: firstErrorMessage(errors), errors };
  }

  const customerRes = await findCustomerById(parsed.data.customerId);
  if (!customerRes.success || !customerRes.data) {
    return { success: false, message: "Customer not found." };
  }

  const productIds = [...new Set(parsed.data.items.map((item) => item.productId))];
  const productsRes = await findProductsByIds(productIds);
  if (!productsRes.success) {
    return { success: false, message: productsRes.message || "Unable to load products." };
  }

  const productMap = new Map(productsRes.data.map((product) => [product.id, product]));
  const items = [];
  let totalPrice = 0;

  for (const item of parsed.data.items) {
    const product = productMap.get(item.productId);
    if (!product) {
      return { success: false, message: "One or more products no longer exist." };
    }

    const price = item.price ?? product.price;
    const subtotal = item.quantity * price;
    totalPrice += subtotal;

    items.push({
      productId: item.productId,
      quantity: item.quantity,
      price,
      subtotal,
    });
  }

  return createOrder({
    customerId: parsed.data.customerId,
    items,
    totalPrice,
    status: "PENDING",
  });
}

export async function getAllOrdersService(params = {}) {
  const parsed = orderFilterSchema.safeParse(params);
  if (!parsed.success) {
    const errors = flattenZodErrors(parsed.error);
    return { success: false, message: firstErrorMessage(errors), errors };
  }

  return listOrders(parsed.data);
}

export async function getOrdersByUserService(userId, params = {}) {
  const customerRes = await findCustomerByUserId(userId);
  if (!customerRes.success || !customerRes.data) {
    return { success: true, message: "No customer profile found.", data: { items: [], total: 0, page: 1, limit: 10, totalPages: 1 } };
  }

  const parsed = orderFilterSchema.safeParse(params);
  if (!parsed.success) {
    const errors = flattenZodErrors(parsed.error);
    return { success: false, message: firstErrorMessage(errors), errors };
  }

  return listOrders({ customerId: customerRes.data.id, ...parsed.data });
}

export async function updateOrderStatusService(userContext, payload) {
  const parsed = updateOrderStatusSchema.safeParse(payload);
  if (!parsed.success) {
    const errors = flattenZodErrors(parsed.error);
    return { success: false, message: firstErrorMessage(errors), errors };
  }

  const orderRes = await findOrderById(parsed.data.orderId);
  if (!orderRes.success || !orderRes.data) {
    return { success: false, message: "Order not found." };
  }

  const order = orderRes.data;
  const isOwner = order.customer.userId === userContext.userId;
  const isAdmin = ["ADMIN", "SUPERADMIN"].includes(userContext.role);

  if (!isAdmin && !isOwner) {
    return { success: false, message: "You are not allowed to update this order." };
  }

  if (!canTransitionOrderStatus(order.status, parsed.data.nextStatus)) {
    return { success: false, message: "Invalid status transition." };
  }

  return updateOrderStatus(order.id, parsed.data.nextStatus);
}

export async function getDashboardSummaryService() {
  return getOrderSummary();
}