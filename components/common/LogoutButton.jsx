"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function LogoutButton({ callbackUrl = "/login" }) {
  return (
    <Button type="button" variant="outline" onClick={() => signOut({ callbackUrl })}>
      Logout
    </Button>
  );
}