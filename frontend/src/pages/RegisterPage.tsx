import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import { ApiRequestError } from "../api/client";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [duplicateEmail, setDuplicateEmail] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setDuplicateEmail(false);
    try {
      await register(email, password, name);
      navigate("/getting-started");
    } catch (err: unknown) {
      if (err instanceof ApiRequestError && err.status === 409) {
        setDuplicateEmail(true);
        return;
      }
      if (err instanceof Error && err.message === "Failed to fetch") {
        setError("Cannot reach the server. Start the API and confirm VITE_API_BASE matches the backend URL.");
        return;
      }
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  const loginHref = email.trim()
    ? `/login?email=${encodeURIComponent(email.trim())}`
    : "/login";

  return (
    <div className="max-w-sm mx-auto pt-16">
      <h1 className="text-2xl font-bold text-white mb-6">Create account</h1>
      {duplicateEmail && (
        <div className="text-sm mb-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-3 text-amber-100/95 space-y-2">
          <p className="font-medium text-amber-50">This email is already registered</p>
          <p className="text-xs text-amber-200/80 leading-relaxed">
            You cannot create a second account with the same address. Sign in with your existing password, or use a different email to register again.
          </p>
          <Link
            to={loginHref}
            className="inline-block text-xs font-semibold text-sky-400 hover:text-sky-300"
          >
            Go to sign in →
          </Link>
        </div>
      )}
      {error && !duplicateEmail && <p className="text-sm text-rose-400 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Display name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        <Button type="submit">Register</Button>
      </form>
      <p className="mt-4 text-sm text-slate-400">
        Have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}
