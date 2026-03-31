import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { listLabRuns, type Run } from "../api/client";

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "#ecc94b",
    running: "#3182ce",
    completed: "#38a169",
    failed: "#e53e3e",
  };
  return (
    <span
      style={{
        display: "inline-block",
        padding: "0.15rem 0.55rem",
        borderRadius: 999,
        fontSize: "0.8rem",
        fontWeight: 600,
        color: "#fff",
        background: colors[status] ?? "#a0aec0",
      }}
    >
      {status}
    </span>
  );
}

export default function LabRunsPage() {
  const { labId } = useParams<{ labId: string }>();
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!labId) return;
    listLabRuns(labId).then(setRuns).finally(() => setLoading(false));
  }, [labId]);

  return (
    <>
      <Link to="/labs" style={{ fontSize: "0.85rem", color: "#3182ce" }}>&larr; Back to labs</Link>
      <h1 style={{ marginTop: "0.5rem" }}>Lab Runs</h1>

      {loading ? (
        <p>Loading...</p>
      ) : runs.length === 0 ? (
        <p style={{ color: "#718096" }}>No runs in this lab yet.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "2px solid #e2e8f0" }}>
              <th style={{ padding: "0.5rem" }}>ID</th>
              <th style={{ padding: "0.5rem" }}>Status</th>
              <th style={{ padding: "0.5rem" }}>Command</th>
              <th style={{ padding: "0.5rem" }}>User</th>
              <th style={{ padding: "0.5rem" }}>Created</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((r) => (
              <tr key={r.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: "0.5rem", fontFamily: "monospace", fontSize: "0.82rem" }}>{r.id.slice(0, 8)}</td>
                <td style={{ padding: "0.5rem" }}><StatusBadge status={r.status} /></td>
                <td style={{ padding: "0.5rem", fontFamily: "monospace", fontSize: "0.85rem" }}>{r.command || "—"}</td>
                <td style={{ padding: "0.5rem", fontFamily: "monospace", fontSize: "0.82rem" }}>
                  {r.user_id.slice(0, 8)}
                </td>
                <td style={{ padding: "0.5rem", color: "#718096", fontSize: "0.85rem" }}>
                  {new Date(r.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
