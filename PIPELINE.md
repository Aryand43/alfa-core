# Run Pipeline

This document describes how ALFA DELFA tracks experiments end‑to‑end: from the
moment a user runs a command with the CLI to how it appears in the dashboard.

The goal of v0 is a **thin, reliable vertical slice**:
`CLI -> API -> DB -> UI`.

---

## 1. Overview

ALFA DELFA wraps any experiment command and automatically records:

- Full command
- Git commit hash
- Timestamps (start / finish)
- Status (success / failure)
- Optional metrics payload (e.g. from `results.json`)

The core flow:

1. User runs `alfa run -- <command>`.
2. CLI sends a `POST /runs` request to create a pending run.
3. CLI executes the original command.
4. CLI sends a `PATCH /runs/{id}` request with final status and metrics.
5. Backend stores everything in the database.
6. Frontend reads runs from the API and displays them.

---

## 2. CLI Behaviour

### Command

```bash
alfa run -- <original command and args>
```

Examples:

```bash
alfa run -- python train.py --lr 1e-3 --seed 42
alfa run -- bash scripts/run_experiment.sh config.yaml
```

### Responsibilities

When a user runs `alfa run`:

1. **Pre‑run**

   - Determine current working directory.
   - Read Git commit hash (if inside a Git repo).
   - Capture the full command string after `--`.
   - Build a JSON payload and send `POST /runs` to the backend.
   - Receive a `run_id` from the backend.

2. **Execution**

   - Execute the original command via `subprocess`.
   - Stream stdout/stderr to the user as normal.
   - Capture exit code and finish time.

3. **Post‑run**

   - Optionally read a metrics file (e.g. `results.json`) if configured.
   - Build an update payload with:
     - `finished_at`
     - `status` (success / failure)
     - `exit_code`
     - `metrics_json` (if any)
   - Send `PATCH /runs/{id}` to the backend.

---

## 3. Backend API

### 3.1 Core Entities

- **User**
- **Lab**
- **Project**
- **Run**

A `Run` belongs to a `Project`, which may belong to a `Lab`.

### 3.2 Endpoints (v0)

- `POST /runs`
  - Creates a new run in status `"running"` (or `"pending"`).
  - Example request:

    ```json
    {
      "project_id": "<project-id>",
      "command": "python train.py --lr 0.001 --seed 42",
      "git_commit": "abc123def456",
      "started_at": "2026-03-31T14:00:00Z",
      "working_dir": "/home/user/project"
    }
    ```

  - Example response:

    ```json
    {
      "id": "<run-id>"
    }
    ```

- `PATCH /runs/{id}`
  - Updates an existing run after execution.
  - Example request:

    ```json
    {
      "finished_at": "2026-03-31T14:05:30Z",
      "status": "success",
      "exit_code": 0,
      "metrics_json": {
        "train_loss": 0.123,
        "val_accuracy": 0.89
      }
    }
    ```

  - The backend persists these fields and derives `duration` if needed.

---

## 4. Data Storage

- **Database**
  - Dev: SQLite.
  - Prod: PostgreSQL.
- Each `Run` row contains (minimum):
  - `id`
  - `project_id`
  - `user_id`
  - `command`
  - `git_commit`
  - `started_at`
  - `finished_at`
  - `status`
  - `exit_code`
  - `metrics_json` (JSON field)
  - `created_at` / `updated_at`

---

## 5. Frontend / Dashboard

The frontend consumes the API to display runs:

- **My Projects**
  - List of projects for the logged‑in user.

- **Project Runs**
  - Table showing:
    - Start time
    - Command
    - Git commit
    - Status
    - Key metric(s) extracted from `metrics_json`

- **Lab View** (later)
  - Aggregated runs across users/projects in the same lab.

For v0, at minimum:

- One page that shows runs for a single project.
- Data loaded via `GET /projects/{id}/runs`.

---

## 6. Thin Vertical Slice (Implementation Order)

1. Implement `POST /runs` and `PATCH /runs/{id}` in the backend.
2. Implement `alfa run` in the CLI using those endpoints.
3. Verify runs appear correctly in the database.
4. Implement a simple UI page that lists runs for a hard‑coded project.
5. Dogfood on a real experiment.

This slice is the foundation; everything else in ALFA DELFA builds on top of it.