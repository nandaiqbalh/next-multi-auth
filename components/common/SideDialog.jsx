"use client";

import { useEffect } from "react";
import { XIcon } from "lucide-react";

/**
 * SideDialog — slide-in drawer that opens from the left or right side.
 *
 * Props:
 *   open      — boolean, controls visibility
 *   title     — heading shown in the drawer header
 *   side      — "left" (default) or "right"
 *   onClose   — fired when the overlay is clicked or Escape pressed
 *   children  — content inside the drawer
 */
export default function SideDialog({
  open,
  title,
  side = "left",
  onClose = () => {},
  children,
}) {
  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const fromClass = side === "right" ? "translate-x-full" : "-translate-x-full";
  const enterClass = "translate-x-0";

  return (
    <div className="fixed inset-0 z-50">
      {/* overlay */}
      <div
        className="fixed inset-0 bg-black/40 transition-opacity"
        onClick={onClose}
      />

      {/* drawer panel */}
      <div
        className={`fixed top-0 ${side === "right" ? "right-0" : "left-0"} h-full w-72 max-w-[85vw] bg-white shadow-lg transform transition-transform duration-300 ${enterClass} flex flex-col`}
      >
        {/* header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
          <h2 className="text-lg font-semibold">{title || "Menu"}</h2>
          <button
            onClick={onClose}
            className="p-1 text-neutral-500 hover:text-neutral-800 rounded hover:bg-neutral-100 transition"
            aria-label="Close"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* body */}
        <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>
      </div>
    </div>
  );
}
