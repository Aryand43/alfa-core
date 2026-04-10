import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { listProjectRuns, type Run } from "../api/client";
import RunsTable from "../components/RunsTable";

export default function ProjectRunsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;
    listProjectRuns(projectId).then(setRuns).finally(() => setLoading(false));
  }, [projectId]);

  return (
    <>
      <Link to="/projects" style={{ fontSize: "0.85rem", color: "#3182ce" }}>&larr; Back to projects</Link>
      <h1 style={{ marginTop: "0.5rem" }}>Project Runs</h1>

      {loading ? (
        <p>Loading…</p>
      ) : runs.length === 0 ? (
        <p style={{ color: "#718096" }}>No runs yet. Use the CLI to create one.</p>
      ) : (
        <RunsTable runs={runs} />
      )}
    </>
  );
}
