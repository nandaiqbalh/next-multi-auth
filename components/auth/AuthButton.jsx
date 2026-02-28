
export default function AuthButton({ children, loading = false, type = "submit", onClick, variant = "primary" }) {
  const base = "w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded transition disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  };

  const style = variants[variant] || variants.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={`${base} ${style}`}
    >
      {loading ? (
        <span className="w-4 h-4 border border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}