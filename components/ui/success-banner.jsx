"use client";

export default function SuccessBanner({ children }) {
  return (
    <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded">
      {children}
    </div>
  );
}

