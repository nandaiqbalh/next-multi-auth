import prisma from "@/lib/prisma";
import { createCustomerSchema, customerFilterSchema, updateCustomerSchema } from "@/lib/validations/customer.schema";
import { flattenZodErrors } from "@/lib/validations/helpers";
import { deleteCustomer, findCustomerById, listCustomers } from "@/lib/repositories/customer.repository";

function firstErrorMessage(errors, fallback = "Invalid input.") {
  return Object.values(errors).find(Boolean) ?? fallback;
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

  const { name, phone, address, mapUrl, housePhoto, locationNote, subscriptionNote, note } = parsed.data;

  try {
    const customer = await prisma.customer.create({
      data: {
        name,
        phone,
        address: address || null,
        mapUrl: mapUrl || null,
        housePhoto: housePhoto || null,
        locationNote: locationNote || null,
        subscriptionNote: subscriptionNote || null,
        note: note || null,
      },
      include: { user: true },
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

  const { name, phone, address, mapUrl, housePhoto, locationNote, subscriptionNote, note } = parsed.data;

  try {
    const updated = await prisma.customer.update({
      where: { id: customerId },
      data: {
        ...(name !== undefined && { name }),
        ...(phone !== undefined && { phone }),
        ...(address !== undefined && { address: address || null }),
        ...(mapUrl !== undefined && { mapUrl: mapUrl || null }),
        ...(housePhoto !== undefined && { housePhoto: housePhoto || null }),
        ...(locationNote !== undefined && { locationNote: locationNote || null }),
        ...(subscriptionNote !== undefined && { subscriptionNote: subscriptionNote || null }),
        ...(note !== undefined && { note: note || null }),
      },
      include: { user: true },
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
    await deleteCustomer(customerId);
    return { success: true, message: "Customer deleted successfully.", data: null };
  } catch (e) {
    return { success: false, message: e.message || "Error", data: null };
  }
}