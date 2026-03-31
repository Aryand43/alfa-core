from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from ..auth import get_current_user
from ..database import get_session
from ..models import Project, Run, User
from ..schemas import ProjectCreate, ProjectRead, RunRead

router = APIRouter(prefix="/projects", tags=["projects"])


@router.post("/", response_model=ProjectRead, status_code=status.HTTP_201_CREATED)
def create_project(
    body: ProjectCreate,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):
    project = Project(**body.model_dump(), owner_id=user.id)
    session.add(project)
    session.commit()
    session.refresh(project)
    return project


@router.get("/", response_model=list[ProjectRead])
def list_my_projects(
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):
    return list(session.exec(select(Project).where(Project.owner_id == user.id)).all())


@router.get("/{project_id}", response_model=ProjectRead)
def get_project(
    project_id: str,
    session: Session = Depends(get_session),
    _user: User = Depends(get_current_user),
):
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.get("/{project_id}/runs", response_model=list[RunRead])
def list_project_runs(
    project_id: str,
    session: Session = Depends(get_session),
    _user: User = Depends(get_current_user),
):
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return list(session.exec(select(Run).where(Run.project_id == project_id)).all())
