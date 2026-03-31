from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from ..auth import get_current_user
from ..database import get_session
from ..models import Lab, Run, User
from ..schemas import LabCreate, LabRead, RunRead

router = APIRouter(prefix="/labs", tags=["labs"])


@router.post("/", response_model=LabRead, status_code=status.HTTP_201_CREATED)
def create_lab(
    body: LabCreate,
    session: Session = Depends(get_session),
    _user: User = Depends(get_current_user),
):
    if session.exec(select(Lab).where(Lab.name == body.name)).first():
        raise HTTPException(status_code=409, detail="Lab name taken")

    lab = Lab(**body.model_dump())
    session.add(lab)
    session.commit()
    session.refresh(lab)
    return lab


@router.get("/", response_model=list[LabRead])
def list_labs(
    session: Session = Depends(get_session),
    _user: User = Depends(get_current_user),
):
    return list(session.exec(select(Lab)).all())


@router.get("/{lab_id}", response_model=LabRead)
def get_lab(
    lab_id: str,
    session: Session = Depends(get_session),
    _user: User = Depends(get_current_user),
):
    lab = session.get(Lab, lab_id)
    if not lab:
        raise HTTPException(status_code=404, detail="Lab not found")
    return lab


@router.get("/{lab_id}/runs", response_model=list[RunRead])
def list_lab_runs(
    lab_id: str,
    session: Session = Depends(get_session),
    _user: User = Depends(get_current_user),
):
    lab = session.get(Lab, lab_id)
    if not lab:
        raise HTTPException(status_code=404, detail="Lab not found")

    from ..models import Project

    project_ids = [p.id for p in session.exec(select(Project).where(Project.lab_id == lab_id)).all()]
    if not project_ids:
        return []
    return list(session.exec(select(Run).where(Run.project_id.in_(project_ids))).all())  # type: ignore[attr-defined]
