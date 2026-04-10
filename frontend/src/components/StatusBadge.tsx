const STATUS_COLORS: Record<string, string> = {
  pending: "#ecc94b",
  running: "#3182ce",
  success: "#38a169",
  failure: "#e53e3e",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "0.15rem 0.55rem",
        borderRadius: 999,
        fontSize: "0.8rem",
        fontWeight: 600,
        color: "#fff",
        background: STATUS_COLORS[status] ?? "#a0aec0",
      }}
    >
      {status}
    </span>
  );
}
