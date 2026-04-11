import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listProjects, createProject } from "../api/client";
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
    <Button variant="ghost" size="sm" onClick={handleCopy} className="shrink-0">
      {copied ? "Copied!" : "Copy"}
    </Button>
  );
}

function StepCard({
  step,
  title,
  description,
  snippet,
}: {
  step: number;
  title: string;
  description?: string;
  snippet: string | null;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-black/60 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">
            <span className="text-sky-400 mr-1.5">{step}.</span>
            {title}
          </h3>
          {description && (
            <p className="mt-1 text-xs text-slate-400">{description}</p>
          )}
        </div>
        {snippet && <CopyButton text={snippet} />}
      </div>
      {snippet && (
        <pre className="mt-3 bg-[#050612] border border-slate-800 rounded-md px-3 py-2 text-xs font-mono text-slate-100 overflow-x-auto">
          {snippet}
        </pre>
      )}
    </div>
  );
}

const STEP2_SNIPPET =
  "export ALFA_TOKEN=...           # paste your token\nexport ALFA_API_BASE_URL=http://localhost:8000";

export default function GettingStartedPage() {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function resolve() {
      try {
        const projects = await listProjects();
        if (cancelled) return;

        if (projects.length > 0) {
          setProjectId(projects[0].id);
        } else {
          const created = await createProject("default", "Default project");
          if (!cancelled) setProjectId(created.id);
        }
      } catch (err: unknown) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load project");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    resolve();
    return () => { cancelled = true; };
  }, []);

  const step3Snippet = projectId
    ? `alfa run --project ${projectId} -- python train.py`
    : null;

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold tracking-tight text-white">Getting Started</h1>
      <p className="mt-1 text-sm text-slate-400 mb-8">
        Run your first experiment in three steps.
      </p>

      <div className="flex flex-col gap-4">
        <StepCard
          step={1}
          title="Install the CLI"
          description="Install the alfa command-line tool."
          snippet="pip install alfa-cli"
        />

        <StepCard
          step={2}
          title="Set your token"
          description="Configure your environment to authenticate with the server."
          snippet={STEP2_SNIPPET}
        />

        <StepCard
          step={3}
          title="Run your first experiment"
          description="Execute a training script and track it as a run."
          snippet={
            loading
              ? null
              : error
                ? null
                : step3Snippet
          }
        />
        {loading && (
          <p className="text-xs text-slate-500 -mt-2 ml-1">Resolving project…</p>
        )}
        {error && (
          <p className="text-xs text-rose-400 -mt-2 ml-1">{error}</p>
        )}
      </div>

      <p className="mt-8 text-sm">
        <Link to="/projects">Go to projects →</Link>
      </p>
    </div>
  );
}
