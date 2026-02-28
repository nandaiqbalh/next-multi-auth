"use client";

import { ArrowLeft } from "lucide-react";

export default function BackButton({ className = "" }) {
  return (
    <button
      onClick={() => window.history.back()}
      className={`inline-flex items-center justify-center h-10 gap-2.5 border border-neutral-300 text-neutral-950 px-6 text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-neutral-200 hover:text-neutral-950 hover:border-neutral-400 transition-colors duration-150 mb-4 sm:mb-0 ${className}`}
    >
      <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.5} />
      Back
    </button>
  );
}
