import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "./ui/Button";

export default function Layout() {
  const { loggedIn, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[#050509] text-slate-100">
      <header className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-black/60 backdrop-blur">
        <Link to="/" className="font-semibold text-lg tracking-tight text-white no-underline hover:text-white">
          ALFA DELFA
        </Link>

        {loggedIn && (
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/projects" className="text-slate-300 hover:text-white no-underline">
              Projects
            </Link>
            <Link to="/labs" className="text-slate-300 hover:text-white no-underline">
              Labs
            </Link>
            <Button variant="outline" size="sm" onClick={logout}>
              Log out
            </Button>
          </nav>
        )}
      </header>

      <main className="flex-1 px-6 py-6 max-w-5xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
}
