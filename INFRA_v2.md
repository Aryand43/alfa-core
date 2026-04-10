# AGENT_TASK_ALFA_V2

## meta

- name: `alfa-delfa-v2`
- goal:  
  Build a **minimal, dark, modern experiment tracker v2** where a new user can:
  1. Sign up  
  2. Install `alfa`  
  3. Run one command  
  4. See their experiment in a dashboard  
  **within 60 seconds** of first visit.
- stack:
  - Backend: FastAPI (`backend/app`)
  - Frontend: React + Vite + TypeScript (`frontend/`)
  - CLI: Python + click (`cli/alfa`)
- constraint:  
  Keep existing core entities and APIs (`User`, `Lab`, `Project`, `Run`) and their semantics as-is.

---

## high-level objectives

1. **UX Flow v2**: Implement a guided onboarding flow:
   - `/register` → account creation.
   - First login → “Getting Started” page with 3 copyable steps.
   - User runs one CLI command and then sees the run on the Project Runs page.
2. **DX v2**:
   - Single-command local dev: `python dev.py`.
   - Single-command self-host: `docker compose up`.
3. **CLI v2**:
   - Cross-platform safe `alfa run` (no quoting issues).
   - Works out-of-the-box with `alfa run --project <id> -- python train.py`.
4. **UI v2**:
   - Dark, minimal design.
   - Card-based layout.
   - Copyable CLI snippets.
   - Clear status badges and human-friendly timestamps.

---

## phase 1 – UX FLOW V2

### task 1.1 – first login redirect to “Getting Started”

**Goal:** After successful login, user sees a Getting Started page instead of going straight to Projects.

- Add a new React page, e.g. `frontend/src/pages/GettingStartedPage.tsx`.
- Add a route in `App.tsx`:
  - For logged-in users, route `/getting-started` to `GettingStartedPage`.
- On successful login or register (`LoginPage.tsx` / `RegisterPage.tsx`), navigate to `/getting-started` instead of `/projects`.

### task 1.2 – Getting Started page content

**Requirements:**

- Dark theme, minimal, card-based layout.
- Three steps with code blocks and copy buttons:

**Step 1 – Install CLI**

- Code block:

  ```bash
  pip install alfa-cli
  ```

- Copy button copies exactly `pip install alfa-cli`.

**Step 2 – Set token**

- Code block:

  ```bash
  export ALFA_TOKEN=...           # user pastes token
  export ALFA_API_BASE_URL=http://localhost:8000
  ```

- Copy button copies both lines.

**Step 3 – Run your first experiment**

- Logic:
  - On page load, call `GET /projects/` to fetch user’s projects.
  - If none exist, call `POST /projects/` to create a default project:
    - name: `"default"`
    - description: `"Default project"`
  - Take that project’s `id`.

- Code block (with real ID substituted):

  ```bash
  alfa run --project <project-id> -- python train.py
  ```

- Copy button copies the full command.

**Implementation notes:**

- Use `frontend/src/api/client.ts` to call `/projects/`.
- Keep UI minimal but polished; use a consistent dark palette.

---

## phase 2 – PROJECT RUNS UX IMPROVEMENTS

### task 2.1 – CLI snippet on Project Runs page

File: `frontend/src/pages/ProjectRunsPage.tsx`

**Add at the top of the page:**

- A card titled “Run this project from your terminal”.
- Snippet:

  ```bash
  alfa run --project <project-id> -- python train.py
  ```

- Copy button that uses `navigator.clipboard.writeText(snippet)`.

**Use:**

- `projectId` from `useParams` (already present).

### task 2.2 – Friendly timestamps and better badges

- Replace raw `new Date(...).toLocaleString()` with “time ago” style display if feasible.
- Ensure status badges reflect backend statuses (`pending`, `running`, `success`, `failure`).
- Maintain dark theme and consistent visual tokens.

---

## phase 3 – DX V2 (DEV & SELF-HOST)

### task 3.1 – `dev.py` for local dev

Create `dev.py` at repo root:

