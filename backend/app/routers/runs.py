from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from ..auth import get_current_user
from ..database import get_session
from ..models import Project, Run, User
from ..schemas import RunCreate, RunRead, RunUpdate

router = APIRouter(prefix="/runs", tags=["runs"])


@router.post("/", response_model=RunRead, status_code=status.HTTP_201_CREATED)
def create_run(
    body: RunCreate,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):
    project = session.get(Project, body.project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    run = Run(**body.model_dump(), user_id=user.id)
    session.add(run)
    session.commit()
    session.refresh(run)
    return run


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

    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(run, field, value)

    session.add(run)
    session.commit()
    session.refresh(run)
    return run
