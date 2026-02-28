// components/auth/AuthDivider.jsx

export default function AuthDivider({ label = "Or" }) {
  return (
    <div className="flex items-center gap-2 my-4">
      <div className="flex-1 h-px bg-gray-300" />
      <span className="text-gray-500 text-xs">{label}</span>
      <div className="flex-1 h-px bg-gray-300" />
    </div>
  );
}