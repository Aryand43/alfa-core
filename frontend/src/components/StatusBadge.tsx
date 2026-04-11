const COLORS: Record<string, string> = {
  pending: "bg-amber-500/80 text-black",
  running: "bg-sky-500/80 text-black",
  success: "bg-emerald-500/80 text-black",
  failure: "bg-rose-500/80 text-black",
};

export default function StatusBadge({ status }: { status: string }) {
  const color = COLORS[status] ?? "bg-slate-600 text-slate-100";

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${color}`}>
      {status}
    </span>
  );
}
