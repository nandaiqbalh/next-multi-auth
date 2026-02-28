// lib/repositories/user.repository.js

import prisma from "@/lib/prisma";
import { GeneralResponse } from "@/lib/model/response";

/**
 * Cari user berdasarkan email (case-insensitive via normalisasi sebelum query).
 * @param {string} email
 * @returns {Promise<import("@prisma/client").User | null>}
 */
export async function findUserByEmail(email) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
    if (!user) return new GeneralResponse(false, "User not found.", null);
    return new GeneralResponse(true, "Success.", user);
  } catch (e) {
    return new GeneralResponse(false, e.message || "Error", null);
  }
}

/**
 * Cari user berdasarkan username.
 * @param {string} username
 * @returns {Promise<import("@prisma/client").User | null>}
 */
export async function findUserByUsername(username) {
  try {
    const user = await prisma.user.findUnique({
      where: { username: username.toLowerCase().trim() },
    });
    if (!user) return new GeneralResponse(false, "User not found.", null);
    return new GeneralResponse(true, "Success.", user);
  } catch (e) {
    return new GeneralResponse(false, e.message || "Error", null);
  }
}

/**
 * Cari user berdasarkan nomor telepon.
 * @param {string} phone
 * @returns {Promise<import("@prisma/client").User | null>}
 */
export async function findUserByPhone(phone) {
  try {
    const user = await prisma.user.findUnique({
      where: { phone: phone.trim() },
    });
    if (!user) return new GeneralResponse(false, "User not found.", null);
    return new GeneralResponse(true, "Success.", user);
  } catch (e) {
    return new GeneralResponse(false, e.message || "Error", null);
  }
}

/**
 * Cari user berdasarkan id.
 * @param {string} id
 * @returns {Promise<import("@prisma/client").User | null>}
 */
export async function findUserById(id) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) return new GeneralResponse(false, "User not found.", null);
    return new GeneralResponse(true, "Success.", user);
  } catch (e) {
    return new GeneralResponse(false, e.message || "Error", null);
  }
}

/**
 * Buat user baru.
 * @param {{ name: string, username?: string, phone?: string, email: string, password: string, role?: "SUPERADMIN"|"ADMIN"|"USER" }} data
 * @returns {Promise<import("@prisma/client").User>}
 */
export async function createUser({ name, username, phone, email, password, role = "USER" }) {
  try {
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        username: username ? username.toLowerCase().trim() : null,
        phone: phone?.trim() || null,
        email: email.toLowerCase().trim(),
        password,            // sudah di-hash sebelum masuk sini
        role,
      },
    });
    return new GeneralResponse(true, "User created successfully.", user);
  } catch (e) {
    // handle prisma unique constraint errors for readability
    if (e.code === "P2002" && e.meta && e.meta.target) {
      const field = Array.isArray(e.meta.target) ? e.meta.target[0] : e.meta.target;
      let msg = "Unique constraint failed.";
      switch (field) {
        case "email":
          msg = "Email is already registered.";
          break;
        case "username":
          msg = "Username is already taken.";
          break;
        case "phone":
          msg = "Phone number is already in use.";
          break;
      }
      return new GeneralResponse(false, msg, null);
    }
    return new GeneralResponse(false, e.message || "Error", null);
  }
}

/**
 * Update profil user atau password.
 * @param {string} id
 * @param {Partial<{ name: string, username: string, phone: string, image: string, password: string }>} data
 */
export async function updateUser(id, data) {
  try {
    const user = await prisma.user.update({
      where: { id },
      data,
    });
    return new GeneralResponse(true, "User updated successfully.", user);
  } catch (e) {
    return new GeneralResponse(false, e.message || "Error", null);
  }
}