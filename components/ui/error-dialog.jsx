"use client";

import { useEffect } from "react";

export default function ErrorDialog({ open, title, description, onClose }) {
  // close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape" && open) onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
        <h2 className="text-xl font-bold text-rose-600 mb-2">{title || "Error"}</h2>
        <p className="text-sm text-neutral-700 mb-4">
          {description || "An unexpected error occurred. Please try again."}
        </p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

