from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Optional

from sqlmodel import Field, Relationship, SQLModel


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _new_id() -> str:
    return uuid.uuid4().hex


# ── User ──────────────────────────────────────────────────────────────

class User(SQLModel, table=True):
    id: str = Field(default_factory=_new_id, primary_key=True)
    email: str = Field(index=True, unique=True)
    hashed_password: str
    display_name: str = ""
    created_at: datetime = Field(default_factory=_utcnow)

    projects: list["Project"] = Relationship(back_populates="owner")


# ── Lab ───────────────────────────────────────────────────────────────

class Lab(SQLModel, table=True):
    id: str = Field(default_factory=_new_id, primary_key=True)
    name: str = Field(index=True, unique=True)
    description: str = ""
    created_at: datetime = Field(default_factory=_utcnow)

    projects: list["Project"] = Relationship(back_populates="lab")


# ── Project ───────────────────────────────────────────────────────────

class Project(SQLModel, table=True):
    id: str = Field(default_factory=_new_id, primary_key=True)
    name: str = Field(index=True)
    description: str = ""
    created_at: datetime = Field(default_factory=_utcnow)

    owner_id: str = Field(foreign_key="user.id")
    lab_id: Optional[str] = Field(default=None, foreign_key="lab.id")

    owner: User = Relationship(back_populates="projects")
    lab: Optional[Lab] = Relationship(back_populates="projects")
    runs: list["Run"] = Relationship(back_populates="project")


# ── Run ───────────────────────────────────────────────────────────────

class Run(SQLModel, table=True):
    id: str = Field(default_factory=_new_id, primary_key=True)
    status: str = Field(default="pending")  # pending | running | completed | failed
    command: str = ""
    git_commit: str = ""
    started_at: Optional[datetime] = None
    finished_at: Optional[datetime] = None
    metrics: Optional[str] = None  # JSON blob
    created_at: datetime = Field(default_factory=_utcnow)

    project_id: str = Field(foreign_key="project.id")
    user_id: str = Field(foreign_key="user.id")

    project: Project = Relationship(back_populates="runs")
    user: User = Relationship()
