// app/(auth)/login/redirect-if-auth.js
"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function redirectIfAuthenticated() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role === "ADMIN") {
    redirect("/admin/dashboard");
  } else if (session?.user) {
    redirect("/");
  }
}
