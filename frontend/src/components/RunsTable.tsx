import { Link } from "react-router-dom";
import type { Run } from "../api/client";
import StatusBadge from "./StatusBadge";

function fmtTime(iso: string | null) {
  return iso ? new Date(iso).toLocaleString() : "—";
}

export default function RunsTable({ runs }: { runs: Run[] }) {
  if (runs.length === 0) {
    return <p className="text-slate-500 text-sm">No runs yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-slate-400 border-b border-slate-800">
            <th className="px-3 py-2 font-medium">ID</th>
            <th className="px-3 py-2 font-medium">Status</th>
            <th className="px-3 py-2 font-medium">Command</th>
            <th className="px-3 py-2 font-medium">Commit</th>
            <th className="px-3 py-2 font-medium">Exit</th>
            <th className="px-3 py-2 font-medium">Started</th>
            <th className="px-3 py-2 font-medium">Finished</th>
            <th className="px-3 py-2 font-medium">Created</th>
          </tr>
        </thead>
        <tbody>
          {runs.map((r) => (
            <tr key={r.id} className="border-b border-slate-800/60 hover:bg-white/[0.02] transition-colors">
              <td className="px-3 py-2 font-mono text-xs">
                <Link to={`/runs/${r.id}`} className="text-sky-400 hover:text-sky-300">
                  {r.id.slice(0, 8)}
                </Link>
              </td>
              <td className="px-3 py-2"><StatusBadge status={r.status} /></td>
              <td className="px-3 py-2 font-mono text-xs text-slate-300">{r.command || "—"}</td>
              <td className="px-3 py-2 font-mono text-xs text-slate-400">{r.git_commit ? r.git_commit.slice(0, 7) : "—"}</td>
              <td className="px-3 py-2 font-mono text-xs text-slate-400">{r.exit_code != null ? r.exit_code : "—"}</td>
              <td className="px-3 py-2 text-xs text-slate-500">{fmtTime(r.started_at)}</td>
              <td className="px-3 py-2 text-xs text-slate-500">{fmtTime(r.finished_at)}</td>
              <td className="px-3 py-2 text-xs text-slate-500">{fmtTime(r.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
