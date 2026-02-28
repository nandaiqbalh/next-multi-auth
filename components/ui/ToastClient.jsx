"use client";

import { useEffect } from "react";
import { toast } from "./sonner";

/**
 * Displays appropriate toast messages based on passed props.
 *
 * Props:
 * - registered: boolean – show registration success
 * - welcome: boolean – show login success
 */
export default function ToastClient({ registered, welcome }) {
  useEffect(() => {
    if (registered) {
      toast.success("Account created successfully! Please log in.");
    }
    if (welcome) {
      toast.success("Logged in successfully!");
    }
  }, [registered, welcome]);

  return null;
}
