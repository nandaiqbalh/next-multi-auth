"use client";

import { useEffect } from "react";

export default function SuccessDialog({
  open,
  title,
  description,
  onClose,
  confirmLabel = "OK",
  onConfirm,
  showConfirm = true,
}) {
  const handleConfirm = onConfirm ?? onClose;

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape" && open) onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
        <h2 className="text-xl font-bold text-green-600 mb-2">{title || "Succe ss"}</h2>
        {description && <p className="text-sm text-neutral-700 mb-4">{description}</p>}
        <div className="flex justify-end">
          {showConfirm && (
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              {confirmLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

