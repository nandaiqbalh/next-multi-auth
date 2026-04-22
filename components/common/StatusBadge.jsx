import { Badge } from "@/components/ui/badge";

const STATUS_STYLES = {
  PENDING: "border-slate-200 bg-slate-100 text-slate-700",
  IN_PROGRESS: "border-amber-200 bg-amber-100 text-amber-800",
  SUCCESS: "border-emerald-200 bg-emerald-100 text-emerald-800",
  CANCEL: "border-red-200 bg-red-100 text-red-700",
};

const STATUS_LABELS = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  SUCCESS: "Success",
  CANCEL: "Cancel",
};

export default function StatusBadge({ status }) {
  return (
    <Badge variant="outline" className={STATUS_STYLES[status] ?? "bg-slate-100 text-slate-700"}>
      {STATUS_LABELS[status] ?? status}
    </Badge>
  );
}