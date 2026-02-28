"use client";

import { useEffect } from "react";

export default function ConfirmDialog({
  open,
  title,
  description,
  onClose = () => {},

  confirmLabel = "Confirm",
  onConfirm,
  showConfirm = true,

  cancelLabel = "Cancel",
  onCancel,
  showCancel = true,
}) {
  const handleConfirm = onConfirm ?? onClose;
  const handleCancel = onCancel ?? onClose;

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape" && open) onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
        <h2 className="text-xl font-bold text-blue-600 mb-2">{title || "Are you sure?"}</h2>
        {description && <p className="text-sm text-neutral-700 mb-4">{description}</p>}
        <div className="flex justify-end gap-2">
          {showCancel && (
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-neutral-300 text-neutral-600 rounded hover:bg-neutral-100 transition"
            >
              {cancelLabel}
            </button>
          )}
          {showConfirm && (
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {confirmLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

