import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { listLabs, createLab, type Lab } from "../api/client";

export default function LabsPage() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    listLabs().then(setLabs).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await createLab(name.trim(), desc.trim());
    setName("");
    setDesc("");
    load();
  };

  return (
    <>
      <h1>Labs</h1>

      <form onSubmit={handleCreate} style={{ display: "flex", gap: "0.5rem", margin: "1rem 0" }}>
        <input
          placeholder="Lab name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ flex: 1, padding: "0.5rem 0.7rem", border: "1px solid #cbd5e0", borderRadius: 6 }}
        />
        <input
          placeholder="Description (optional)"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          style={{ flex: 1, padding: "0.5rem 0.7rem", border: "1px solid #cbd5e0", borderRadius: 6 }}
        />
        <button
          type="submit"
          style={{
            padding: "0.5rem 1rem",
            background: "#3182ce",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Create
        </button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : labs.length === 0 ? (
        <p style={{ color: "#718096" }}>No labs yet.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "2px solid #e2e8f0" }}>
              <th style={{ padding: "0.5rem" }}>Name</th>
              <th style={{ padding: "0.5rem" }}>Description</th>
              <th style={{ padding: "0.5rem" }}>Created</th>
            </tr>
          </thead>
          <tbody>
            {labs.map((l) => (
              <tr key={l.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: "0.5rem" }}>
                  <Link to={`/labs/${l.id}`}>{l.name}</Link>
                </td>
                <td style={{ padding: "0.5rem", color: "#718096" }}>{l.description || "—"}</td>
                <td style={{ padding: "0.5rem", color: "#718096", fontSize: "0.85rem" }}>
                  {new Date(l.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
