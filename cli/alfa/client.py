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


def create_run(project_id: str, command: str, git_commit: str) -> dict[str, Any]:
    resp = httpx.post(
        f"{API_BASE}/runs/",
        json={"project_id": project_id, "command": command, "git_commit": git_commit},
        headers=_headers(),
        timeout=30,
    )
    resp.raise_for_status()
    return resp.json()


def update_run(run_id: str, payload: dict[str, Any]) -> dict[str, Any]:
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
