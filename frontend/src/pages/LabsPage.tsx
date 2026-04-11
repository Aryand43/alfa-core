import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { listLabs, createLab, type Lab } from "../api/client";
import Button from "../components/ui/Button";

export default function LabsPage() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    listLabs().then(setLabs).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setError("");
    try {
      await createLab(name.trim(), desc.trim());
      setName("");
      setDesc("");
      load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Create failed");
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight text-white mb-6">Labs</h1>

      {/* Create form card */}
      <div className="rounded-xl border border-slate-800 bg-black/60 p-5 mb-6">
        <h2 className="text-sm font-medium text-slate-200 mb-3">New Lab</h2>
        {error && <p className="text-xs text-rose-400 mb-2">{error}</p>}
        <form onSubmit={handleCreate} className="flex items-center gap-3">
          <input
            placeholder="Lab name"
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

      {/* Lab list */}
      {loading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : labs.length === 0 ? (
        <p className="text-sm text-slate-500">No labs yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {labs.map((l) => (
            <Link
              key={l.id}
              to={`/labs/${l.id}`}
              className="rounded-lg border border-slate-800 bg-black/40 px-4 py-3 hover:border-slate-700 hover:bg-black/60 transition-colors no-underline"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-slate-100">{l.name}</span>
                  {l.description && (
                    <span className="ml-3 text-xs text-slate-500">{l.description}</span>
                  )}
                </div>
                <span className="text-xs text-slate-600">
                  {new Date(l.created_at).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
