import { Link } from "react-router-dom";

export default function GettingStartedPage() {
  return (
    <div style={{ maxWidth: 600, margin: "3rem auto" }}>
      <h1 style={{ marginBottom: "0.5rem" }}>Getting Started</h1>
      <p style={{ color: "#718096", marginBottom: "2rem" }}>
        Follow the steps below to run your first experiment.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <StepCard step={1} title="Install the CLI">
          <code style={code}>pip install alfa-cli</code>
        </StepCard>

        <StepCard step={2} title="Set your token">
          <code style={code}>
            export ALFA_TOKEN=...{"\n"}
            export ALFA_API_BASE_URL=http://localhost:8000
          </code>
        </StepCard>

        <StepCard step={3} title="Run your first experiment">
          <code style={code}>alfa run --project &lt;project-id&gt; -- python train.py</code>
        </StepCard>
      </div>

      <p style={{ marginTop: "2rem", fontSize: "0.9rem" }}>
        <Link to="/projects" style={{ color: "#3182ce" }}>Skip to projects &rarr;</Link>
      </p>
    </div>
  );
}

function StepCard({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 8,
        padding: "1rem 1.25rem",
      }}
    >
      <h3 style={{ margin: 0, fontSize: "1rem" }}>
        <span style={{ color: "#3182ce", marginRight: "0.5rem" }}>Step {step}</span>
        {title}
      </h3>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </div>
  );
}

const code: React.CSSProperties = {
  display: "block",
  background: "#f7fafc",
  border: "1px solid #e2e8f0",
  borderRadius: 6,
  padding: "0.6rem 0.85rem",
  fontFamily: "monospace",
  fontSize: "0.88rem",
  whiteSpace: "pre",
  overflowX: "auto",
};
