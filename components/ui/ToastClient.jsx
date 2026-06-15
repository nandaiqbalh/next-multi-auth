"use client";

import { useEffect, useRef } from "react";
import { toast } from "./sonner";

/**
 * Displays appropriate toast messages based on passed props.
 *
 * Props:
 * - registered: boolean – show registration success
 * - welcome: boolean – show login success
 */
export default function ToastClient({ registered, welcome }) {
  const hasShown = useRef(false);

  useEffect(() => {
    if (hasShown.current) return;
    if (registered) {
      toast.success("Account created successfully! Please log in.");
      hasShown.current = true;
    } else if (welcome) {
      toast.success("Logged in successfully!");
      hasShown.current = true;
    }
  }, [registered, welcome]);

  return null;
}
