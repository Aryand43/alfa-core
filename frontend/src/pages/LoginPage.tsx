import { FormEvent, useEffect, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import { ApiRequestError } from "../api/client";

function loginErrorMessage(err: unknown): string {
  if (err instanceof ApiRequestError && err.status === 401) {
    return "Wrong email or password. Check your credentials or create an account.";
  }
  if (err instanceof Error && err.message === "Failed to fetch") {
    return "Cannot reach the server. Start the API (see README) and check your connection.";
  }
  return err instanceof Error ? err.message : "Sign in failed";
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const q = searchParams.get("email");
    if (q) setEmail(q);
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/getting-started");
    } catch (err: unknown) {
      setError(loginErrorMessage(err));
    }
  };

  return (
    <div className="max-w-sm mx-auto pt-16">
      <h1 className="text-2xl font-bold text-white mb-6">Sign in</h1>
      {error && <p className="text-sm text-rose-400 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
        <Button type="submit">Sign in</Button>
      </form>
      <p className="mt-4 text-sm text-slate-400">
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
