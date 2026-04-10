import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listProjects, createProject } from "../api/client";

// ── Palette ──────────────────────────────────────────────────────────

const bg = "#0f1117";
const cardBg = "#161922";
const cardBorder = "#23283a";
const codeBg = "#1c1f2e";
const codeBorder = "#2d3348";
const text = "#c9d1d9";
const textMuted = "#8b949e";
const accent = "#58a6ff";
const accentSubtle = "#1c3a5c";

// ── Styles ───────────────────────────────────────────────────────────

const page: React.CSSProperties = {
  maxWidth: 620,
  margin: "2.5rem auto",
  color: text,
};

const card: React.CSSProperties = {
  background: cardBg,
  border: `1px solid ${cardBorder}`,
  borderRadius: 10,
  padding: "1.15rem 1.35rem",
};

const codeBlock: React.CSSProperties = {
  position: "relative",
  display: "block",
  background: codeBg,
  border: `1px solid ${codeBorder}`,
  borderRadius: 6,
  padding: "0.65rem 0.9rem",
  paddingRight: "3.5rem",
  fontFamily: "'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace",
  fontSize: "0.85rem",
  color: "#e6edf3",
  whiteSpace: "pre",
  overflowX: "auto",
  lineHeight: 1.55,
};

const copyBtn: React.CSSProperties = {
  position: "absolute",
  top: 6,
  right: 6,
  background: accentSubtle,
  border: `1px solid ${codeBorder}`,
  borderRadius: 5,
  padding: "0.25rem 0.55rem",
  fontSize: "0.72rem",
  fontWeight: 600,
  color: accent,
  cursor: "pointer",
  lineHeight: 1.4,
};

// ── Helpers ──────────────────────────────────────────────────────────

function CopyButton({ text: copyText }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(copyText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <button onClick={handleCopy} style={copyBtn}>
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function CodeSnippet({ text: snippetText }: { text: string }) {
  return (
    <div style={{ position: "relative", marginTop: "0.75rem" }}>
      <code style={codeBlock}>{snippetText}</code>
      <CopyButton text={snippetText} />
    </div>
  );
}

function StepCard({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <div style={card}>
      <h3 style={{ margin: 0, fontSize: "1rem", color: text }}>
        <span style={{ color: accent, marginRight: "0.5rem", fontWeight: 700 }}>{step}.</span>
        {title}
      </h3>
      <div style={{ marginTop: "0.25rem" }}>{children}</div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────

const STEP2_SNIPPET =
  `export ALFA_TOKEN=...           # paste your token\nexport ALFA_API_BASE_URL=http://localhost:8000`;

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
    : "alfa run --project <project-id> -- python train.py";

  return (
    <div style={{ background: bg, minHeight: "100vh", padding: "2rem 1rem" }}>
      <div style={page}>
        <h1 style={{ marginBottom: "0.25rem", fontSize: "1.55rem", fontWeight: 700, color: "#e6edf3" }}>
          Getting Started
        </h1>
        <p style={{ color: textMuted, marginBottom: "2rem", fontSize: "0.95rem" }}>
          Run your first experiment in three steps.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <StepCard step={1} title="Install the CLI">
            <CodeSnippet text="pip install alfa-cli" />
          </StepCard>

          <StepCard step={2} title="Set your token">
            <CodeSnippet text={STEP2_SNIPPET} />
          </StepCard>

          <StepCard step={3} title="Run your first experiment">
            {loading ? (
              <p style={{ color: textMuted, margin: "0.75rem 0 0", fontSize: "0.88rem" }}>
                Resolving project…
              </p>
            ) : error ? (
              <p style={{ color: "#f85149", margin: "0.75rem 0 0", fontSize: "0.88rem" }}>{error}</p>
            ) : (
              <CodeSnippet text={step3Snippet} />
            )}
          </StepCard>
        </div>

        <p style={{ marginTop: "2rem", fontSize: "0.9rem" }}>
          <Link to="/projects" style={{ color: accent, textDecoration: "none" }}>
            Go to projects →
          </Link>
        </p>
      </div>
    </div>
  );
}
