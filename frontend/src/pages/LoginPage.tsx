import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/projects");
    } catch (err: any) {
      setError(err.message ?? "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: 380, margin: "4rem auto" }}>
      <h1 style={{ marginBottom: "1.5rem" }}>Sign in</h1>
      {error && <p style={{ color: "#e53e3e" }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />
        <button type="submit" style={btnStyle}>Sign in</button>
      </form>
      <p style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "0.6rem 0.75rem",
  border: "1px solid #cbd5e0",
  borderRadius: 6,
  fontSize: "0.95rem",
};

const btnStyle: React.CSSProperties = {
  padding: "0.65rem",
  background: "#3182ce",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  fontWeight: 600,
  cursor: "pointer",
  fontSize: "0.95rem",
};
