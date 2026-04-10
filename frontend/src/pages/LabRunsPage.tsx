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
      <Link to="/labs" style={{ fontSize: "0.85rem", color: "#3182ce" }}>&larr; Back to labs</Link>
      <h1 style={{ marginTop: "0.5rem" }}>Lab Runs</h1>

      {loading ? (
        <p>Loading…</p>
      ) : runs.length === 0 ? (
        <p style={{ color: "#718096" }}>No runs in this lab yet.</p>
      ) : (
        <RunsTable runs={runs} />
      )}
    </>
  );
}
