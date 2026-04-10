import { Link } from "react-router-dom";
import type { Run } from "../api/client";
import StatusBadge from "./StatusBadge";

const th: React.CSSProperties = { padding: "0.5rem", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "0.5rem" };
const mono: React.CSSProperties = { fontFamily: "monospace", fontSize: "0.82rem" };
const muted: React.CSSProperties = { color: "#718096", fontSize: "0.85rem" };

function fmtTime(iso: string | null) {
  return iso ? new Date(iso).toLocaleString() : "—";
}

export default function RunsTable({ runs }: { runs: Run[] }) {
  if (runs.length === 0) {
    return <p style={{ color: "#718096" }}>No runs yet.</p>;
  }

  return (
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
      <thead>
        <tr style={{ textAlign: "left", borderBottom: "2px solid #e2e8f0" }}>
          <th style={th}>ID</th>
          <th style={th}>Status</th>
          <th style={th}>Command</th>
          <th style={th}>Commit</th>
          <th style={th}>Exit</th>
          <th style={th}>Started</th>
          <th style={th}>Finished</th>
          <th style={th}>Created</th>
        </tr>
      </thead>
      <tbody>
        {runs.map((r) => (
          <tr key={r.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
            <td style={{ ...td, ...mono }}>
              <Link to={`/runs/${r.id}`} style={{ color: "#3182ce" }}>
                {r.id.slice(0, 8)}
              </Link>
            </td>
            <td style={td}><StatusBadge status={r.status} /></td>
            <td style={{ ...td, fontFamily: "monospace", fontSize: "0.85rem" }}>{r.command || "—"}</td>
            <td style={{ ...td, ...mono }}>{r.git_commit ? r.git_commit.slice(0, 7) : "—"}</td>
            <td style={{ ...td, ...mono }}>{r.exit_code != null ? r.exit_code : "—"}</td>
            <td style={{ ...td, ...muted }}>{fmtTime(r.started_at)}</td>
            <td style={{ ...td, ...muted }}>{fmtTime(r.finished_at)}</td>
            <td style={{ ...td, ...muted }}>{fmtTime(r.created_at)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
