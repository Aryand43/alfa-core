const BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("alfa_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...authHeaders(), ...init?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail ?? res.statusText);
  }
  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────────────

export async function register(email: string, password: string, displayName?: string) {
  return request<{ id: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, display_name: displayName ?? "" }),
  });
}

export async function login(email: string, password: string) {
  const data = await request<{ access_token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem("alfa_token", data.access_token);
  return data;
}

export function logout() {
  localStorage.removeItem("alfa_token");
}

export function isLoggedIn() {
  return !!localStorage.getItem("alfa_token");
}

// ── Projects ─────────────────────────────────────────────────────────

export interface Project {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  lab_id: string | null;
  created_at: string;
}

export function listProjects() {
  return request<Project[]>("/projects/");
}

export function createProject(name: string, description = "", labId?: string) {
  return request<Project>("/projects/", {
    method: "POST",
    body: JSON.stringify({ name, description, lab_id: labId ?? null }),
  });
}

// ── Labs ─────────────────────────────────────────────────────────────

export interface Lab {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export function listLabs() {
  return request<Lab[]>("/labs/");
}

export function createLab(name: string, description = "") {
  return request<Lab>("/labs/", {
    method: "POST",
    body: JSON.stringify({ name, description }),
  });
}

// ── Runs ─────────────────────────────────────────────────────────────

export interface Run {
  id: string;
  status: string;
  command: string;
  git_commit: string;
  started_at: string | null;
  finished_at: string | null;
  metrics: string | null;
  project_id: string;
  user_id: string;
  created_at: string;
}

export function listProjectRuns(projectId: string) {
  return request<Run[]>(`/projects/${projectId}/runs`);
}

export function listLabRuns(labId: string) {
  return request<Run[]>(`/labs/${labId}/runs`);
}
