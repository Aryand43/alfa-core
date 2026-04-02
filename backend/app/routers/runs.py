from __future__ import annotations

import json
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from ..auth import get_current_user
from ..database import get_session
from ..models import Project, Run, User
from ..schemas import RunCreate, RunCreateResponse, RunRead, RunUpdate

router = APIRouter(prefix="/runs", tags=["runs"])


@router.post("/", response_model=RunCreateResponse, status_code=status.HTTP_201_CREATED)
def create_run(
    body: RunCreate,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):
    project = session.get(Project, body.project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    run = Run(
        project_id=body.project_id,
        user_id=user.id,
        command=body.command,
        git_commit=body.git_commit,
        working_dir=body.working_dir,
        started_at=body.started_at,
        status="running" if body.started_at else "pending",
    )
    session.add(run)
    session.commit()
    session.refresh(run)
    return RunCreateResponse(id=run.id)


@router.get("/{run_id}", response_model=RunRead)
def get_run(
    run_id: str,
    session: Session = Depends(get_session),
    _user: User = Depends(get_current_user),
):
    run = session.get(Run, run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    return run


@router.patch("/{run_id}", response_model=RunRead)
def update_run(
    run_id: str,
    body: RunUpdate,
    session: Session = Depends(get_session),
    _user: User = Depends(get_current_user),
):
    run = session.get(Run, run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")

    patch = body.model_dump(exclude_unset=True)

    if "metrics_json" in patch and patch["metrics_json"] is not None:
        patch["metrics_json"] = json.dumps(patch["metrics_json"])

    for field, value in patch.items():
        setattr(run, field, value)

    run.updated_at = datetime.now(timezone.utc)
    session.add(run)
    session.commit()
    session.refresh(run)
    return run
