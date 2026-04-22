import bcrypt from "bcrypt";
import { createUser, deleteUser, findUserByEmail, findUserById, findUserByPhone, findUserByUsername, listUsers, updateUser } from "@/lib/repositories/user.repository";
import { createUserSchema, updateUserSchema, userFilterSchema } from "@/lib/validations/user.schema";
import { flattenZodErrors } from "@/lib/validations/helpers";

const SALT_ROUNDS = 12;

function firstErrorMessage(errors, fallback = "Invalid input.") {
  return Object.values(errors).find(Boolean) ?? fallback;
}

async function ensureUserUniqueness({ email, phone, username, userId }) {
  if (email) {
    const emailRes = await findUserByEmail(email);
    if (emailRes.success && emailRes.data && emailRes.data.id !== userId) {
      return { success: false, message: "Email is already registered." };
    }
  }

  if (phone) {
    const phoneRes = await findUserByPhone(phone);
    if (phoneRes.success && phoneRes.data && phoneRes.data.id !== userId) {
      return { success: false, message: "Phone number is already in use." };
    }
  }

  if (username) {
    const usernameRes = await findUserByUsername(username);
    if (usernameRes.success && usernameRes.data && usernameRes.data.id !== userId) {
      return { success: false, message: "Username is already taken." };
    }
  }

  return { success: true };
}

export async function getUsersService(params = {}) {
  const parsed = userFilterSchema.safeParse(params);
  if (!parsed.success) {
    const errors = flattenZodErrors(parsed.error);
    return { success: false, message: firstErrorMessage(errors), errors };
  }

  return listUsers(parsed.data);
}

export async function createUserService(payload) {
  const parsed = createUserSchema.safeParse(payload);
  if (!parsed.success) {
    const errors = flattenZodErrors(parsed.error);
    return { success: false, message: firstErrorMessage(errors), errors };
  }

  const { name, email, phone, password, role, username } = parsed.data;
  const uniqueCheck = await ensureUserUniqueness({ email, phone, username });
  if (!uniqueCheck.success) return uniqueCheck;

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  return createUser({
    name,
    email,
    phone,
    password: hashedPassword,
    role,
    username,
  });
}

export async function updateUserService(userId, payload) {
  const parsed = updateUserSchema.safeParse(payload);
  if (!parsed.success) {
    const errors = flattenZodErrors(parsed.error);
    return { success: false, message: firstErrorMessage(errors), errors };
  }

  if (!Object.values(parsed.data).some((value) => value !== undefined)) {
    return { success: false, message: "At least one field must be provided." };
  }

  const userRes = await findUserById(userId);
  if (!userRes.success || !userRes.data) {
    return { success: false, message: "User not found." };
  }

  const uniqueCheck = await ensureUserUniqueness({
    email: parsed.data.email,
    phone: parsed.data.phone,
    username: parsed.data.username,
    userId,
  });
  if (!uniqueCheck.success) return uniqueCheck;

  const nextData = { ...parsed.data };
  if (nextData.password) {
    nextData.password = await bcrypt.hash(nextData.password, SALT_ROUNDS);
  }

  return updateUser(userId, nextData);
}

export async function deleteUserService(userId) {
  const userRes = await findUserById(userId);
  if (!userRes.success || !userRes.data) {
    return { success: false, message: "User not found." };
  }

  return deleteUser(userId);
}