import prisma from "@/lib/prisma";
import { GeneralResponse } from "@/lib/model/response";

export async function findProductById(id) {
  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return new GeneralResponse(false, "Product not found.", null);
    return new GeneralResponse(true, "Success.", product);
  } catch (e) {
    return new GeneralResponse(false, e.message || "Error", null);
  }
}

export async function findProductsByIds(ids = []) {
  try {
    if (!ids.length) return new GeneralResponse(true, "Success.", []);
    const items = await prisma.product.findMany({
      where: { id: { in: ids } },
    });
    return new GeneralResponse(true, "Success.", items);
  } catch (e) {
    return new GeneralResponse(false, e.message || "Error", null);
  }
}

export async function listProducts({ search = "", page = 1, limit = 10 } = {}) {
  try {
    const where = search
      ? { name: { contains: search, mode: "insensitive" } }
      : {};

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
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

export async function createProduct({ name, price }) {
  try {
    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        price,
      },
    });
    return new GeneralResponse(true, "Product created successfully.", product);
  } catch (e) {
    return new GeneralResponse(false, e.message || "Error", null);
  }
}

export async function updateProduct(id, data) {
  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name.trim() }),
        ...(data.price !== undefined && { price: data.price }),
      },
    });
    return new GeneralResponse(true, "Product updated successfully.", product);
  } catch (e) {
    return new GeneralResponse(false, e.message || "Error", null);
  }
}

export async function deleteProduct(id) {
  try {
    const product = await prisma.product.delete({ where: { id } });
    return new GeneralResponse(true, "Product deleted successfully.", product);
  } catch (e) {
    return new GeneralResponse(false, e.message || "Error", null);
  }
}
