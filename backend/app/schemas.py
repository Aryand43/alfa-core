from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


# ── Auth ──────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    display_name: str = ""


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ── User ──────────────────────────────────────────────────────────────

class UserRead(BaseModel):
    id: str
    email: str
    display_name: str
    created_at: datetime


# ── Lab ───────────────────────────────────────────────────────────────

class LabCreate(BaseModel):
    name: str
    description: str = ""


class LabRead(BaseModel):
    id: str
    name: str
    description: str
    created_at: datetime


# ── Project ───────────────────────────────────────────────────────────

class ProjectCreate(BaseModel):
    name: str
    description: str = ""
    lab_id: Optional[str] = None


class ProjectRead(BaseModel):
    id: str
    name: str
    description: str
    owner_id: str
    lab_id: Optional[str]
    created_at: datetime


# ── Run ───────────────────────────────────────────────────────────────

class RunCreate(BaseModel):
    project_id: str
    command: str = ""
    git_commit: str = ""
    started_at: Optional[datetime] = None
    working_dir: str = ""


class RunCreateResponse(BaseModel):
    id: str


class RunUpdate(BaseModel):
    finished_at: Optional[datetime] = None
    status: Optional[str] = None
    exit_code: Optional[int] = None
    metrics_json: Optional[dict] = None


class RunRead(BaseModel):
    id: str
    status: str
    command: str
    git_commit: str
    working_dir: str
    exit_code: Optional[int]
    started_at: Optional[datetime]
    finished_at: Optional[datetime]
    metrics_json: Optional[str]
    project_id: str
    user_id: str
    created_at: datetime
    updated_at: datetime
