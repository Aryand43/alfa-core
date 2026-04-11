import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { listProjects, createProject, type Project } from "../api/client";
import Button from "../components/ui/Button";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    listProjects().then(setProjects).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setError("");
    try {
      await createProject(name.trim(), desc.trim());
      setName("");
      setDesc("");
      load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Create failed");
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight text-white mb-6">My Projects</h1>

      {/* Create form card */}
      <div className="rounded-xl border border-slate-800 bg-black/60 p-5 mb-6">
        <h2 className="text-sm font-medium text-slate-200 mb-3">New Project</h2>
        {error && <p className="text-xs text-rose-400 mb-2">{error}</p>}
        <form onSubmit={handleCreate} className="flex items-center gap-3">
          <input
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="flex-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <input
            placeholder="Description (optional)"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="flex-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <Button type="submit" size="md">Create</Button>
        </form>
      </div>

      {/* Project list */}
      {loading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : projects.length === 0 ? (
        <p className="text-sm text-slate-500">No projects yet. Create one above.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {projects.map((p) => (
            <Link
              key={p.id}
              to={`/projects/${p.id}`}
              className="rounded-lg border border-slate-800 bg-black/40 px-4 py-3 hover:border-slate-700 hover:bg-black/60 transition-colors no-underline"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-slate-100">{p.name}</span>
                  {p.description && (
                    <span className="ml-3 text-xs text-slate-500">{p.description}</span>
                  )}
                </div>
                <span className="text-xs text-slate-600">
                  {new Date(p.created_at).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
