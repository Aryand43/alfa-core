import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getRun, type Run } from "../api/client";
import StatusBadge from "../components/StatusBadge";

const label: React.CSSProperties = {
  fontWeight: 600,
  color: "#4a5568",
  padding: "0.45rem 0.75rem",
  whiteSpace: "nowrap",
  verticalAlign: "top",
};
const value: React.CSSProperties = {
  padding: "0.45rem 0.75rem",
  wordBreak: "break-all",
};
const mono: React.CSSProperties = { fontFamily: "monospace", fontSize: "0.9rem" };

function fmtTime(iso: string | null) {
  return iso ? new Date(iso).toLocaleString() : "—";
}

function parseMetrics(raw: string | null): Record<string, unknown> | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export default function RunDetailPage() {
  const { runId } = useParams<{ runId: string }>();
  const [run, setRun] = useState<Run | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!runId) return;
    getRun(runId)
      .then(setRun)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [runId]);

  if (loading) return <p>Loading…</p>;
  if (error) return <p style={{ color: "#e53e3e" }}>{error}</p>;
  if (!run) return <p>Run not found.</p>;

  const metrics = parseMetrics(run.metrics_json);

  return (
    <>
      <Link to={`/projects/${run.project_id}`} style={{ fontSize: "0.85rem", color: "#3182ce" }}>
        &larr; Back to project runs
      </Link>
      <h1 style={{ marginTop: "0.5rem" }}>
        Run <span style={mono}>{run.id.slice(0, 8)}</span>
      </h1>

      <table style={{ borderCollapse: "collapse", marginTop: "1rem" }}>
        <tbody>
          <Row label="Status"><StatusBadge status={run.status} /></Row>
          <Row label="Command"><span style={mono}>{run.command || "—"}</span></Row>
          <Row label="Git commit"><span style={mono}>{run.git_commit || "—"}</span></Row>
          <Row label="Working dir"><span style={mono}>{run.working_dir || "—"}</span></Row>
          <Row label="Exit code"><span style={mono}>{run.exit_code != null ? run.exit_code : "—"}</span></Row>
          <Row label="Started">{fmtTime(run.started_at)}</Row>
          <Row label="Finished">{fmtTime(run.finished_at)}</Row>
          <Row label="Created">{fmtTime(run.created_at)}</Row>
          <Row label="Updated">{fmtTime(run.updated_at)}</Row>
        </tbody>
      </table>

      {metrics && (
        <>
          <h2 style={{ marginTop: "1.5rem", fontSize: "1.1rem" }}>Metrics</h2>
          <table style={{ borderCollapse: "collapse", marginTop: "0.5rem", width: "100%" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "2px solid #e2e8f0" }}>
                <th style={{ padding: "0.4rem 0.75rem" }}>Key</th>
                <th style={{ padding: "0.4rem 0.75rem" }}>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(metrics).map(([k, v]) => (
                <tr key={k} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "0.4rem 0.75rem", ...mono }}>{k}</td>
                  <td style={{ padding: "0.4rem 0.75rem", ...mono }}>{String(v)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  );
}

function Row({ label: lbl, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
      <td style={label}>{lbl}</td>
      <td style={value}>{children}</td>
    </tr>
  );
}
