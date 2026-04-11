import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getRun, type Run } from "../api/client";
import StatusBadge from "../components/StatusBadge";

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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr className="border-b border-slate-800/60">
      <td className="px-4 py-2.5 text-xs font-medium text-slate-400 whitespace-nowrap align-top w-36">{label}</td>
      <td className="px-4 py-2.5 text-sm text-slate-200 break-all">{children}</td>
    </tr>
  );
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

  if (loading) return <p className="text-sm text-slate-500">Loading…</p>;
  if (error) return <p className="text-sm text-rose-400">{error}</p>;
  if (!run) return <p className="text-sm text-slate-500">Run not found.</p>;

  const metrics = parseMetrics(run.metrics_json);

  return (
    <>
      <Link to={`/projects/${run.project_id}`} className="text-xs text-sky-400 hover:text-sky-300">
        ← Back to project runs
      </Link>
      <h1 className="text-2xl font-bold tracking-tight text-white mt-2 mb-4">
        Run <span className="font-mono text-lg">{run.id.slice(0, 8)}</span>
      </h1>

      {/* Detail card */}
      <div className="rounded-xl border border-slate-800 bg-black/60 p-1 mb-6">
        <table className="w-full">
          <tbody>
            <Field label="Status"><StatusBadge status={run.status} /></Field>
            <Field label="Command"><span className="font-mono text-xs">{run.command || "—"}</span></Field>
            <Field label="Git commit"><span className="font-mono text-xs">{run.git_commit || "—"}</span></Field>
            <Field label="Working dir"><span className="font-mono text-xs">{run.working_dir || "—"}</span></Field>
            <Field label="Exit code"><span className="font-mono text-xs">{run.exit_code != null ? run.exit_code : "—"}</span></Field>
            <Field label="Started">{fmtTime(run.started_at)}</Field>
            <Field label="Finished">{fmtTime(run.finished_at)}</Field>
            <Field label="Created">{fmtTime(run.created_at)}</Field>
            <Field label="Updated">{fmtTime(run.updated_at)}</Field>
          </tbody>
        </table>
      </div>

      {/* Metrics card */}
      {metrics && (
        <div className="rounded-xl border border-slate-800 bg-black/60 p-5">
          <h2 className="text-sm font-semibold text-slate-100 mb-3">Metrics</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 border-b border-slate-800">
                <th className="px-3 py-2 font-medium">Key</th>
                <th className="px-3 py-2 font-medium">Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(metrics).map(([k, v]) => (
                <tr key={k} className="border-b border-slate-800/60">
                  <td className="px-3 py-2 font-mono text-xs text-slate-300">{k}</td>
                  <td className="px-3 py-2 font-mono text-xs text-slate-300">{String(v)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
