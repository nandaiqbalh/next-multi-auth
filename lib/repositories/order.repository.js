import prisma from "@/lib/prisma";
import { GeneralResponse } from "@/lib/model/response";

export async function findOrderById(id) {
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: {
          include: { user: true },
        },
      },
    });
    if (!order) return new GeneralResponse(false, "Order not found.", null);
    return new GeneralResponse(true, "Success.", order);
  } catch (e) {
    return new GeneralResponse(false, e.message || "Error", null);
  }
}

export async function listOrders({ customerId, status, search = "", page = 1, limit = 10 } = {}) {
  try {
    const where = {
      ...(customerId ? { customerId } : {}),
      ...(status ? { status } : {}),
      ...(search
        ? {
            OR: [
              { customer: { user: { name: { contains: search, mode: "insensitive" } } } },
              { customer: { user: { email: { contains: search, mode: "insensitive" } } } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          customer: {
            include: { user: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return new GeneralResponse(true, "Success.", {
      items,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (e) {
    return new GeneralResponse(false, e.message || "Error", null);
  }
}

export async function createOrder(data) {
  try {
    const order = await prisma.order.create({
      data: {
        customerId: data.customerId,
        quantity: data.quantity,
        price: data.price,
        totalPrice: data.totalPrice,
        status: data.status ?? "PENDING",
      },
    });
    return new GeneralResponse(true, "Order created successfully.", order);
  } catch (e) {
    return new GeneralResponse(false, e.message || "Error", null);
  }
}

export async function updateOrderStatus(id, status) {
  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });
    return new GeneralResponse(true, "Order status updated successfully.", order);
  } catch (e) {
    return new GeneralResponse(false, e.message || "Error", null);
  }
}

export async function getOrderSummary() {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [todayOrders, todayRevenue, totalOrders] = await Promise.all([
      prisma.order.count({ where: { createdAt: { gte: startOfDay } } }),
      prisma.order.aggregate({
        where: { createdAt: { gte: startOfDay } },
        _sum: { totalPrice: true },
      }),
      prisma.order.count(),
    ]);

    return new GeneralResponse(true, "Success.", {
      todayOrders,
      todayRevenue: todayRevenue._sum.totalPrice ?? 0,
      totalOrders,
    });
  } catch (e) {
    return new GeneralResponse(false, e.message || "Error", null);
  }
}