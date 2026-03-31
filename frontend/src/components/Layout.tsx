import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { loggedIn, logout } = useAuth();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.75rem 1.5rem",
          borderBottom: "1px solid #e2e8f0",
          background: "#fff",
        }}
      >
        <Link to="/" style={{ fontWeight: 700, fontSize: "1.15rem", color: "#1a202c", textDecoration: "none" }}>
          ALFA DELFA
        </Link>

        {loggedIn && (
          <nav style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
            <Link to="/projects" style={{ color: "#4a5568", textDecoration: "none" }}>Projects</Link>
            <Link to="/labs" style={{ color: "#4a5568", textDecoration: "none" }}>Labs</Link>
            <button
              onClick={logout}
              style={{
                background: "none",
                border: "1px solid #cbd5e0",
                borderRadius: 6,
                padding: "0.35rem 0.85rem",
                cursor: "pointer",
                color: "#4a5568",
              }}
            >
              Log out
            </button>
          </nav>
        )}
      </header>

      <main style={{ flex: 1, padding: "2rem 1.5rem", maxWidth: 960, margin: "0 auto", width: "100%" }}>
        <Outlet />
      </main>
    </div>
  );
}
