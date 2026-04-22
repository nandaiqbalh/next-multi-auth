import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { createCustomerSchema, customerFilterSchema, updateCustomerSchema } from "@/lib/validations/customer.schema";
import { flattenZodErrors } from "@/lib/validations/helpers";
import { deleteUser, findUserByEmail, findUserByPhone } from "@/lib/repositories/user.repository";
import { findCustomerById, listCustomers } from "@/lib/repositories/customer.repository";

const SALT_ROUNDS = 12;

function firstErrorMessage(errors, fallback = "Invalid input.") {
  return Object.values(errors).find(Boolean) ?? fallback;
}

async function ensureUserIdentityAvailable({ email, phone, userId }) {
  const emailRes = await findUserByEmail(email);
  if (emailRes.success && emailRes.data && emailRes.data.id !== userId) {
    return { success: false, message: "Email is already registered." };
  }

  const phoneRes = await findUserByPhone(phone);
  if (phoneRes.success && phoneRes.data && phoneRes.data.id !== userId) {
    return { success: false, message: "Phone number is already in use." };
  }

  return { success: true };
}

export async function getCustomersService(params = {}) {
  const parsed = customerFilterSchema.safeParse(params);
  if (!parsed.success) {
    const errors = flattenZodErrors(parsed.error);
    return { success: false, message: firstErrorMessage(errors), errors };
  }

  return listCustomers(parsed.data);
}

export async function createCustomerService(payload) {
  const parsed = createCustomerSchema.safeParse(payload);
  if (!parsed.success) {
    const errors = flattenZodErrors(parsed.error);
    return { success: false, message: firstErrorMessage(errors), errors };
  }

  const { name, email, phone, password, address, note } = parsed.data;
  const uniqueCheck = await ensureUserIdentityAvailable({ email, phone });
  if (!uniqueCheck.success) return uniqueCheck;

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    const customer = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          phone,
          password: hashedPassword,
          role: "USER",
        },
      });

      return tx.customer.create({
        data: {
          userId: user.id,
          address,
          note: note || null,
        },
        include: { user: true },
      });
    });

    return { success: true, message: "Customer created successfully.", data: customer };
  } catch (e) {
    return { success: false, message: e.message || "Error", data: null };
  }
}

export async function updateCustomerService(customerId, payload) {
  const parsed = updateCustomerSchema.safeParse(payload);
  if (!parsed.success) {
    const errors = flattenZodErrors(parsed.error);
    return { success: false, message: firstErrorMessage(errors), errors };
  }

  if (!Object.values(parsed.data).some((value) => value !== undefined)) {
    return { success: false, message: "At least one field must be provided." };
  }

  const customerRes = await findCustomerById(customerId);
  if (!customerRes.success || !customerRes.data) {
    return { success: false, message: "Customer not found." };
  }

  const customer = customerRes.data;
  const { name, email, phone, password, address, note } = parsed.data;

  if (email && email !== customer.user.email) {
    const uniqueCheck = await ensureUserIdentityAvailable({ email, phone: phone ?? customer.user.phone, userId: customer.userId });
    if (!uniqueCheck.success) return uniqueCheck;
  }

  if (phone && phone !== customer.user.phone) {
    const uniqueCheck = await ensureUserIdentityAvailable({ email: email ?? customer.user.email, phone, userId: customer.userId });
    if (!uniqueCheck.success) return uniqueCheck;
  }

  const nextPassword = password ? await bcrypt.hash(password, SALT_ROUNDS) : null;

  try {
    const updated = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: customer.userId },
        data: {
          ...(name && { name }),
          ...(email && { email }),
          ...(phone && { phone }),
          ...(nextPassword && { password: nextPassword }),
        },
      });

      return tx.customer.update({
        where: { id: customerId },
        data: {
          ...(address !== undefined && { address: address || null }),
          ...(note !== undefined && { note: note || null }),
        },
        include: { user: true },
      });
    });

    return { success: true, message: "Customer updated successfully.", data: updated };
  } catch (e) {
    return { success: false, message: e.message || "Error", data: null };
  }
}

export async function deleteCustomerService(customerId) {
  const customerRes = await findCustomerById(customerId);
  if (!customerRes.success || !customerRes.data) {
    return { success: false, message: "Customer not found." };
  }

  try {
    await deleteUser(customerRes.data.userId);
    return { success: true, message: "Customer deleted successfully.", data: null };
  } catch (e) {
    return { success: false, message: e.message || "Error", data: null };
  }
}