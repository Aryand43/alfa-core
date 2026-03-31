from __future__ import annotations

from sqlmodel import Session, SQLModel, create_engine

from .config import get_settings

_settings = get_settings()

connect_args = {"check_same_thread": False} if _settings.db_url.startswith("sqlite") else {}
engine = create_engine(_settings.db_url, echo=(_settings.env == "dev"), connect_args=connect_args)


def init_db() -> None:
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
