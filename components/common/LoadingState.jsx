export default function LoadingState({ message = "Loading..." }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-white px-4 py-3 text-sm text-slate-600">
      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
      {message}
    </div>
  );
}
