# ALFA DELFA (alfa-core)

Experiment tracking platform: CLI, backend API, and web UI.

## Quick start

### Prerequisites

- Python 3.10+
- Node.js 18+

### 1. Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API starts at **http://localhost:8000**. Interactive docs at `/docs`.

### 2. CLI

```bash
cd cli
pip install -e .
```

Authenticate:

```bash
alfa auth --email you@example.com
```

Track a run:

```bash
export ALFA_TOKEN=<token from above>
alfa run --project <project-id> -- python train.py
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Opens at **http://localhost:5173**.

## Environment variables

See `.env.example` for the full list. Key variables:

| Variable | Description |
|---|---|
| `ALFA_DB_URL` | Database connection string (default: SQLite) |
| `ALFA_SECRET_KEY` | JWT signing secret |
| `ALFA_TOKEN` | CLI bearer token |
| `VITE_API_BASE` | Frontend → backend URL |

## Project structure

```
alfa-core/
├── backend/          # FastAPI service
│   └── app/
│       ├── main.py
│       ├── models.py
│       ├── auth.py
│       └── routers/
├── cli/              # Python click CLI
│   └── alfa/
│       ├── cli.py
│       └── client.py
├── frontend/         # React + TypeScript (Vite)
│   └── src/
│       ├── api/
│       ├── pages/
│       └── components/
└── INFRA.md
```
