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


class RunUpdate(BaseModel):
    status: Optional[str] = None
    metrics: Optional[str] = None
    started_at: Optional[datetime] = None
    finished_at: Optional[datetime] = None


class RunRead(BaseModel):
    id: str
    status: str
    command: str
    git_commit: str
    started_at: Optional[datetime]
    finished_at: Optional[datetime]
    metrics: Optional[str]
    project_id: str
    user_id: str
    created_at: datetime
