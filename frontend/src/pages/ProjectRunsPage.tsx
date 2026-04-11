import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { listProjectRuns, type Run } from "../api/client";
import RunsTable from "../components/RunsTable";
import Button from "../components/ui/Button";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleCopy}>
      {copied ? "Copied!" : "Copy"}
    </Button>
  );
}

export default function ProjectRunsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;
    listProjectRuns(projectId).then(setRuns).finally(() => setLoading(false));
  }, [projectId]);

  const snippet = `alfa run --project ${projectId} -- python train.py`;

  return (
    <>
      <Link to="/projects" className="text-xs text-sky-400 hover:text-sky-300">
        ← Back to projects
      </Link>
      <h1 className="text-2xl font-bold tracking-tight text-white mt-2 mb-4">Project Runs</h1>

      {/* CLI snippet card */}
      <div className="rounded-xl border border-slate-800 bg-black/60 p-4 mb-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-medium text-slate-200">Run this project from your terminal</h2>
          <CopyButton text={snippet} />
        </div>
        <pre className="mt-2 bg-[#050612] border border-slate-800 rounded-md px-3 py-2 text-xs font-mono text-slate-100 overflow-x-auto">
          {snippet}
        </pre>
      </div>

      {/* Runs table card */}
      <div className="rounded-xl border border-slate-800 bg-black/60 p-5">
        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : runs.length === 0 ? (
          <p className="text-sm text-slate-500">No runs yet. Use the CLI command above to create one.</p>
        ) : (
          <RunsTable runs={runs} />
        )}
      </div>
    </>
  );
}
