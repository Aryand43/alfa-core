"""Thin HTTP client for the ALFA DELFA backend API."""

from __future__ import annotations

import os
from typing import Any

import httpx

API_BASE = os.getenv("ALFA_API_BASE_URL", "http://localhost:8000")


def _headers() -> dict[str, str]:
    token = os.getenv("ALFA_TOKEN", "")
    if not token:
        raise SystemExit("ALFA_TOKEN env var is not set. Log in first or export a token.")
    return {"Authorization": f"Bearer {token}"}


def create_run(
    *,
    project_id: str,
    command: str,
    git_commit: str,
    started_at: str,
    working_dir: str,
) -> str:
    """POST /runs -- returns the new run ID."""
    resp = httpx.post(
        f"{API_BASE}/runs/",
        json={
            "project_id": project_id,
            "command": command,
            "git_commit": git_commit,
            "started_at": started_at,
            "working_dir": working_dir,
        },
        headers=_headers(),
        timeout=30,
    )
    resp.raise_for_status()
    return resp.json()["id"]


def update_run(
    run_id: str,
    *,
    finished_at: str,
    status: str,
    exit_code: int,
    metrics_json: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """PATCH /runs/{id} -- send final status after execution."""
    payload: dict[str, Any] = {
        "finished_at": finished_at,
        "status": status,
        "exit_code": exit_code,
    }
    if metrics_json is not None:
        payload["metrics_json"] = metrics_json

    resp = httpx.patch(
        f"{API_BASE}/runs/{run_id}",
        json=payload,
        headers=_headers(),
        timeout=30,
    )
    resp.raise_for_status()
    return resp.json()


def login(email: str, password: str) -> str:
    resp = httpx.post(
        f"{API_BASE}/auth/login",
        json={"email": email, "password": password},
        timeout=30,
    )
    resp.raise_for_status()
    return resp.json()["access_token"]
