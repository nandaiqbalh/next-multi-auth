// components/common/ClientLayout.jsx
"use client";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "../ui/sonner";

export default function ClientLayout({ children }) {
  return (
    <SessionProvider>
      {children}
      <Toaster />
    </SessionProvider>
  );
}
