import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { listLabRuns, type Run } from "../api/client";
import RunsTable from "../components/RunsTable";

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
      <Link to="/labs" className="text-xs text-sky-400 hover:text-sky-300">
        ← Back to labs
      </Link>
      <h1 className="text-2xl font-bold tracking-tight text-white mt-2 mb-4">Lab Runs</h1>

      <div className="rounded-xl border border-slate-800 bg-black/60 p-5">
        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : runs.length === 0 ? (
          <p className="text-sm text-slate-500">No runs in this lab yet.</p>
        ) : (
          <RunsTable runs={runs} />
        )}
      </div>
    </>
  );
}