```python
import subprocess
import sys

procs = []

def spawn(cmd: str, cwd: str):
    print(f"[dev] Starting: {cmd} (cwd={cwd})")
    p = subprocess.Popen(cmd, cwd=cwd, shell=True)
    procs.append(p)

try:
    spawn("uvicorn app.main:app --reload", cwd="backend")
    spawn("npm run dev", cwd="frontend")
    print("[dev] Backend:  http://localhost:8000")
    print("[dev] Frontend: http://localhost:5173")
    print("[dev] Ctrl+C to stop.")
    for p in procs:
        p.wait()
except KeyboardInterrupt:
    print("\n[dev] Stopping...")
    for p in procs:
        p.terminate()
    sys.exit(0)
```

**Acceptance:**

- Running `python dev.py` from repo root starts both backend and frontend.
- Ctrl+C stops both cleanly.

### task 3.2 – docker-compose for self-host (skeleton)

Create `docker-compose.yml` at repo root with services:

- `db`: Postgres
- `backend`: FastAPI app
- `frontend`: built React app

**High-level config (leave details for later):**

- `backend`:
  - Depends on `db`.
  - Uses `ALFA_DB_URL` pointing to Postgres.
  - Exposes port `8000`.
- `frontend`:
  - Depends on `backend`.
  - Serves static build (from `npm run build`).
  - Exposes HTTP on `80`.

**Target self-host UX:**

```bash
docker compose up
```

starts DB + backend + frontend.

(Full Dockerfile implementations can be stubbed in this phase.)

---

## phase 4 – CLI V2 (CROSS-PLATFORM SAFE)

### task 4.1 – Remove `shell=True` from `alfa run`

File: `cli/alfa/cli.py`

Current behavior:

- `cmd_str = " ".join(command)`
- `subprocess.run(cmd_str, shell=True)`

Change to:

- Keep `cmd_str` for logging and backend payload.
- Call `subprocess.run(command, shell=False)`.

Pseudo-change:

```python
cmd_str = " ".join(command)
...
click.echo(f"Executing: {cmd_str}")
result = subprocess.run(command)  # no shell=True
```

**Acceptance:**

- The following should work on Windows/macOS/Linux as long as `python` is on PATH:

  ```bash
  alfa run --project <project-id> -- python train.py
  ```

- Official examples should avoid `python -c` quoting; prefer `python script.py`.

### task 4.2 – API base environment

File: `cli/alfa/client.py`

- Keep:

  ```python
  API_BASE = os.getenv("ALFA_API_BASE_URL", "http://localhost:8000")
  ```

- Ensure docs / Getting Started emphasize setting:

  ```bash
  export ALFA_API_BASE_URL=http://localhost:8000
  ```

for local testing.

---

## phase 5 – UI THEME (DARK, MINIMAL)

### task 5.1 – Layout overhaul

File: `frontend/src/components/Layout.tsx`

- Replace inline styles with a dark theme layout:
  - Background: near-black.
  - Header: dark with subtle border and blur.
  - Text: slate/neutral.
- Use a consistent utility approach (Tailwind recommended) or a small CSS module if Tailwind is not yet introduced.

### task 5.2 – Getting Started & Runs cards

- Ensure Getting Started page and Project Runs page use:
  - Cards (rounded, bordered panels).
  - Monospace font for code.
  - Clear visual hierarchy.

---

## validation checklist

Before merging v2:

- [ ] `python dev.py` starts backend (`http://localhost:8000`) and frontend (`http://localhost:5173`).
- [ ] New user flow:
  - [ ] Visit frontend, register, and get redirected to Getting Started.
  - [ ] See 3 steps with copy buttons.
  - [ ] A default project exists, and Step 3 snippet uses its ID.
- [ ] CLI:
  - [ ] `pip install -e cli/` for dev (or `alfa-cli` when packaged).
  - [ ] Running the Step 3 command creates a `Run` via `/runs/` with no quoting issues.
- [ ] Project Runs page:
  - [ ] Shows the run with correct status, command, commit, and friendly timestamp.
  - [ ] Shows a copyable `alfa run --project <project-id> -- python train.py` snippet at the top.
- [ ] `docker compose up` scaffolds backend+frontend+db (even if images are basic in this iteration).

All changes must preserve existing backend semantics and work with the current models and routers.