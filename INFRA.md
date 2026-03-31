# ALFA DELFA Infrastructure Overview

This document describes the current infrastructure for the `alfa-core` stack:
CLI, backend API, and web UI. It will evolve as the system grows.

---

## 1. High-Level Architecture

ALFA DELFA v0 consists of three main components:

1. **CLI (`alfa`)**
   - Local Python CLI installed by users.
   - Wraps any shell command: `alfa run -- <command>`.
   - Collects metadata (command, git commit, timestamps, optional metrics file).
   - Sends run data to the backend API over HTTPS.

2. **Backend API**
   - Python FastAPI service.
   - Responsible for authentication, projects, labs, and run records.
   - Persists data in a relational database.

3. **Web UI**
   - React single-page application.
   - Talks to the backend API via REST.
   - Provides:
     - “My Projects” view (per user).
     - “Project Runs” view.
     - “Lab Runs” view across users.

All components are versioned together in this repository for now.

---

## 2. Environments

- **Local development**
  - Backend: FastAPI (uvicorn) with SQLite.
  - Frontend: React dev server.
  - CLI: editable install via `pip install -e .`.

- **Production (planned)**
  - Single VPS in Singapore region.
  - Backend: FastAPI + Postgres.
  - Frontend: static build served via Nginx.
  - HTTPS termination at Nginx (Let’s Encrypt).

Additional environments (staging, test) will be added when needed.

---

## 3. Backend Infrastructure

- **Language / Framework**
  - Python, FastAPI.
- **Database**
  - Dev: SQLite.
  - Prod: PostgreSQL (single instance).
- **ORM / Models**
  - SQLModel or SQLAlchemy.
  - Core entities:
    - `User`
    - `Lab`
    - `Project`
    - `Run`
- **API Responsibilities**
  - Auth (basic email/password + JWT initially).
  - CRUD for labs, projects, runs.
  - Run lifecycle:
    - `POST /runs` to create a pending run.
    - `PATCH /runs/{id}` to update status and metrics.

---

## 4. CLI Infrastructure

- **Language**
  - Python.
- **Key libraries**
  - `click` for command-line interface.
  - `requests` or `httpx` for HTTP.
  - `subprocess` for executing wrapped commands.
  - `gitpython` or shell calls for commit hash (TBD).
- **Responsibilities**
  - Provide `alfa run -- <command>` UX.
  - Gather metadata (cwd, repo info, command, timestamps).
  - Send data to backend with API token.
  - Optionally read a metrics file (e.g. `results.json`) and upload it.

---

## 5. Web UI Infrastructure

- **Language / Framework**
  - React + TypeScript (planned; JS acceptable for v0).
- **Build tooling**
  - Vite or Create React App.
- **Responsibilities**
  - Auth flows (login/logout).
  - Display:
    - List of projects per user.
    - Runs for a project.
    - Aggregated runs for a lab.
  - Basic charts (later) using a lightweight charting library.

---

## 6. Deployment & Operations

- **Target setup (initial)**
  - VPS with:
    - Nginx as reverse proxy.
    - `uvicorn` (or `gunicorn` + `uvicorn` workers) for FastAPI.
    - Systemd services for backend and any background workers.
  - Frontend built to static files and served by Nginx.

- **Configuration**
  - Environment variables (no secrets in repo):
    - `ALFA_DB_URL`
    - `ALFA_SECRET_KEY`
    - `ALFA_API_BASE_URL`
    - `ALFA_ENV` (`dev` / `prod`)

- **Logging & Monitoring**
  - Application logs to stdout (captured by systemd / journal).
  - Simple request logging middleware in FastAPI.
  - More monitoring to be added as usage grows.

---

## 7. Security & Data

- Data scope:
  - Experiment metadata (commands, configs, metrics, timestamps).
  - No sensitive personal data by default.
- Principles:
  - All secrets kept in environment variables or external secret store.
  - All production traffic over HTTPS.
  - Data export endpoints to allow labs to pull their data at any time.

---

## 8. Roadmap Notes

Planned infra improvements:

- Staging environment mirroring production.
- Background workers for long-running tasks (e.g., async uploads).
- Better observability (metrics + alerts).
- Optional on-prem / NTU-hosted deployment profile.

Update this file when infra decisions change.
