// app/admin/page.js
import { redirect } from "next/navigation";

export default function AdminIndex() {
  redirect("/admin/dashboard");
}
