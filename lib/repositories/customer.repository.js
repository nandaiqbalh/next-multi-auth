import prisma from "@/lib/prisma";
import { GeneralResponse } from "@/lib/model/response";

export async function findCustomerById(id) {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: { user: true, orders: true },
    });
    if (!customer) return new GeneralResponse(false, "Customer not found.", null);
    return new GeneralResponse(true, "Success.", customer);
  } catch (e) {
    return new GeneralResponse(false, e.message || "Error", null);
  }
}

export async function findCustomerByUserId(userId) {
  try {
    const customer = await prisma.customer.findUnique({
      where: { userId },
      include: { user: true, orders: true },
    });
    if (!customer) return new GeneralResponse(false, "Customer not found.", null);
    return new GeneralResponse(true, "Success.", customer);
  } catch (e) {
    return new GeneralResponse(false, e.message || "Error", null);
  }
}

export async function listCustomers({ search = "", page = 1, limit = 10 } = {}) {
  try {
    const where = search
      ? {
          OR: [
            { user: { name: { contains: search, mode: "insensitive" } } },
            { user: { email: { contains: search, mode: "insensitive" } } },
            { user: { phone: { contains: search, mode: "insensitive" } } },
            { address: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        include: {
          user: true,
          _count: { select: { orders: true } },
        },
        orderBy: { user: { createdAt: "desc" } },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.customer.count({ where }),
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